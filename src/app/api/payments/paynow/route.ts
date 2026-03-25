import { NextRequest, NextResponse } from "next/server";
import { Paynow } from "paynow";
import { EmailService } from "@/services/EmailService";
import {
  BookingService,
  CreateBookingRequest,
} from "@/services/BookingService";
import { BookingConfirmation, BookingItem } from "@/types/payment";

interface PaynowRequest {
  paymentIntentId: string;
  amount: number;
  currency: string;
  method: "ecocash" | "onemoney" | "zimswitch" | "visa" | "mastercard";
  phone?: string; // Required for mobile money
  email: string;
  // Booking details
  userId?: string;
  bookingItems?: BookingItem[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  specialRequests?: string;
}

// Initialize Paynow with environment variables
function initializePaynow() {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;

  if (!integrationId || !integrationKey) {
    throw new Error(
      "Paynow credentials not configured. Please set PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY"
    );
  }

  const paynow = new Paynow(integrationId, integrationKey);

  // Set return and result URLs
  paynow.resultUrl =
    process.env.PAYNOW_RESULT_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paynow/webhook`;
  paynow.returnUrl =
    process.env.PAYNOW_RETURN_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL}/booking/success`;

  return paynow;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaynowRequest = await request.json();
    const {
      paymentIntentId,
      amount,
      currency,
      method,
      phone,
      email,
      userId = "demo-user-id",
      bookingItems = [],
      checkIn,
      checkOut,
      guests,
      specialRequests,
    } = body;

    // Validate request
    if (!paymentIntentId || !amount || !email) {
      return NextResponse.json(
        { error: "Missing required fields: paymentIntentId, amount, email" },
        { status: 400 }
      );
    }

    // Validate mobile money phone number if required
    if (["ecocash", "onemoney"].includes(method) && !phone) {
      return NextResponse.json(
        { error: "Phone number is required for mobile money payments" },
        { status: 400 }
      );
    }

    // Validate phone number format for mobile money
    if (phone) {
      const phoneRegex = /^(077|078|071|073|076)\d{7}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          {
            error:
              "Invalid phone number format. Use Zimbabwe format (e.g., 0771234567)",
          },
          { status: 400 }
        );
      }
    }

    // Convert amount to cents (Paynow expects amounts in cents)
    const amountInCents = Math.round(amount * 100);

    // Create default booking items if none provided
    const defaultItems: BookingItem[] =
      bookingItems.length > 0
        ? bookingItems
        : [
            {
              id: "cmbokbt2s0000ubbtqjqmogga",
              type: "accommodation",
              name: "Victoria Falls Safari Lodge",
              description: "Luxury safari lodge with bushveld views",
              price: amount,
              currency,
              quantity: 1,
              checkIn: checkIn || new Date().toISOString(),
              checkOut:
                checkOut ||
                new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              guests: guests || 2,
              provider: {
                id: "victoria-falls-safari-lodge",
                name: "Victoria Falls Safari Lodge",
                email: "reservations@vfalls-safari.co.zw",
              },
              metadata: {
                hotelId: "cmbokbt2s0000ubbtqjqmogga",
              },
            },
          ];

    try {
      // Step 1: Create booking in database
      const bookingRequest: CreateBookingRequest = {
        userId,
        items: defaultItems,
        totalAmount: amount,
        currency,
        paymentMethod: "paynow",
        paymentIntentId,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        guests,
        specialRequests,
      };

      console.log("Creating booking with request:", bookingRequest);
      const booking = await BookingService.createBooking(bookingRequest);
      console.log("Booking created successfully:", booking.id);

      // Step 2: Initialize Paynow payment
      const paynow = initializePaynow();

      // Create a new payment
      const payment = paynow.createPayment(booking.confirmationNumber, email);

      // Add items to payment
      defaultItems.forEach((item) => {
        payment.add(
          item.name,
          Math.round(item.price * item.quantity * 100) // Convert to cents
        );
      });

      // Send payment to Paynow
      let response;

      switch (method) {
        case "ecocash":
          console.log("Initiating EcoCash payment for phone:", phone);
          response = await paynow.sendMobile(payment, phone!, "ecocash");
          break;
        case "onemoney":
          console.log("Initiating OneMoney payment for phone:", phone);
          response = await paynow.sendMobile(payment, phone!, "onemoney");
          break;
        default:
          console.log("Initiating web payment for method:", method);
          response = await paynow.send(payment);
          break;
      }

      console.log("Paynow response:", response);

      if (response.success) {
        // Create payment record
        await BookingService.createPayment({
          bookingId: booking.id,
          userId,
          amount,
          currency: currency.toUpperCase(),
          method: "paynow",
          status: "pending",
          paynowReference: response.reference,
          metadata: {
            paynowPollUrl: response.pollUrl,
            paymentMethod: method,
            instructions: response.instructions,
          },
        });

        // Update booking status
        await BookingService.updateBookingStatus(booking.id, "PENDING");

        // For mobile money, the payment might be completed immediately
        if (["ecocash", "onemoney"].includes(method)) {
          // Poll for payment status
          const statusResponse = await paynow.pollTransaction(response.pollUrl);

          if (statusResponse.paid) {
            await BookingService.updateBookingStatus(booking.id, "CONFIRMED");
            await BookingService.updatePaymentStatus(booking.id, "COMPLETED");

            // Send confirmation email
            const confirmation: BookingConfirmation = {
              id: booking.id,
              paymentIntentId,
              userId,
              items: defaultItems,
              totalAmount: amount,
              currency: currency.toUpperCase(),
              status: "confirmed",
              paymentStatus: "paid",
              createdAt: new Date(),
              bookingDate: booking.createdAt.toISOString(),
              confirmationNumber: booking.confirmationNumber,
              customerInfo: {
                name: "Demo User",
                email: email,
              },
              metadata: {
                paynowReference: response.reference,
                paymentMethod: method,
              },
            };

            try {
              await EmailService.sendBookingConfirmation(confirmation);
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
            }

            return NextResponse.json({
              success: true,
              status: "completed",
              booking: {
                id: booking.id,
                confirmationNumber: booking.confirmationNumber,
                totalAmount: amount,
                currency: currency.toUpperCase(),
                status: "confirmed",
                paymentStatus: "paid",
              },
              payment: {
                reference: response.reference,
                method: method,
                instructions: response.instructions,
              },
            });
          }
        }

        // For web payments or pending mobile money payments
        return NextResponse.json({
          success: true,
          status: response.status || "pending",
          booking: {
            id: booking.id,
            confirmationNumber: booking.confirmationNumber,
            totalAmount: amount,
            currency: currency.toUpperCase(),
            status: "pending",
          },
          payment: {
            reference: response.reference,
            redirectUrl: response.redirectUrl,
            pollUrl: response.pollUrl,
            method: method,
            instructions: response.instructions,
          },
        });
      } else {
        // Payment creation failed
        console.error("Paynow payment creation failed:", response.error);

        // Update booking status to failed
        await BookingService.updateBookingStatus(booking.id, "CANCELLED");

        return NextResponse.json(
          {
            error: "Payment creation failed",
            details: response.error || "Unknown error",
          },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error("Database error during booking creation:", dbError);
      return NextResponse.json(
        { error: "Failed to create booking in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing Paynow payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/services/EmailService";
import {
  BookingService,
  CreateBookingRequest,
} from "@/services/BookingService";
import { BookingConfirmation, BookingItem } from "@/types/payment";
import { requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface MobileMoneyRequest {
  paymentIntentId: string;
  provider: "ecocash" | "onemoney" | "telecash";
  phoneNumber: string;
  amount: number;
  currency: string;
  // Booking details
  userId?: string;
  bookingItems?: BookingItem[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const body: MobileMoneyRequest = await request.json();
    const {
      paymentIntentId,
      provider,
      phoneNumber,
      amount,
      currency,
      userId = user.id,
      bookingItems = [],
      checkIn,
      checkOut,
      guests,
      specialRequests,
    } = body;

    // Validate request
    if (!paymentIntentId || !provider || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number format (Zimbabwe numbers)
    const phoneRegex = /^(077|078|071|073|076)\d{6}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate provider against phone number prefix
    const providerPrefixes = {
      ecocash: ["077", "078"],
      onemoney: ["071", "073"],
      telecash: ["076"],
    };

    const phonePrefix = phoneNumber.substring(0, 3);
    if (!providerPrefixes[provider].includes(phonePrefix)) {
      return NextResponse.json(
        { error: "Phone number does not match selected provider" },
        { status: 400 }
      );
    }

    // Create default booking items if none provided (for demo purposes)
    const defaultItems: BookingItem[] =
      bookingItems.length > 0
        ? bookingItems
        : [
            {
              id: "cmbokbt2s0000ubbtqjqmogga", // Use real hotel ID from seeded data
              type: "accommodation",
              name: "Victoria Falls Safari Lodge",
              description: "Luxury safari lodge with bushveld views",
              price: amount / 100, // Convert from cents
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
                hotelId: "cmbokbt2s0000ubbtqjqmogga", // Use real hotel ID from seeded data
                // roomId: "standard-room-1" // Remove roomId since we don't have rooms seeded
              },
            },
          ];

    try {
      // Step 1: Create booking in database
      const bookingRequest: CreateBookingRequest = {
        userId,
        items: defaultItems,
        totalAmount: amount / 100, // Convert from cents
        currency,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        guests,
        specialRequests,
        paymentIntentId,
      };

      console.log(
        "[booking] Creating booking with request:",
        JSON.stringify(bookingRequest, null, 2)
      );

      const booking = await BookingService.createBooking(bookingRequest);
      console.log("[booking] Created successfully:", booking);

      // Step 2: Create payment record
      const payment = await BookingService.createPayment({
        bookingId: booking.id,
        userId,
        amount: amount / 100, // Convert from cents
        currency,
        method: "MOBILE_MONEY",
        mobileProvider: provider,
        phoneNumber,
        metadata: {
          paymentIntentId,
          provider,
          phoneNumber: `***${phoneNumber.slice(-3)}`,
        },
      });

      // Step 3: Simulate mobile money payment process
      const simulatePayment = async () => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate random success/failure (90% success rate for demo)
        const isSuccess = Math.random() > 0.1;

        if (!isSuccess) {
          throw new Error("Payment declined by mobile money provider");
        }

        return {
          transactionId: `MM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          status: "completed",
          confirmationNumber: `${provider.toUpperCase()}-${Date.now()}`,
        };
      };

      const paymentResult = await simulatePayment();

      // Step 4: Update payment status to completed
      await BookingService.updatePaymentStatus(payment.id, "COMPLETED", {
        transactionId: paymentResult.transactionId,
        provider,
      });

      // Update booking confirmation with payment success
      booking.status = "confirmed";
      booking.paymentStatus = "paid";

      console.log(`Mobile Money Payment Processed:`, {
        paymentIntentId,
        provider,
        phoneNumber: `***${phoneNumber.slice(-3)}`,
        amount,
        currency,
        transactionId: paymentResult.transactionId,
        bookingId: booking.id,
        confirmationNumber: booking.confirmationNumber,
      });

      // Step 5: Send mobile money payment confirmation email
      try {
        await EmailService.sendMobileMoneyConfirmation(
          booking,
          provider,
          phoneNumber,
          paymentResult.transactionId
        );
      } catch (emailError) {
        console.warn("Failed to send confirmation email:", emailError);
        // Don't fail the payment if email fails
      }

      return NextResponse.json({
        success: true,
        transactionId: paymentResult.transactionId,
        confirmationNumber: booking.confirmationNumber,
        bookingId: booking.id,
        status: paymentResult.status,
        message: `Payment successful via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        booking: {
          id: booking.id,
          confirmationNumber: booking.confirmationNumber,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        },
      });
    } catch (error) {
      console.error("[booking] Mobile money booking creation failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        bookingData: { userId, amount, currency, items: defaultItems },
      });
      return NextResponse.json(
        {
          error: "Failed to create booking",
          details: error instanceof Error ? error.message : "Unknown error",
          debug:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.stack
                : String(error)
              : undefined,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Mobile money payment error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Please sign in before paying." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for checking payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID required" },
      { status: 400 }
    );
  }

  // In a real implementation, you would check the transaction status
  // with the mobile money provider's API

  return NextResponse.json({
    transactionId,
    status: "completed",
    message: "Payment completed successfully",
  });
}

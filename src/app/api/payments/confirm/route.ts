import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingConfirmation, BookingItem } from "@/types/payment";
import {
  BookingService,
  CreateBookingRequest,
} from "@/services/BookingService";
import { EmailService } from "@/services/EmailService";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `OFF2ZIM-${timestamp}-${randomStr}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, userId = "demo-user-id" } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not succeeded" },
        { status: 400 }
      );
    }

    // Parse booking items from metadata
    const items = JSON.parse(paymentIntent.metadata.items || "[]");

    // Convert items to BookingItem format
    const bookingItems: BookingItem[] = items.map((item: any) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description || `${item.name} booking`,
      price: item.price,
      currency: paymentIntent.currency.toUpperCase(),
      quantity: item.quantity,
      metadata: {
        hotelId: item.type === "accommodation" ? item.id : undefined,
        activityId: item.type === "activity" ? item.id : undefined,
        restaurantId: item.type === "dining" ? item.id : undefined,
        eventId: item.type === "event" ? item.id : undefined,
      },
    }));

    try {
      // Create booking in database
      const bookingRequest: CreateBookingRequest = {
        userId,
        items: bookingItems,
        totalAmount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        paymentMethod: "stripe",
        paymentIntentId: paymentIntent.id,
        checkIn: bookingItems[0]?.checkIn
          ? new Date(bookingItems[0].checkIn)
          : undefined,
        checkOut: bookingItems[0]?.checkOut
          ? new Date(bookingItems[0].checkOut)
          : undefined,
        guests: bookingItems[0]?.guests,
        specialRequests: "",
      };

      const booking = await BookingService.createBooking(bookingRequest);

      // Create payment record
      await BookingService.createPayment({
        bookingId: booking.id,
        userId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        method: "stripe",
        status: "completed",
        stripePaymentId: paymentIntent.id,
      });

      // Create booking confirmation response
      const confirmation: BookingConfirmation = {
        id: booking.id,
        paymentIntentId: paymentIntent.id,
        userId,
        items: bookingItems,
        totalAmount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: new Date(),
        bookingDate: booking.createdAt.toISOString(),
        confirmationNumber: booking.confirmationNumber,
        customerInfo: {
          name: "Demo User", // This should come from user data
          email: "demo@off2zim.com", // This should come from user data
        },
        metadata: paymentIntent.metadata,
      };

      // Send confirmation email
      try {
        await EmailService.sendBookingConfirmation(confirmation);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the booking if email fails
      }

      return NextResponse.json(confirmation);
    } catch (dbError) {
      console.error("Database error during booking creation:", dbError);
      return NextResponse.json(
        { error: "Failed to create booking in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}

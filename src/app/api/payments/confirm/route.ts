import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingConfirmation, BookingItem } from "@/types/payment";
import {
  BookingService,
  CreateBookingRequest,
} from "@/services/BookingService";
import { EmailService } from "@/services/EmailService";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    const { user } = await requireSessionUser();
    const { paymentIntentId } = await request.json();

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
      currency: item.currency || paymentIntent.currency.toUpperCase(),
      quantity: item.quantity,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: item.guests,
      provider: item.provider,
      metadata: {
        ...item.metadata,
      },
    }));

    try {
      // Create booking in database
      const bookingRequest: CreateBookingRequest = {
        userId: user.id,
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
      const payment = await BookingService.createPayment({
        bookingId: booking.id,
        userId: user.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        method: "stripe",
        status: "completed",
        stripePaymentId: paymentIntent.id,
      });

      await BookingService.updatePaymentStatus(payment.id, "COMPLETED", {
        stripePaymentId: paymentIntent.id,
      });

      // Create booking confirmation response
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      const confirmation: BookingConfirmation = {
        id: booking.id,
        paymentIntentId: paymentIntent.id,
        userId: user.id,
        items: bookingItems,
        totalAmount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: new Date(),
        bookingDate: booking.createdAt.toISOString(),
        confirmationNumber: booking.confirmationNumber,
        customerInfo: {
          name:
            currentUser?.name ||
            [currentUser?.firstName, currentUser?.lastName]
              .filter(Boolean)
              .join(" ") ||
            user.email,
          email: currentUser?.email || user.email,
          phone: currentUser?.phone || undefined,
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Please sign in before confirming payment." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}

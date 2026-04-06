import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingItem } from "@/types/payment";
import { requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const { items }: { items: BookingItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Calculate total amount
    const amount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(
        items.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          guests: item.guests,
          provider: item.provider,
          metadata: item.metadata,
        }))
      ),
      booking_type: "off2zim_booking",
      user_id: user.id,
    },
    });

    return NextResponse.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: "usd",
      status: paymentIntent.status,
      items,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Please sign in before checking out." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

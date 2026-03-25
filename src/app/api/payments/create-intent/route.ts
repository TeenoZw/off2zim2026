import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingItem } from "@/types/payment";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
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
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        booking_type: "off2zim_booking",
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
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

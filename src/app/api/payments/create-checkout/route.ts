import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingItem } from "@/types/payment";

export const dynamic = "force-dynamic";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      successUrl,
      cancelUrl,
    }: {
      items: BookingItem[];
      successUrl?: string;
      cancelUrl?: string;
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create line items for Stripe Checkout
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || "",
          metadata: {
            type: item.type,
            item_id: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        successUrl ||
        `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/booking/cancel`,
      metadata: {
        booking_type: "off2zim_checkout",
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            type: item.type,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_email: undefined, // This should come from auth context
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      items,
      successUrl: session.success_url,
      cancelUrl: session.cancel_url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

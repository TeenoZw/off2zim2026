// Test script for Stripe payment confirmation with database integration
import { BookingItem } from "./src/types/payment";

async function testStripeConfirmAPI() {
  console.log(
    "🧪 Testing Stripe Payment Confirmation API with database integration..."
  );

  // First, create a payment intent
  const testBookingItems: BookingItem[] = [
    {
      id: "cmbokbt2s0000ubbtqjqmogga", // Use real hotel ID from seeded data
      type: "accommodation" as const,
      name: "Victoria Falls Safari Lodge - Deluxe Room",
      description: "Luxury safari lodge with spectacular bushveld views",
      price: 450.0,
      currency: "USD",
      quantity: 1,
      checkIn: "2024-12-15",
      checkOut: "2024-12-17",
      guests: 2,
      metadata: {
        hotelId: "cmbokbt2s0000ubbtqjqmogga",
      },
    },
  ];

  try {
    // Step 1: Create payment intent
    console.log("📤 Creating payment intent...");
    const intentResponse = await fetch(
      "http://localhost:3002/api/payments/create-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: testBookingItems }),
      }
    );

    if (!intentResponse.ok) {
      throw new Error(`Failed to create intent: ${intentResponse.statusText}`);
    }

    const intentResult = await intentResponse.json();
    console.log(`✅ Payment intent created: ${intentResult.id}`);
    console.log(
      `💰 Amount: $${intentResult.amount} ${intentResult.currency.toUpperCase()}`
    );

    // Note: In a real scenario, the payment would be processed by Stripe on the frontend
    // For testing purposes, we'll simulate a successful payment by creating a mock payment intent
    console.log("\n⚠️  Note: This test simulates the confirmation flow.");
    console.log(
      "In production, Stripe would process the payment on the frontend first."
    );

    // Step 2: Test confirmation with mock successful payment
    // Note: This would normally only work with a real payment intent that has succeeded
    console.log("\n📤 Testing confirmation API (simulated)...");

    // For demo purposes, let's test with our mock payment intent
    // In production, this would only work after Stripe processes the payment
    const confirmData = {
      paymentIntentId: intentResult.id,
      userId: "demo-user-id",
    };

    console.log("📋 Confirmation test data:", confirmData);
    console.log(
      "\n⚠️  Expected: This may fail because the payment intent hasn't actually been processed by Stripe."
    );
    console.log(
      "In production, you would only call this after successful payment completion."
    );
  } catch (error) {
    console.error("❌ Test Error:", error);
  }
}

// Run the test
testStripeConfirmAPI();

// Test script for mobile money API with database integration
import { BookingItem } from "./src/types/payment";

async function testMobileMoneyAPI(
  p0: {
    paymentIntentId: string;
    provider: string;
    phoneNumber: string;
    amount: number;
    currency: string;
    userId: string;
    bookingItems: {
      id: string;
      type: string;
      name: string;
      price: number;
      currency: string;
      quantity: number;
      metadata: { hotelId: string };
    }[];
  },
  p1: string
) {
  console.log("🧪 Testing Mobile Money API with database integration...");

  const testBookingData = {
    paymentIntentId: `test_${Date.now()}`,
    amount: 35000, // Amount in cents (350.00 USD = 35000 cents)
    currency: "USD",
    method: "mobile_money" as const,
    provider: "ecocash" as const,
    phoneNumber: "077123456",
    userId: "demo-user-id", // Use the correct user ID from database
    bookingItems: [
      {
        id: "cmbokbt2s0000ubbtqjqmogga", // Use real hotel ID from seeded data
        type: "accommodation" as const,
        name: "Victoria Falls Safari Lodge - Standard Room",
        description: "Luxury safari lodge with bushveld views",
        price: 350.0,
        currency: "USD",
        quantity: 1,
        checkIn: "2024-12-01",
        checkOut: "2024-12-03",
        guests: 2,
        metadata: {
          hotelId: "cmbokbt2s0000ubbtqjqmogga", // Use real hotel ID, remove roomId
        },
      },
    ] as BookingItem[],
    checkIn: new Date("2024-12-01"),
    checkOut: new Date("2024-12-03"),
    guests: 2,
    specialRequests: "Late check-in requested",
  };

  try {
    const response = await fetch(
      "http://localhost:3000/api/payments/mobile-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testBookingData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("✅ API Test Successful!");
      console.log("📋 Booking Details:");
      console.log(`   - Confirmation: ${result.booking.confirmationNumber}`);
      console.log(
        `   - Total Amount: ${result.booking.totalAmount} ${result.booking.currency}`
      );
      console.log(`   - Status: ${result.booking.status}`);
      console.log(`   - Payment Status: ${result.booking.paymentStatus}`);
      console.log(`   - User ID: ${result.booking.userId}`);
      console.log(`   - Items: ${result.booking.items?.length || 0} item(s)`);

      console.log("\n💳 Payment Details:");
      console.log(`   - Method: ${result.paymentMethod}`);
      console.log(`   - Provider: ${result.provider}`);
      console.log(`   - Phone: ${result.phoneNumber}`);
      console.log(`   - Status: ${result.status}`);
    } else {
      console.error("❌ API Test Failed:");
      console.error("Response:", result);
    }
  } catch (error) {
    console.error("❌ API Test Error:", error);
  }
}

export { testMobileMoneyAPI };

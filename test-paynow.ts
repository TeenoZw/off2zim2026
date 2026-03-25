// Test script for Paynow payment API
// Run with: npx tsx test-paynow.ts

const API_BASE = "http://localhost:3000/api";

interface PaynowTestRequest {
  paymentIntentId: string;
  amount: number;
  currency: string;
  method: "ecocash" | "onemoney" | "zimswitch" | "visa" | "mastercard";
  phone?: string;
  email: string;
  userId?: string;
  bookingItems?: any[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  specialRequests?: string;
}

async function testPaynowPayment(
  testCase: PaynowTestRequest,
  description: string
) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log("Request:", JSON.stringify(testCase, null, 2));

  try {
    const response = await fetch(`${API_BASE}/payments/paynow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCase),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success Response:", JSON.stringify(data, null, 2));

      if (data.payment?.pollUrl) {
        console.log(`📊 Poll URL for status: ${data.payment.pollUrl}`);
      }

      if (data.payment?.redirectUrl) {
        console.log(`🔗 Redirect URL: ${data.payment.redirectUrl}`);
      }

      return data;
    } else {
      console.log("❌ Error Response:", JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
    return null;
  }
}

async function runPaynowTests() {
  console.log("🚀 Starting Paynow Payment API Tests");
  console.log("=====================================");

  // Test 1: EcoCash Payment
  await testPaynowPayment(
    {
      paymentIntentId: "test-ecocash-" + Date.now(),
      amount: 150.0,
      currency: "USD",
      method: "ecocash",
      phone: "0771234567", // Zimbabwe EcoCash format
      email: "test@example.com",
      userId: "demo-user-id",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      specialRequests: "Test EcoCash booking",
    },
    "EcoCash Mobile Money Payment"
  );

  // Test 2: OneMoney Payment
  await testPaynowPayment(
    {
      paymentIntentId: "test-onemoney-" + Date.now(),
      amount: 200.0,
      currency: "USD",
      method: "onemoney",
      phone: "0781234567", // Zimbabwe OneMoney format
      email: "test@example.com",
      userId: "demo-user-id",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 1,
      specialRequests: "Test OneMoney booking",
    },
    "OneMoney Mobile Money Payment"
  );

  // Test 3: ZimSwitch Web Payment
  await testPaynowPayment(
    {
      paymentIntentId: "test-zimswitch-" + Date.now(),
      amount: 300.0,
      currency: "USD",
      method: "zimswitch",
      email: "test@example.com",
      userId: "demo-user-id",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 4,
      specialRequests: "Test ZimSwitch banking",
    },
    "ZimSwitch Bank Card Payment"
  );

  // Test 4: Visa Card Payment
  await testPaynowPayment(
    {
      paymentIntentId: "test-visa-" + Date.now(),
      amount: 450.0,
      currency: "USD",
      method: "visa",
      email: "test@example.com",
      userId: "demo-user-id",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      specialRequests: "Test Visa card payment",
    },
    "Visa Credit Card Payment"
  );

  // Test 5: Custom Booking Items
  await testPaynowPayment(
    {
      paymentIntentId: "test-custom-" + Date.now(),
      amount: 850.0,
      currency: "USD",
      method: "ecocash",
      phone: "0771234567",
      email: "test@example.com",
      userId: "demo-user-id",
      bookingItems: [
        {
          id: "cmbokbt2s0000ubbtqjqmogga",
          type: "accommodation",
          name: "Victoria Falls Safari Lodge",
          description: "Luxury safari lodge",
          price: 350.0,
          currency: "USD",
          quantity: 2,
          checkIn: new Date().toISOString(),
          checkOut: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          guests: 4,
          provider: {
            id: "victoria-falls-safari-lodge",
            name: "Victoria Falls Safari Lodge",
            email: "reservations@vfalls-safari.co.zw",
          },
          metadata: {
            hotelId: "cmbokbt2s0000ubbtqjqmogga",
          },
        },
        {
          id: "activity-1",
          type: "activity",
          name: "Victoria Falls Bridge Bungee Jump",
          description: "Adrenaline bungee jumping experience",
          price: 150.0,
          currency: "USD",
          quantity: 1,
          provider: {
            id: "shearwater-adventures",
            name: "Shearwater Adventures",
            email: "bookings@shearwater.co.zw",
          },
        },
      ],
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 4,
      specialRequests: "Multi-item booking test",
    },
    "Multi-Item Booking with Custom Items"
  );

  // Test 6: Error Cases
  console.log("\n🔍 Testing Error Cases");
  console.log("======================");

  // Missing phone for mobile money
  await testPaynowPayment(
    {
      paymentIntentId: "test-error-" + Date.now(),
      amount: 100.0,
      currency: "USD",
      method: "ecocash",
      // phone missing
      email: "test@example.com",
    },
    "Error: Missing phone number for EcoCash"
  );

  // Invalid phone format
  await testPaynowPayment(
    {
      paymentIntentId: "test-error-" + Date.now(),
      amount: 100.0,
      currency: "USD",
      method: "ecocash",
      phone: "123456789", // Invalid format
      email: "test@example.com",
    },
    "Error: Invalid phone number format"
  );

  // Missing required fields
  await testPaynowPayment(
    {
      paymentIntentId: "", // Empty payment intent
      amount: 0, // Zero amount
      currency: "USD",
      method: "ecocash",
      phone: "0771234567",
      email: "", // Empty email
    },
    "Error: Missing required fields"
  );

  console.log("\n🏁 Paynow Tests Completed");
  console.log("==========================");
}

// Check if Paynow environment variables are configured
function checkEnvironment() {
  console.log("🔧 Checking Environment Configuration");
  console.log("====================================");

  const requiredEnvVars = ["PAYNOW_INTEGRATION_ID", "PAYNOW_INTEGRATION_KEY"];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.log("⚠️  Missing environment variables:");
    missing.forEach((envVar) => console.log(`   - ${envVar}`));
    console.log("\n📝 Please configure these in your .env.local file");
    console.log("   You can use test values for now:");
    console.log("   PAYNOW_INTEGRATION_ID=test_integration_id");
    console.log("   PAYNOW_INTEGRATION_KEY=test_integration_key");
    return false;
  }

  console.log("✅ Environment variables configured");
  return true;
}

// Run the tests
if (require.main === module) {
  console.log("Starting Paynow API Testing Suite");
  console.log("==================================\n");

  if (checkEnvironment()) {
    runPaynowTests().catch(console.error);
  } else {
    console.log(
      "\n❌ Please configure environment variables before running tests"
    );
  }
}

export { testPaynowPayment, runPaynowTests };

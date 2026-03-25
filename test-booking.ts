import { PrismaClient } from "@prisma/client";
import { BookingService } from "./src/services/BookingService";
import { BookingItem } from "./src/types/payment";

const prisma = new PrismaClient();

async function testBookingCreation() {
  console.log("🔍 Testing booking creation directly...");

  try {
    // Test data
    const bookingRequest = {
      userId: "demo-user-id",
      paymentIntentId: `test_${Date.now()}`,
      totalAmount: 350.0,
      currency: "USD",
      items: [
        {
          id: "cmbomayqj0001dhzy47iq5ct5", // Real hotel ID from seeded data
          type: "accommodation" as const,
          name: "Victoria Falls Safari Lodge",
          description: "Luxury safari lodge with bushveld views",
          price: 350.0,
          currency: "USD",
          quantity: 1,
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          guests: 2,
          provider: {
            id: "victoria-falls-safari-lodge",
            name: "Victoria Falls Safari Lodge",
            email: "reservations@vfalls-safari.co.zw",
          },
          metadata: {
            hotelId: "cmbomayqj0001dhzy47iq5ct5",
          },
        },
      ] as BookingItem[],
    };

    console.log(
      "📝 Creating booking with data:",
      JSON.stringify(bookingRequest, null, 2)
    );

    const booking = await BookingService.createBooking(bookingRequest);
    console.log("✅ Booking created successfully:", booking);
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testBookingCreation();

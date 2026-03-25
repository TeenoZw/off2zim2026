import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testHotelBooking() {
  console.log("🔍 Testing hotel booking creation...");

  try {
    // Check available hotels
    const hotels = await prisma.hotel.findMany();
    console.log(
      "Available hotels:",
      hotels.map((h) => ({ id: h.id, name: h.name }))
    );

    if (hotels.length === 0) {
      console.log("❌ No hotels found");
      return;
    }

    const selectedHotel = hotels[0];
    console.log("Using hotel:", selectedHotel.name);

    // Generate confirmation number
    const confirmationNumber = `OFF2ZIM-${Date.now().toString(36).toUpperCase()}`;

    // Create hotel booking
    const booking = await prisma.booking.create({
      data: {
        userId: "demo-user-id",
        bookingType: "ACCOMMODATION",
        status: "PENDING",
        totalAmount: 350.0,
        currency: "USD",
        confirmationNumber,
        hotelId: selectedHotel.id,
        checkIn: new Date("2025-06-15"),
        checkOut: new Date("2025-06-17"),
        guests: 2,
        metadata: JSON.stringify({
          paymentIntentId: `test_${Date.now()}`,
          testData: true,
        }),
      },
    });

    console.log("✅ Hotel booking created successfully:", booking);
  } catch (error) {
    console.error("❌ Error creating hotel booking:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testHotelBooking();

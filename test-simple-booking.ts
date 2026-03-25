import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testSimpleBooking() {
  console.log("🔍 Testing simple booking creation...");

  try {
    // Generate confirmation number
    const confirmationNumber = `OFF2ZIM-${Date.now().toString(36).toUpperCase()}`;

    // Create booking without includes
    const booking = await prisma.booking.create({
      data: {
        userId: "demo-user-id",
        bookingType: "ACCOMMODATION",
        status: "PENDING",
        totalAmount: 350.0,
        currency: "USD",
        confirmationNumber,
        hotelId: "cmbomayqj0001dhzy47iq5ct5",
        metadata: JSON.stringify({
          paymentIntentId: `test_${Date.now()}`,
          testData: true,
        }),
      },
    });

    console.log("✅ Simple booking created successfully:", booking);

    // Now try with includes
    console.log("🔍 Testing with includes...");
    const bookingWithIncludes = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        hotel: true,
        room: true,
        activity: true,
        restaurant: true,
        event: true,
      },
    });

    console.log("✅ Booking with includes:", bookingWithIncludes);
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

testSimpleBooking();

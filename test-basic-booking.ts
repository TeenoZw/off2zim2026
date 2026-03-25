import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testBasicBooking() {
  console.log("🔍 Testing basic booking creation...");

  try {
    // First check all users
    const allUsers = await prisma.user.findMany();
    console.log("All users:", allUsers);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: "demo-user-id" },
    });

    console.log("User lookup result:", user);

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("✅ User found:", user);

    // Generate confirmation number
    const confirmationNumber = `OFF2ZIM-${Date.now().toString(36).toUpperCase()}`;

    // Create minimal booking without foreign keys
    const booking = await prisma.booking.create({
      data: {
        userId: "demo-user-id",
        bookingType: "ACCOMMODATION",
        status: "PENDING",
        totalAmount: 250.0,
        currency: "USD",
        confirmationNumber,
        metadata: JSON.stringify({
          paymentIntentId: `test_${Date.now()}`,
          testData: true,
        }),
      },
    });

    console.log("✅ Basic booking created successfully:", booking);
  } catch (error) {
    console.error("❌ Error creating basic booking:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBasicBooking();

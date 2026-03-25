import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPrismaConnection() {
  console.log("🔍 Testing Prisma connection...");

  try {
    // Test basic connection
    const users = await prisma.user.findMany();
    console.log("✅ Users found:", users.length);

    const hotels = await prisma.hotel.findMany();
    console.log("✅ Hotels found:", hotels.length);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();

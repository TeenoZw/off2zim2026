// Quick database check script
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database content...");

    const hotels = await prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 3,
    });

    console.log("🏨 Hotels:", hotels);

    const activities = await prisma.activity.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 3,
    });

    console.log("🎯 Activities:", activities);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("🔍 Checking users in database...");

    const users = await prisma.user.findMany();
    console.log(`👥 Found ${users.length} users:`, users);

    if (users.length === 0) {
      console.log("📝 Creating demo user...");
      const demoUser = await prisma.user.create({
        data: {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@off2zim.com",
          phone: "+263771234567",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("✅ Created demo user:", demoUser);
    }
  } catch (error) {
    console.error("❌ Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

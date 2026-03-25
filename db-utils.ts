#!/usr/bin/env npx tsx
// Database utility script for Off2Zim platform
// Usage: npx tsx db-utils.ts [command]

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function showStats() {
  console.log("📊 Database Statistics\n");

  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.hotel.count(),
      prisma.activity.count(),
      prisma.restaurant.count(),
      prisma.event.count(),
      prisma.booking.count(),
      prisma.payment.count(),
    ]);

    const [users, hotels, activities, restaurants, events, bookings, payments] =
      stats;

    console.log(`👥 Users: ${users}`);
    console.log(`🏨 Hotels: ${hotels}`);
    console.log(`🎯 Activities: ${activities}`);
    console.log(`🍽️  Restaurants: ${restaurants}`);
    console.log(`🎭 Events: ${events}`);
    console.log(`📅 Bookings: ${bookings}`);
    console.log(`💰 Payments: ${payments}`);
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
  }
}

async function showRecentBookings() {
  console.log("📋 Recent Bookings (Last 5)\n");

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { email: true } },
        hotel: { select: { name: true } },
        activity: { select: { name: true } },
        restaurant: { select: { name: true } },
        event: { select: { name: true } },
        payments: { select: { method: true, status: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.confirmationNumber}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Amount: ${booking.totalAmount} ${booking.currency}`);
      console.log(`   User: ${booking.user?.email || "Unknown"}`);
      console.log(
        `   Service: ${booking.hotel?.name || booking.activity?.name || booking.restaurant?.name || booking.event?.name || "Unknown"}`
      );
      console.log(`   Payments: ${booking.payments.length}`);
      console.log(`   Created: ${booking.createdAt.toLocaleDateString()}\n`);
    });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
  }
}

async function showAvailableServices() {
  console.log("🌟 Available Services\n");

  try {
    console.log("🏨 HOTELS:");
    const hotels = await prisma.hotel.findMany({
      select: { id: true, name: true, city: true, rating: true },
    });
    hotels.forEach((hotel, index) => {
      console.log(
        `   ${index + 1}. ${hotel.name} (${hotel.city}) - ⭐ ${hotel.rating}/5`
      );
      console.log(`      ID: ${hotel.id}`);
    });

    console.log("\n🎯 ACTIVITIES:");
    const activities = await prisma.activity.findMany({
      select: { id: true, name: true, location: true, price: true },
    });
    activities.forEach((activity, index) => {
      console.log(
        `   ${index + 1}. ${activity.name} (${activity.location}) - $${activity.price}`
      );
      console.log(`      ID: ${activity.id}`);
    });

    console.log("\n🍽️  RESTAURANTS:");
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, cuisine: true, priceRange: true },
    });
    restaurants.forEach((restaurant, index) => {
      console.log(
        `   ${index + 1}. ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.priceRange}`
      );
      console.log(`      ID: ${restaurant.id}`);
    });

    console.log("\n🎭 EVENTS:");
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        price: true,
      },
    });
    events.forEach((event, index) => {
      console.log(
        `   ${index + 1}. ${event.name} (${event.location}) - $${event.price}`
      );
      console.log(`      Date: ${event.startDate.toLocaleDateString()}`);
      console.log(`      ID: ${event.id}`);
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
  }
}

async function testDatabaseConnection() {
  console.log("🔌 Testing Database Connection...\n");

  try {
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Query test successful! Found ${userCount} users.`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

async function main() {
  const command = process.argv[2] || "help";

  switch (command) {
    case "stats":
      await showStats();
      break;
    case "bookings":
      await showRecentBookings();
      break;
    case "services":
      await showAvailableServices();
      break;
    case "test":
      await testDatabaseConnection();
      break;
    case "help":
    default:
      console.log("📚 Database Utility Commands:\n");
      console.log("  npx tsx db-utils.ts stats     - Show database statistics");
      console.log("  npx tsx db-utils.ts bookings  - Show recent bookings");
      console.log("  npx tsx db-utils.ts services  - Show available services");
      console.log("  npx tsx db-utils.ts test      - Test database connection");
      console.log("  npx tsx db-utils.ts help      - Show this help message");
      break;
  }

  await prisma.$disconnect();
}

main().catch(console.error);

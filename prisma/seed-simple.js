const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Create a test user first
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@off2zim.com",
        phone: "+263123456789",
        nationality: "Zimbabwe",
      },
    });

    console.log("✅ Created test user:", testUser.id);

    // Create Hotels
    const hotel1 = await prisma.hotel.create({
      data: {
        name: "Victoria Falls Safari Lodge",
        description:
          "Luxury safari lodge overlooking the African bushveld with stunning views of Victoria Falls spray.",
        address: "Squire Cummings Road, Victoria Falls",
        city: "Victoria Falls",
        category: "Luxury Safari Lodge",
        priceRange: "$300-$600",
        rating: 4.8,
        amenities: JSON.stringify([
          "Pool",
          "Spa",
          "Restaurant",
          "Bar",
          "Game Viewing",
          "Airport Transfer",
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        ]),
      },
    });

    const hotel2 = await prisma.hotel.create({
      data: {
        name: "The Kingdom at Victoria Falls",
        description:
          "Iconic luxury hotel offering unparalleled views of Victoria Falls and the Zambezi River.",
        address: "Victoria Falls Hotel Road, Victoria Falls",
        city: "Victoria Falls",
        category: "Luxury Hotel",
        priceRange: "$400-$800",
        rating: 4.9,
        amenities: JSON.stringify([
          "Pool",
          "Spa",
          "Multiple Restaurants",
          "Casino",
          "Golf Course",
          "Helicopter Pad",
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ]),
      },
    });

    console.log("✅ Created hotels:", 2);

    // Create Rooms for hotels
    await prisma.room.create({
      data: {
        hotelId: hotel1.id,
        name: "Standard Room",
        description: "Comfortable room with garden view",
        capacity: 2,
        price: 350.0,
        amenities: JSON.stringify([
          "Air Conditioning",
          "Balcony",
          "WiFi",
          "Mini Bar",
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        ]),
      },
    });

    await prisma.room.create({
      data: {
        hotelId: hotel2.id,
        name: "River View Room",
        description: "Luxury room with Zambezi River view",
        capacity: 2,
        price: 450.0,
        amenities: JSON.stringify([
          "Air Conditioning",
          "River View",
          "WiFi",
          "Mini Bar",
          "Tea/Coffee",
        ]),
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        ]),
      },
    });

    console.log("✅ Created rooms:", 2);

    // Create Activities
    const activity1 = await prisma.activity.create({
      data: {
        name: "Victoria Falls Helicopter Flight",
        description:
          "Experience the majesty of Victoria Falls from above with our scenic helicopter flights.",
        location: "Victoria Falls Airport",
        category: "Adventure",
        duration: "12-15 minutes",
        price: 165.0,
        difficulty: "Easy",
        rating: 4.9,
        maxGuests: 6,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        ]),
        includes: JSON.stringify([
          "Safety briefing",
          "Professional pilot",
          "Window seat guaranteed",
          "Scenic route",
        ]),
        excludes: JSON.stringify(["Transport to airport", "Gratuities"]),
      },
    });

    const activity2 = await prisma.activity.create({
      data: {
        name: "Zambezi Sunset Cruise",
        description:
          "Relaxing sunset cruise on the Zambezi River with drinks and snacks.",
        location: "Zambezi River Lodge",
        category: "Leisure",
        duration: "3 hours",
        price: 65.0,
        difficulty: "Easy",
        rating: 4.6,
        maxGuests: 30,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        ]),
        includes: JSON.stringify([
          "Welcome drink",
          "Snacks",
          "Wildlife viewing",
          "Professional guide",
        ]),
        excludes: JSON.stringify(["Additional drinks", "Transport"]),
      },
    });

    console.log("✅ Created activities:", 2);

    console.log("🎉 Database seeded successfully!");
    console.log("📊 Summary:");
    console.log(`  - Users: 1`);
    console.log(`  - Hotels: 2`);
    console.log(`  - Rooms: 2`);
    console.log(`  - Activities: 2`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

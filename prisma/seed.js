const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
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
        rooms: {
          create: [
            {
              type: "Standard Room",
              capacity: 2,
              pricePerNight: 350.0,
              amenities: JSON.stringify([
                "Air Conditioning",
                "Balcony",
                "WiFi",
                "Mini Bar",
              ]),
              isAvailable: true,
            },
            {
              type: "Deluxe Suite",
              capacity: 4,
              pricePerNight: 550.0,
              amenities: JSON.stringify([
                "Air Conditioning",
                "Balcony",
                "WiFi",
                "Mini Bar",
                "Living Area",
                "Bathtub",
              ]),
              isAvailable: true,
            },
          ],
        },
      },
    }),

    prisma.hotel.create({
      data: {
        name: "The Kingdom at Victoria Falls",
        description:
          "Iconic luxury hotel offering unparalleled views of Victoria Falls and the Zambezi River.",
        location: "Victoria Falls",
        pricePerNight: 450.0,
        amenities: [
          "Pool",
          "Spa",
          "Multiple Restaurants",
          "Casino",
          "Golf Course",
          "Helicopter Pad",
        ],
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ],
        rating: 4.9,
        totalRooms: 168,
        availableRooms: 22,
        rooms: {
          create: [
            {
              type: "River View Room",
              capacity: 2,
              pricePerNight: 450.0,
              amenities: [
                "Air Conditioning",
                "River View",
                "WiFi",
                "Mini Bar",
                "Tea/Coffee",
              ],
              available: true,
            },
            {
              type: "Presidential Suite",
              capacity: 6,
              pricePerNight: 850.0,
              amenities: [
                "Air Conditioning",
                "Falls View",
                "WiFi",
                "Mini Bar",
                "Butler Service",
                "Private Terrace",
              ],
              available: true,
            },
          ],
        },
      },
    }),

    prisma.hotel.create({
      data: {
        name: "Elephant Hills Resort",
        description:
          "Resort-style accommodation with magnificent views of the Zambezi River.",
        location: "Victoria Falls",
        pricePerNight: 280.0,
        amenities: [
          "Pool",
          "Restaurant",
          "Bar",
          "Tennis Court",
          "Game Drives",
          "River Cruises",
        ],
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        ],
        rating: 4.5,
        totalRooms: 276,
        availableRooms: 45,
        rooms: {
          create: [
            {
              type: "Standard Twin Room",
              capacity: 2,
              pricePerNight: 280.0,
              amenities: [
                "Air Conditioning",
                "Garden View",
                "WiFi",
                "Tea/Coffee",
              ],
              available: true,
            },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Created hotels:", hotels.length);

  // Create Restaurants
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: "The Boma - Dinner & Drum Show",
        description:
          "Authentic African dining experience with traditional music and dance performances.",
        location: "Victoria Falls",
        cuisine: "African Traditional",
        priceRange: "USD 65-85",
        rating: 4.7,
        images: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        ],
        openingHours: "6:30 PM - 10:30 PM",
        specialties: [
          "Game Meats",
          "Traditional Stews",
          "Local Vegetables",
          "Cultural Performance",
        ],
      },
    }),

    prisma.restaurant.create({
      data: {
        name: "The Lookout Cafe",
        description:
          "Casual dining with spectacular views of the Batoka Gorge and Zambezi River.",
        location: "Victoria Falls",
        cuisine: "International",
        priceRange: "USD 25-45",
        rating: 4.4,
        images: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        ],
        openingHours: "8:00 AM - 6:00 PM",
        specialties: ["Burgers", "Salads", "Local Fish", "Craft Beers"],
      },
    }),

    prisma.restaurant.create({
      data: {
        name: "3 Monkeys Restaurant",
        description:
          "Popular restaurant and bar known for its lively atmosphere and good food.",
        location: "Victoria Falls",
        cuisine: "International",
        priceRange: "USD 20-40",
        rating: 4.3,
        images: [
          "https://images.unsplash.com/photo-1552566127-b2e504f72119?w=800",
        ],
        openingHours: "7:00 AM - 11:00 PM",
        specialties: ["Steaks", "Pasta", "Pizzas", "Cocktails"],
      },
    }),
  ]);

  console.log("✅ Created restaurants:", restaurants.length);

  // Create Activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        name: "Victoria Falls Helicopter Flight",
        description:
          "Experience the majesty of Victoria Falls from above with our scenic helicopter flights.",
        location: "Victoria Falls",
        duration: "12-15 minutes",
        price: 165.0,
        difficulty: "Easy",
        category: "Adventure",
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        ],
        includes: [
          "Safety briefing",
          "Professional pilot",
          "Window seat guaranteed",
          "Scenic route",
        ],
        requirements: ["Valid ID", "Weight limit 120kg", "No large bags"],
        rating: 4.9,
      },
    }),

    prisma.activity.create({
      data: {
        name: "White Water Rafting - Full Day",
        description:
          "Thrilling full-day white water rafting adventure on the mighty Zambezi River.",
        location: "Victoria Falls",
        duration: "8 hours",
        price: 145.0,
        difficulty: "Moderate to Hard",
        category: "Adventure",
        images: [
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        ],
        includes: [
          "Safety equipment",
          "Professional guide",
          "Lunch",
          "Transport",
          "Photos",
        ],
        requirements: ["Swimming ability", "Age 15+", "Good fitness level"],
        rating: 4.8,
      },
    }),

    prisma.activity.create({
      data: {
        name: "Zambezi Sunset Cruise",
        description:
          "Relaxing sunset cruise on the Zambezi River with drinks and snacks.",
        location: "Victoria Falls",
        duration: "3 hours",
        price: 65.0,
        difficulty: "Easy",
        category: "Leisure",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        ],
        includes: [
          "Welcome drink",
          "Snacks",
          "Wildlife viewing",
          "Professional guide",
        ],
        requirements: ["No swimming required", "All ages welcome"],
        rating: 4.6,
      },
    }),

    prisma.activity.create({
      data: {
        name: "Chobe National Park Day Trip",
        description:
          "Full-day safari experience in Botswana's premier game park.",
        location: "Chobe National Park, Botswana",
        duration: "12 hours",
        price: 185.0,
        difficulty: "Easy",
        category: "Wildlife",
        images: [
          "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800",
        ],
        includes: [
          "Transport",
          "Game drive",
          "Boat cruise",
          "Lunch",
          "Park fees",
          "Professional guide",
        ],
        requirements: ["Passport required", "Border crossing fees additional"],
        rating: 4.7,
      },
    }),

    prisma.activity.create({
      data: {
        name: "Bungee Jumping",
        description:
          "Take the ultimate leap of faith from the Victoria Falls Bridge.",
        location: "Victoria Falls Bridge",
        duration: "2 hours",
        price: 160.0,
        difficulty: "Extreme",
        category: "Adventure",
        images: [
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
        ],
        includes: [
          "Safety equipment",
          "Professional instruction",
          "Certificate",
          "Photos",
        ],
        requirements: [
          "Age 14+",
          "Weight 40-140kg",
          "Medical clearance if required",
        ],
        rating: 4.9,
      },
    }),
  ]);

  console.log("✅ Created activities:", activities.length);

  // Create Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: "Victoria Falls Carnival",
        description:
          "Annual celebration featuring live music, local arts and crafts, and cultural performances.",
        location: "Victoria Falls",
        date: new Date("2024-12-15"),
        startTime: "10:00 AM",
        endTime: "10:00 PM",
        price: 25.0,
        category: "Cultural",
        images: [
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        ],
        capacity: 5000,
        availableTickets: 3200,
        organizer: "Victoria Falls Tourism Board",
      },
    }),

    prisma.event.create({
      data: {
        name: "Zambezi Music Festival",
        description:
          "Three-day music festival featuring local and international artists.",
        location: "Victoria Falls",
        date: new Date("2024-11-22"),
        startTime: "4:00 PM",
        endTime: "11:00 PM",
        price: 85.0,
        category: "Music",
        images: [
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        ],
        capacity: 8000,
        availableTickets: 2400,
        organizer: "Zambezi Events",
      },
    }),

    prisma.event.create({
      data: {
        name: "Full Moon Dinner at the Falls",
        description:
          "Exclusive dining experience under the full moon with views of Victoria Falls.",
        location: "Victoria Falls",
        date: new Date("2024-11-30"),
        startTime: "7:00 PM",
        endTime: "11:00 PM",
        price: 120.0,
        category: "Dining",
        images: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        ],
        capacity: 150,
        availableTickets: 45,
        organizer: "Victoria Falls Hotel",
      },
    }),
  ]);

  console.log("✅ Created events:", events.length);

  console.log("🎉 Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`  - Hotels: ${hotels.length}`);
  console.log(`  - Restaurants: ${restaurants.length}`);
  console.log(`  - Activities: ${activities.length}`);
  console.log(`  - Events: ${events.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

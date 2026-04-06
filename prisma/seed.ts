import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.favorite.deleteMany();
  await prisma.stayGallery.deleteMany();
  await prisma.eventGallery.deleteMany();
  await prisma.eventTicket.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.event.deleteMany();

  const [victoriaFalls, harare] = await Promise.all([
    prisma.destination.create({
      data: {
        name: "Victoria Falls",
        slug: "victoria-falls",
        description:
          "Zimbabwe's flagship destination for waterfall views, adventure activities, and premium safari hospitality.",
        location: "Victoria Falls",
        imageUrl:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ]),
        priceRange: "USD 25-850",
        rating: 4.8,
        featured: true,
        category: "waterfall-adventure",
        displayOrder: 1,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Harare",
        slug: "harare",
        description:
          "Urban culture, dining, events, and a practical gateway into Zimbabwe travel.",
        location: "Harare",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        ]),
        priceRange: "USD 15-250",
        rating: 4.2,
        featured: false,
        category: "city-cultural",
        displayOrder: 2,
      },
    }),
  ]);

  // Create Hotels with matching schema
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: "Victoria Falls Safari Lodge",
        description:
          "Luxury safari lodge overlooking the African bushveld with stunning views of Victoria Falls spray.",
        address: "471 Squire Cummings Road",
        city: "Victoria Falls",
        destinationId: victoriaFalls.id,
        category: "Luxury Safari Lodge",
        priceRange: "USD 350-550",
        rating: 4.8,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        ]),
        amenities: JSON.stringify([
          "Pool",
          "Spa",
          "Restaurant",
          "Bar",
          "Game Viewing",
          "Airport Transfer",
        ]),
        rooms: {
          create: [
            {
              name: "Standard Room",
              description:
                "Comfortable standard accommodation with bushveld views",
              capacity: 2,
              price: 350.0,
              currency: "USD",
              images: JSON.stringify([
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
              ]),
              amenities: JSON.stringify([
                "Air Conditioning",
                "Balcony",
                "WiFi",
                "Mini Bar",
              ]),
            },
            {
              name: "Deluxe Suite",
              description:
                "Spacious suite with premium amenities and stunning views",
              capacity: 4,
              price: 550.0,
              currency: "USD",
              images: JSON.stringify([
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
              ]),
              amenities: JSON.stringify([
                "Air Conditioning",
                "Balcony",
                "WiFi",
                "Mini Bar",
                "Living Area",
                "Bathtub",
              ]),
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
        address: "Victoria Falls",
        city: "Victoria Falls",
        destinationId: victoriaFalls.id,
        category: "Luxury Hotel",
        priceRange: "USD 450-850",
        rating: 4.9,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ]),
        amenities: JSON.stringify([
          "Pool",
          "Spa",
          "Multiple Restaurants",
          "Casino",
          "Golf Course",
          "Helicopter Pad",
        ]),
        rooms: {
          create: [
            {
              name: "River View Room",
              description: "Beautiful room with river views",
              capacity: 2,
              price: 450.0,
              currency: "USD",
              images: JSON.stringify([
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
              ]),
              amenities: JSON.stringify([
                "Air Conditioning",
                "River View",
                "WiFi",
                "Mini Bar",
                "Tea/Coffee",
              ]),
            },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Created hotels:", hotels.length);

  await prisma.stayGallery.createMany({
    data: hotels.flatMap((hotel, index) => {
      const images =
        index === 0
          ? [
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
            ]
          : [
              "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            ];

      return images.map((imageUrl, galleryIndex) => ({
        hotelId: hotel.id,
        imageUrl,
        thumbnailUrl: imageUrl,
        caption: `${hotel.name} gallery image ${galleryIndex + 1}`,
        altText: `${hotel.name} photo ${galleryIndex + 1}`,
        category: galleryIndex === 0 ? "hero" : "property",
        isFeatured: galleryIndex === 0,
        sortOrder: galleryIndex,
      }));
    }),
  });

  // Create Activities with matching schema
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        name: "Victoria Falls Helicopter Flight",
        description:
          "Experience the majesty of Victoria Falls from above with our scenic helicopter flights.",
        destinationId: victoriaFalls.id,
        category: "Adventure",
        duration: "12-15 minutes",
        difficulty: "Easy",
        location: "Victoria Falls",
        price: 165.0,
        currency: "USD",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        ]),
        includes: JSON.stringify([
          "Safety briefing",
          "Professional pilot",
          "Window seat guaranteed",
          "Scenic route",
        ]),
        excludes: JSON.stringify(["Hotel transfers", "Gratuities"]),
        rating: 4.9,
        maxGuests: 6,
      },
    }),

    prisma.activity.create({
      data: {
        name: "Zambezi Sunset Cruise",
        description:
          "Relaxing sunset cruise on the Zambezi River with drinks and snacks.",
        destinationId: victoriaFalls.id,
        category: "Leisure",
        duration: "3 hours",
        difficulty: "Easy",
        location: "Victoria Falls",
        price: 65.0,
        currency: "USD",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        ]),
        includes: JSON.stringify([
          "Welcome drink",
          "Snacks",
          "Wildlife viewing",
          "Professional guide",
        ]),
        excludes: JSON.stringify(["Hotel transfers", "Additional drinks"]),
        rating: 4.6,
        maxGuests: 20,
      },
    }),

    prisma.activity.create({
      data: {
        name: "White Water Rafting",
        description:
          "Thrilling white water rafting adventure on the mighty Zambezi River.",
        destinationId: victoriaFalls.id,
        category: "Adventure",
        duration: "8 hours",
        difficulty: "Moderate to Hard",
        location: "Victoria Falls",
        price: 145.0,
        currency: "USD",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
        ]),
        includes: JSON.stringify([
          "Safety equipment",
          "Professional guide",
          "Lunch",
          "Transport",
          "Photos",
        ]),
        excludes: JSON.stringify(["Personal insurance", "Gratuities"]),
        rating: 4.8,
        maxGuests: 8,
      },
    }),
  ]);

  console.log("✅ Created activities:", activities.length);

  // Create Restaurants with matching schema
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: "The Boma - Dinner & Drum Show",
        description:
          "Authentic African dining experience with traditional music and dance performances.",
        destinationId: victoriaFalls.id,
        cuisine: "African Traditional",
        location: "Victoria Falls",
        priceRange: "USD 65-85",
        rating: 4.7,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        ]),
        specialties: JSON.stringify([
          "Game Meats",
          "Traditional Stews",
          "Local Vegetables",
          "Cultural Performance",
        ]),
        amenities: JSON.stringify([
          "Live Entertainment",
          "Traditional Decor",
          "Open Air Dining",
          "Cultural Show",
        ]),
      },
    }),

    prisma.restaurant.create({
      data: {
        name: "The Lookout Cafe",
        description:
          "Casual dining with spectacular views of the Batoka Gorge and Zambezi River.",
        destinationId: victoriaFalls.id,
        cuisine: "International",
        location: "Victoria Falls",
        priceRange: "USD 25-45",
        rating: 4.4,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        ]),
        specialties: JSON.stringify([
          "Burgers",
          "Salads",
          "Local Fish",
          "Craft Beers",
        ]),
        amenities: JSON.stringify([
          "Scenic Views",
          "Outdoor Seating",
          "WiFi",
          "Adventure Booking",
        ]),
      },
    }),
  ]);

  console.log("✅ Created restaurants:", restaurants.length);

  // Create Events with matching schema
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: "Victoria Falls Carnival",
        description:
          "Annual celebration featuring live music, local arts and crafts, and cultural performances.",
        destinationId: victoriaFalls.id,
        category: "Cultural",
        location: "Victoria Falls",
        startDate: new Date("2024-12-15T10:00:00Z"),
        endDate: new Date("2024-12-15T22:00:00Z"),
        price: 25.0,
        currency: "USD",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        ]),
        capacity: 5000,
      },
    }),

    prisma.event.create({
      data: {
        name: "Zambezi Music Festival",
        description:
          "Three-day music festival featuring local and international artists.",
        destinationId: harare.id,
        category: "Music",
        location: "Victoria Falls",
        startDate: new Date("2024-11-22T16:00:00Z"),
        endDate: new Date("2024-11-24T23:00:00Z"),
        price: 85.0,
        currency: "USD",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        ]),
        capacity: 8000,
      },
    }),
  ]);

  console.log("✅ Created events:", events.length);

  await prisma.eventTicket.createMany({
    data: [
      {
        eventId: events[0].id,
        ticketType: "general",
        name: "General Admission",
        description: "Standard event access.",
        basePrice: 25,
        currency: "USD",
        totalTickets: 5000,
        ticketsAvailable: 4200,
        perks: JSON.stringify(["Festival access", "Main stage entry"]),
      },
      {
        eventId: events[1].id,
        ticketType: "vip",
        name: "VIP Pass",
        description: "Premium festival access with priority viewing.",
        basePrice: 120,
        originalPrice: 150,
        currency: "USD",
        totalTickets: 500,
        ticketsAvailable: 180,
        perks: JSON.stringify(["VIP lounge", "Priority entry", "Merch bundle"]),
      },
    ],
  });

  await prisma.eventGallery.createMany({
    data: events.flatMap((event, index) => {
      const images =
        index === 0
          ? [
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            ]
          : [
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            ];

      return images.map((imageUrl, galleryIndex) => ({
        eventId: event.id,
        imageUrl,
        thumbnailUrl: imageUrl,
        caption: `${event.name} gallery image ${galleryIndex + 1}`,
        altText: `${event.name} photo ${galleryIndex + 1}`,
        category: galleryIndex === 0 ? "hero" : "event",
        isFeatured: galleryIndex === 0,
        sortOrder: galleryIndex,
      }));
    }),
  });

  console.log("🎉 Database seeded successfully!");
  console.log("📊 Summary:");
  console.log("  - Destinations: 2");
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

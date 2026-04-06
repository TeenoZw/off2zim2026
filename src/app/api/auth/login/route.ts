import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import {
  createSession,
  getUserBySessionToken,
  hashPassword,
  serializeUser,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function ensureDemoAccounts() {
  const count = await prisma.user.count();
  if (count > 0) {
    return;
  }

  const demoUsers = [
    {
      email: "explorer@demo.com",
      password: "demo12345",
      firstName: "Foreign",
      lastName: "Explorer",
      role: "explorer",
      explorerType: "foreign",
      verificationStatus: "basic_approved",
    },
    {
      email: "local.explorer@demo.com",
      password: "demo12345",
      firstName: "Local",
      lastName: "Explorer",
      role: "explorer",
      explorerType: "local",
      verificationStatus: "basic_approved",
    },
    {
      email: "provider@demo.com",
      password: "demo12345",
      firstName: "Provider",
      lastName: "Owner",
      role: "provider",
      verificationStatus: "basic_approved",
      company: {
        companyName: "Victoria Falls Adventure Co.",
        tradingName: "VF Adventure",
        businessRegistrationNumber: "VF-2025-001",
        mainContactPerson: "Provider Owner",
        businessPhone: "+263774555321",
        businessEmail: "provider@demo.com",
        physicalAddress: "Victoria Falls, Zimbabwe",
        businessCategory: "Adventure Activities",
        businessDescription:
          "Adventure operator running flights, cruises, and curated Zimbabwe experiences.",
        servicesOffered: ["Helicopter Tours", "Sunset Cruises", "Safari Trips"],
        onboardingStatus: "basic_approved",
      },
    },
    {
      email: "admin@demo.com",
      password: "demo12345",
      firstName: "Platform",
      lastName: "Admin",
      role: "admin",
      verificationStatus: "basic_approved",
    },
  ];

  for (const demoUser of demoUsers) {
    await prisma.user.create({
      data: {
        email: demoUser.email,
        passwordHash: hashPassword(demoUser.password),
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        name: `${demoUser.firstName} ${demoUser.lastName}`,
        role: demoUser.role,
        explorerType: demoUser.explorerType,
        verificationStatus: demoUser.verificationStatus,
        hasVerifiedBadge: demoUser.role === "provider",
        explorerScore:
          demoUser.role === "explorer"
            ? JSON.stringify({
                rating: 4.8,
                completedBookings: 3,
                cancelledBookings: 0,
                reviewsReceived: 2,
                lastUpdated: new Date().toISOString(),
              })
            : JSON.stringify({}),
        ownedCompanies: demoUser.company
          ? {
              create: {
                ...demoUser.company,
                verificationTier: "basic",
                socialMediaLinks: JSON.stringify({ instagram: "@vfadventure" }),
                serviceAreas: JSON.stringify(["Victoria Falls", "Hwange"]),
                servicesOffered: JSON.stringify(demoUser.company.servicesOffered),
                reviewSubmittedAt: new Date(),
                basicApprovedAt: new Date(),
                listings: {
                  create: [
                    {
                      title: "Victoria Falls Helicopter Tour",
                      slug: "victoria-falls-helicopter-tour",
                      category: "Experience",
                      listingType: "experience",
                      description:
                        "Scenic helicopter flights over Victoria Falls with professional briefing and premium safety standards.",
                      shortDescription: "A signature aerial experience over the falls.",
                      location: "Victoria Falls",
                      pricingModel: "per_person",
                      basePrice: 180,
                      currency: "USD",
                      instantBooking: true,
                      bookingMode: "instant",
                      status: "active",
                      visibility: "public",
                      images: JSON.stringify([]),
                      amenities: JSON.stringify([
                        "Safety briefing",
                        "Window seat options",
                        "Transfers available",
                      ]),
                      tags: JSON.stringify(["adventure", "iconic", "aerial"]),
                    },
                  ],
                },
              },
            }
          : undefined,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDemoAccounts();

    const payload = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user?.passwordHash || !verifyPassword(payload.password, user.passwordHash)) {
      return apiError("Incorrect email or password.", 401);
    }

    const session = await createSession(user.id);
    const hydratedUser = await getUserBySessionToken(session.sessionToken);

    if (!hydratedUser) {
      return apiError("Unable to create a session right now.", 500);
    }

    return NextResponse.json({
      token: session.sessionToken,
      user: serializeUser(hydratedUser),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid login data", 422);
    }

    console.error("Login route error:", error);
    return apiError("Unable to sign in right now.", 500);
  }
}

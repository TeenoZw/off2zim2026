import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await prisma.guideProfile.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, name: true, image: true },
        },
        services: {
          where: { isActive: true },
          select: { id: true, title: true, serviceType: true, price: true, currency: true, durationMin: true },
        },
      },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
    });

    return NextResponse.json({ guides: profiles.map(serializeGuide) });
  } catch (error) {
    console.error("Guides list error:", error);
    return apiError("Unable to load guides.", 500);
  }
}

export function serializeGuide(profile: {
  id: string;
  userId: string;
  bio: string;
  specialties: string;
  languages: string;
  destinations: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  user: { id: string; firstName: string | null; lastName: string | null; name: string | null; image: string | null };
  services: { id: string; title: string; serviceType: string; price: number; currency: string; durationMin: number }[];
}) {
  const name =
    [profile.user.firstName, profile.user.lastName].filter(Boolean).join(" ").trim() ||
    profile.user.name ||
    "Community Guide";

  return {
    id: profile.id,
    userId: profile.userId,
    name,
    bio: profile.bio,
    specialties: safeJsonParse<string[]>(profile.specialties, []),
    languages: safeJsonParse<string[]>(profile.languages, []),
    destinations: safeJsonParse<string[]>(profile.destinations, []),
    rating: profile.rating,
    reviewCount: profile.reviewCount,
    avatarUrl: profile.avatarUrl ?? profile.user.image,
    services: profile.services,
    createdAt: profile.createdAt.toISOString(),
  };
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

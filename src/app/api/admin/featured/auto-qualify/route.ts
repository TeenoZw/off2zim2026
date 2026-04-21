import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const qualifySchema = z.object({
  /** How many top_rated slots to fill (default 10) */
  topN: z.number().int().min(1).max(50).default(10),
  /** Feature window in days from now (default 30) */
  windowDays: z.number().int().min(1).max(365).default(30),
  /** Minimum completed bookings to qualify (default 3) */
  minBookings: z.number().int().min(0).default(3),
  /** Minimum average provider rating from explorers (default 4.0) */
  minRating: z.number().min(0).max(5).default(4.0),
  /** Replace existing top_rated entries if true (default false) */
  replace: z.boolean().default(false),
});

interface ScoredListing {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  completedBookings: number;
  avgRating: number;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Forbidden", 403);

    const body = qualifySchema.parse(await request.json());

    const now = new Date();
    const endDate = new Date(now.getTime() + body.windowDays * 24 * 60 * 60 * 1000);

    // Fetch all approved listings from featured-eligible providers
    const listings = await prisma.providerListing.findMany({
      where: {
        status: "approved",
        visibility: "public",
        company: { isFeaturedEligible: true, isVerified: true },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        company: { select: { companyName: true } },
        bookings: {
          where: { status: "COMPLETED" },
          select: { explorerRating: true },
        },
      },
    });

    // Score each listing: weighted average of rating + booking volume
    const scored: ScoredListing[] = listings
      .map((l) => {
        const completedBookings = l.bookings.length;
        const ratingsWithValues = l.bookings.filter((b) => b.explorerRating != null);
        const avgRating =
          ratingsWithValues.length > 0
            ? ratingsWithValues.reduce((sum, b) => sum + (b.explorerRating ?? 0), 0) /
              ratingsWithValues.length
            : 0;

        // Composite score: 60% rating (scaled 0-5), 40% volume (log-capped at 100 bookings)
        const ratingScore = (avgRating / 5) * 60;
        const volumeScore = Math.min(Math.log10(completedBookings + 1) / Math.log10(101), 1) * 40;
        const score = ratingScore + volumeScore;

        return {
          id: l.id,
          title: l.title,
          slug: l.slug,
          companyName: l.company.companyName,
          completedBookings,
          avgRating,
          score,
        };
      })
      .filter(
        (l) => l.completedBookings >= body.minBookings && l.avgRating >= body.minRating
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, body.topN);

    if (scored.length === 0) {
      return NextResponse.json({
        promoted: [],
        skipped: 0,
        message: "No listings met the qualification criteria.",
      });
    }

    // Optionally deactivate existing top_rated entries
    if (body.replace) {
      await prisma.featuredEntry.updateMany({
        where: { pathway: "top_rated", isActive: true },
        data: { isActive: false },
      });
    }

    // Create entries for qualifying listings (skip those already active in top_rated)
    const existingActive = await prisma.featuredEntry.findMany({
      where: { pathway: "top_rated", isActive: true },
      select: { listingId: true },
    });
    const alreadyFeatured = new Set(existingActive.map((e) => e.listingId));

    const toCreate = scored.filter((l) => !alreadyFeatured.has(l.id));
    const skipped = scored.length - toCreate.length;

    const created = await prisma.$transaction(
      toCreate.map((l, i) =>
        prisma.featuredEntry.create({
          data: {
            listingId: l.id,
            pathway: "top_rated",
            justification: `Auto-qualified: ${l.completedBookings} completed bookings, avg rating ${l.avgRating.toFixed(2)}`,
            startDate: now,
            endDate,
            sortOrder: i,
            isActive: true,
          },
          select: { id: true, listingId: true },
        })
      )
    );

    return NextResponse.json({
      promoted: toCreate.map((l, i) => ({
        listingId: l.id,
        title: l.title,
        companyName: l.companyName,
        completedBookings: l.completedBookings,
        avgRating: +l.avgRating.toFixed(2),
        score: +l.score.toFixed(2),
        featuredEntryId: created[i]?.id,
      })),
      skipped,
      message: `${toCreate.length} listing(s) promoted to top_rated. ${skipped} already featured.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid parameters.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to run auto-qualification.", 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  listingId: z.string().min(1),
  pathway: z.enum(["sponsored", "top_rated", "editors_choice"]),
  justification: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  sortOrder: z.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Forbidden", 403);

    const { searchParams } = new URL(request.url);
    const pathway = searchParams.get("pathway");
    const activeOnly = searchParams.get("active") !== "false";

    const now = new Date();

    const entries = await prisma.featuredEntry.findMany({
      where: {
        ...(pathway ? { pathway } : {}),
        ...(activeOnly ? { isActive: true, startDate: { lte: now }, endDate: { gte: now } } : {}),
      },
      orderBy: [{ pathway: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        pathway: true,
        justification: true,
        sortOrder: true,
        isActive: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            location: true,
            status: true,
            company: {
              select: {
                id: true,
                companyName: true,
                isVerified: true,
                isFeaturedEligible: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ entries, count: entries.length });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to load featured entries.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Forbidden", 403);

    const body = createSchema.parse(await request.json());

    if (new Date(body.endDate) <= new Date(body.startDate)) {
      return apiError("endDate must be after startDate.", 422);
    }

    // Validate listing exists and company is featured-eligible
    const listing = await prisma.providerListing.findUnique({
      where: { id: body.listingId },
      select: {
        id: true,
        title: true,
        status: true,
        company: { select: { isFeaturedEligible: true, isVerified: true } },
      },
    });

    if (!listing) return apiError("Listing not found.", 404);
    if (listing.status !== "approved") {
      return apiError("Only approved listings can be featured.", 422);
    }
    if (!listing.company.isFeaturedEligible) {
      return apiError(
        "Provider must have an active Verified Badge subscription to feature listings.",
        422
      );
    }

    if (body.pathway === "editors_choice" && !body.justification?.trim()) {
      return apiError("Justification is required for Editor's Choice.", 422);
    }

    // Deactivate any existing active entry for this listing on the same pathway
    await prisma.featuredEntry.updateMany({
      where: { listingId: body.listingId, pathway: body.pathway, isActive: true },
      data: { isActive: false },
    });

    const entry = await prisma.featuredEntry.create({
      data: {
        listingId: body.listingId,
        pathway: body.pathway,
        justification: body.justification ?? null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        sortOrder: body.sortOrder,
        isActive: true,
      },
      select: {
        id: true,
        pathway: true,
        justification: true,
        sortOrder: true,
        startDate: true,
        endDate: true,
        listing: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid data.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to create featured entry.", 500);
  }
}

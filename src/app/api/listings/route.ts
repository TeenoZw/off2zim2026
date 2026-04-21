import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { serializePublicListing } from "@/lib/platform";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ── Filters ───────────────────��────────────────────────────────────────���───
    const q            = searchParams.get("q")?.trim() || searchParams.get("search")?.trim();
    const category     = searchParams.get("category")?.trim();
    const listingType  = searchParams.get("listingType")?.trim();
    const location     = searchParams.get("location")?.trim();
    const minPrice     = parseFloat(searchParams.get("minPrice") ?? "");
    const maxPrice     = parseFloat(searchParams.get("maxPrice") ?? "");
    const instantOnly  = searchParams.get("instant") === "true";
    const verifiedOnly = searchParams.get("verified") === "true";
    const featuredOnly = searchParams.get("featured") === "true";

    // ── Pagination ─────────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(searchParams.get("limit") ?? String(PAGE_SIZE), 10)));
    const skip  = (page - 1) * limit;

    // ── Sort ───────────────────────────────────────────────────────────────────
    const sortParam = searchParams.get("sort") ?? "newest";
    const orderBy =
      sortParam === "price_asc"  ? [{ basePrice: "asc"  as const }] :
      sortParam === "price_desc" ? [{ basePrice: "desc" as const }] :
      sortParam === "oldest"     ? [{ createdAt: "asc"  as const }] :
                                   [{ createdAt: "desc" as const }];

    // ── Base where clause ──────────────────────────────────────────────────────
    const where = {
      visibility: "public",
      status: "approved",
      ...(category    && category    !== "all" ? { category }    : {}),
      ...(listingType && listingType !== "all" ? { listingType } : {}),
      ...(instantOnly ? { instantBooking: true } : {}),
      ...(verifiedOnly ? { company: { isVerified: true } } : {}),
      ...(featuredOnly
        ? {
            featuredEntries: {
              some: {
                isActive: true,
                startDate: { lte: new Date() },
                endDate:   { gte: new Date() },
              },
            },
          }
        : {}),
      ...(location
        ? { location: { contains: location, mode: "insensitive" as const } }
        : {}),
      ...(!isNaN(minPrice) || !isNaN(maxPrice)
        ? {
            basePrice: {
              ...(!isNaN(minPrice) ? { gte: minPrice } : {}),
              ...(!isNaN(maxPrice) ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { title:       { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
              { location:    { contains: q, mode: "insensitive" as const } },
              { tags:        { contains: q, mode: "insensitive" as const } },
              { company: { companyName: { contains: q, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    const [total, listings] = await prisma.$transaction([
      prisma.providerListing.count({ where }),
      prisma.providerListing.findMany({
        where,
        include: {
          availability: true,
          bookings: true,
          company: true,
          featuredEntries: {
            where: { isActive: true, startDate: { lte: new Date() }, endDate: { gte: new Date() } },
            select: { pathway: true },
            take: 1,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      listings: listings.map(serializePublicListing),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Public listings route error:", error);
    return apiError("Unable to load listings right now.", 500);
  }
}

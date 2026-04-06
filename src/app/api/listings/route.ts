import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { serializePublicListing } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const listingType = searchParams.get("listingType")?.trim();

    const listings = await prisma.providerListing.findMany({
      where: {
        visibility: "public",
        status: {
          in: ["active", "pending_review"],
        },
        ...(category && category !== "all" ? { category } : {}),
        ...(listingType && listingType !== "all" ? { listingType } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
                { location: { contains: search } },
                { company: { is: { companyName: { contains: search } } } },
              ],
            }
          : {}),
      },
      include: {
        availability: true,
        bookings: true,
        company: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json({
      listings: listings.map(serializePublicListing),
    });
  } catch (error) {
    console.error("Public listings route error:", error);
    return apiError("Unable to load public listings right now.", 500);
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { serializePublicListing } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const listing = await prisma.providerListing.findUnique({
      where: { slug: params.slug },
      include: {
        availability: true,
        bookings: true,
        company: true,
      },
    });

    if (!listing || listing.visibility !== "public") {
      return apiError("Listing not found.", 404);
    }

    return NextResponse.json({
      listing: serializePublicListing(listing),
    });
  } catch (error) {
    console.error("Public listing detail error:", error);
    return apiError("Unable to load the listing right now.", 500);
  }
}

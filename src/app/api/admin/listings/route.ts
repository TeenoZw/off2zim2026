import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeAdminListing } from "@/lib/platform";

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") {
      return apiError("Only administrators can view platform listings.", 403);
    }

    const listings = await prisma.providerListing.findMany({
      include: {
        company: true,
        availability: true,
        bookings: {
          include: {
            disputes: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      listings: listings.map(serializeAdminListing),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Admin listings route error:", error);
    return apiError("Unable to load platform listings right now.", 500);
  }
}

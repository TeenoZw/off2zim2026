import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeExplorerBooking } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { user } = await requireSessionUser();

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        listing: true,
        provider: true,
        disputes: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      bookings: bookings.map(serializeExplorerBooking),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }

    console.error("Bookings route error:", error);
    return apiError("Unable to load bookings right now.", 500);
  }
}

import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeAdminBooking } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") {
      return apiError("Only administrators can view platform bookings.", 403);
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
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
      bookings: bookings.map(serializeAdminBooking),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Admin bookings route error:", error);
    return apiError("Unable to load platform bookings right now.", 500);
  }
}

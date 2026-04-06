import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { serializeOrder } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can view provider orders.", 403);
    }

    const company = await prisma.providerCompany.findUnique({
      where: { ownerUserId: user.id },
      select: { id: true },
    });

    if (!company) {
      return apiError("Provider company profile not found.", 404);
    }

    const orders = await prisma.booking.findMany({
      where: {
        providerId: company.id,
      },
      include: {
        user: true,
        listing: true,
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
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    return apiError("Unauthorized", 401);
  }
}

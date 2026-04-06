import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeDispute } from "@/lib/platform";

export const dynamic = "force-dynamic";
const updateDisputeSchema = z.object({
  status: z.enum(["open", "under_review", "resolved", "closed"]),
  resolution: z.string().optional().nullable(),
  assignToMe: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") {
      return apiError("Only administrators can update disputes.", 403);
    }

    const payload = updateDisputeSchema.parse(await request.json());

    const dispute = await prisma.dispute.findUnique({
      where: { id: params.id },
      select: { id: true, companyId: true },
    });

    if (!dispute) {
      return apiError("Dispute not found.", 404);
    }

    const updated = await prisma.dispute.update({
      where: { id: dispute.id },
      data: {
        status: payload.status,
        resolution: payload.resolution || null,
        assignedAdminId: payload.assignToMe ? user.id : undefined,
        resolvedAt:
          payload.status === "resolved" || payload.status === "closed"
            ? new Date()
            : null,
      },
      include: {
        booking: {
          include: {
            listing: true,
            provider: true,
          },
        },
        openedBy: true,
        assignedAdmin: true,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminUserId: user.id,
        companyId: dispute.companyId,
        action: "dispute_updated",
        targetType: "dispute",
        targetId: updated.id,
        summary: `Dispute moved to ${payload.status}`,
        metadata: JSON.stringify({
          status: payload.status,
          resolution: payload.resolution || null,
        }),
      },
    });

    return NextResponse.json({
      dispute: serializeDispute(updated),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid dispute update", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Admin dispute update error:", error);
    return apiError("Unable to update dispute right now.", 500);
  }
}

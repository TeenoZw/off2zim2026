import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  endDate: z.string().datetime().optional(),
  justification: z.string().max(500).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Forbidden", 403);

    const body = patchSchema.parse(await request.json());

    const existing = await prisma.featuredEntry.findUnique({
      where: { id: params.id },
    });
    if (!existing) return apiError("Featured entry not found.", 404);

    const updated = await prisma.featuredEntry.update({
      where: { id: params.id },
      data: {
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
        ...(body.endDate ? { endDate: new Date(body.endDate) } : {}),
        ...(body.justification !== undefined ? { justification: body.justification } : {}),
      },
      select: {
        id: true,
        pathway: true,
        isActive: true,
        sortOrder: true,
        startDate: true,
        endDate: true,
        listing: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ entry: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid data.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to update featured entry.", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Forbidden", 403);

    const existing = await prisma.featuredEntry.findUnique({
      where: { id: params.id },
    });
    if (!existing) return apiError("Featured entry not found.", 404);

    await prisma.featuredEntry.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to delete featured entry.", 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const applySchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters."),
  expertise: z.array(z.string()).min(1, "List at least one area of expertise."),
  destinations: z.array(z.string()).min(1, "List at least one destination you know well."),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();

    if (user.role !== "explorer") {
      return apiError("Only Explorers can apply to become Community Guides.", 403);
    }

    const existing = await prisma.guideApplication.findUnique({
      where: { userId: user.id },
      select: { status: true },
    });

    if (existing) {
      if (existing.status === "approved") {
        return apiError("You are already an approved Community Guide.", 409);
      }
      if (existing.status === "pending") {
        return apiError("Your application is already under review.", 409);
      }
    }

    const payload = applySchema.parse(await request.json());

    const application = await prisma.guideApplication.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        bio: payload.bio,
        expertise: JSON.stringify(payload.expertise),
        destinations: JSON.stringify(payload.destinations),
        status: "pending",
      },
      update: {
        bio: payload.bio,
        expertise: JSON.stringify(payload.expertise),
        destinations: JSON.stringify(payload.destinations),
        status: "pending",
        reviewNotes: null,
        reviewedById: null,
        reviewedAt: null,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { guideApplicationStatus: "pending" },
    });

    return NextResponse.json({ application: serializeApplication(application) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid application data.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Guide apply error:", error);
    return apiError("Unable to submit application right now.", 500);
  }
}

export async function GET() {
  try {
    const { user } = await requireSessionUser();

    const application = await prisma.guideApplication.findUnique({
      where: { userId: user.id },
    });

    if (!application) {
      return NextResponse.json({ application: null });
    }

    return NextResponse.json({ application: serializeApplication(application) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to load application.", 500);
  }
}

function serializeApplication(app: {
  id: string;
  userId: string;
  bio: string;
  expertise: string;
  destinations: string;
  status: string;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: app.id,
    userId: app.userId,
    bio: app.bio,
    expertise: safeJsonParse<string[]>(app.expertise, []),
    destinations: safeJsonParse<string[]>(app.destinations, []),
    status: app.status,
    reviewNotes: app.reviewNotes,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

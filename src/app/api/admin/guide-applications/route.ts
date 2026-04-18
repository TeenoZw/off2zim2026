import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") {
      return apiError("Only administrators can view guide applications.", 403);
    }

    const applications = await prisma.guideApplication.findMany({
      include: {
        applicant: {
          select: { id: true, firstName: true, lastName: true, name: true, email: true, image: true },
        },
        reviewedBy: {
          select: { id: true, firstName: true, lastName: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications: applications.map(serializeApplication) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Admin guide applications error:", error);
    return apiError("Unable to load guide applications.", 500);
  }
}

export function serializeApplication(app: {
  id: string;
  userId: string;
  bio: string;
  expertise: string;
  destinations: string;
  status: string;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  applicant: { id: string; firstName: string | null; lastName: string | null; name: string | null; email: string; image: string | null };
  reviewedBy: { id: string; firstName: string | null; lastName: string | null; name: string | null; email: string } | null;
}) {
  const applicantName =
    [app.applicant.firstName, app.applicant.lastName].filter(Boolean).join(" ").trim() ||
    app.applicant.name ||
    app.applicant.email;
  return {
    id: app.id,
    userId: app.userId,
    bio: app.bio,
    expertise: safeJsonParse<string[]>(app.expertise, []),
    destinations: safeJsonParse<string[]>(app.destinations, []),
    status: app.status,
    reviewNotes: app.reviewNotes,
    reviewedAt: app.reviewedAt?.toISOString() ?? null,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    applicant: {
      id: app.applicant.id,
      name: applicantName,
      email: app.applicant.email,
      avatarUrl: app.applicant.image,
    },
    reviewedBy: app.reviewedBy
      ? {
          id: app.reviewedBy.id,
          name:
            [app.reviewedBy.firstName, app.reviewedBy.lastName].filter(Boolean).join(" ").trim() ||
            app.reviewedBy.name ||
            app.reviewedBy.email,
        }
      : null,
  };
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

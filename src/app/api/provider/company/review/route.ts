import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { serializeCompany } from "@/lib/platform";

export const dynamic = "force-dynamic";
export async function POST() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can submit onboarding for review.", 403);
    }

    const company = await prisma.providerCompany.findUnique({
      where: { ownerUserId: user.id },
      include: {
        documents: true,
        verificationReviews: {
          include: {
            reviewedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        listings: {
          include: {
            bookings: true,
          },
        },
        bookings: {
          include: {
            disputes: true,
          },
        },
      },
    });

    if (!company) {
      return apiError("Provider company profile not found.", 404);
    }

    if (company.documents.length === 0) {
      return apiError(
        "Upload at least one business document before submitting for review.",
        422
      );
    }

    const updatedCompany = await prisma.providerCompany.update({
      where: { id: company.id },
      data: {
        onboardingStatus: "submitted",
        reviewSubmittedAt: new Date(),
        verificationReviews: {
          create: {
            reviewType: "basic_review",
            status: "pending",
            notes: "Submitted by provider for internal legitimacy review.",
          },
        },
      },
      include: {
        documents: true,
        verificationReviews: {
          include: {
            reviewedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        listings: {
          include: {
            bookings: true,
          },
        },
        bookings: {
          include: {
            disputes: true,
          },
        },
      },
    });

    return NextResponse.json({ company: serializeCompany(updatedCompany) });
  } catch (error) {
    console.error("Company review submission error:", error);
    return apiError("Unable to submit for review right now.", 500);
  }
}

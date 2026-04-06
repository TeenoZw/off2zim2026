import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { serializeCompany } from "@/lib/platform";

export const dynamic = "force-dynamic";
const companySchema = z.object({
  companyName: z.string().min(1),
  tradingName: z.string().optional().nullable(),
  businessRegistrationNumber: z.string().min(1),
  mainContactPerson: z.string().min(1),
  businessPhone: z.string().min(1),
  businessEmail: z.string().email(),
  physicalAddress: z.string().min(1),
  headquartersCity: z.string().optional().nullable(),
  businessCategory: z.string().optional().nullable(),
  businessDescription: z.string().optional().nullable(),
  establishedYear: z.coerce.number().int().optional().nullable(),
  numberOfEmployees: z.string().optional().nullable(),
  operatingHours: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().or(z.literal("")).nullable(),
  socialMediaLinks: z.record(z.string()).default({}),
  servicesOffered: z.array(z.string()).default([]),
  serviceAreas: z.array(z.string()).default([]),
  documents: z
    .array(
      z.object({
        type: z.string().min(1),
        fileName: z.string().min(1),
        fileUrl: z.string().optional().nullable(),
        status: z.string().optional(),
        notes: z.string().optional().nullable(),
      })
    )
    .default([]),
});

async function findProviderCompany(userId: string) {
  return prisma.providerCompany.findUnique({
    where: { ownerUserId: userId },
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
}

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can access company onboarding.", 403);
    }

    const company = await findProviderCompany(user.id);
    if (!company) {
      return apiError("Provider company profile not found.", 404);
    }

    return NextResponse.json({ company: serializeCompany(company) });
  } catch (error) {
    return apiError("Unauthorized", 401);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can update company onboarding.", 403);
    }

    const payload = companySchema.parse(await request.json());
    const existing = await prisma.providerCompany.findUnique({
      where: { ownerUserId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return apiError("Provider company profile not found.", 404);
    }

    await prisma.providerCompany.update({
      where: { id: existing.id },
      data: {
        companyName: payload.companyName,
        tradingName: payload.tradingName || null,
        businessRegistrationNumber: payload.businessRegistrationNumber,
        mainContactPerson: payload.mainContactPerson,
        businessPhone: payload.businessPhone,
        businessEmail: payload.businessEmail,
        physicalAddress: payload.physicalAddress,
        headquartersCity: payload.headquartersCity || null,
        businessCategory: payload.businessCategory || null,
        businessDescription: payload.businessDescription || null,
        establishedYear: payload.establishedYear ?? null,
        numberOfEmployees: payload.numberOfEmployees || null,
        operatingHours: payload.operatingHours || null,
        websiteUrl: payload.websiteUrl || null,
        socialMediaLinks: JSON.stringify(payload.socialMediaLinks),
        servicesOffered: JSON.stringify(payload.servicesOffered),
        serviceAreas: JSON.stringify(payload.serviceAreas),
      },
    });

    await prisma.providerDocument.deleteMany({
      where: { companyId: existing.id },
    });

    if (payload.documents.length > 0) {
      await prisma.providerDocument.createMany({
        data: payload.documents.map((document) => ({
          companyId: existing.id,
          type: document.type,
          fileName: document.fileName,
          fileUrl: document.fileUrl,
          status: document.status || "uploaded",
          notes: document.notes || null,
        })),
      });
    }

    const company = await findProviderCompany(user.id);
    if (!company) {
      return apiError("Provider company profile not found.", 404);
    }

    return NextResponse.json({ company: serializeCompany(company) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid company payload", 422);
    }

    console.error("Company route error:", error);
    return apiError("Unable to update the company profile right now.", 500);
  }
}

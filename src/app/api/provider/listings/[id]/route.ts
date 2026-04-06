import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { serializeListing } from "@/lib/platform";

export const dynamic = "force-dynamic";
const updateListingSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  listingType: z.string().min(1).optional(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  pricingModel: z.string().optional(),
  basePrice: z.coerce.number().optional().nullable(),
  currency: z.string().optional(),
  instantBooking: z.boolean().optional(),
  bookingMode: z.string().optional(),
  status: z
    .enum(["draft", "pending_review", "active", "paused", "archived"])
    .optional(),
  visibility: z.enum(["private", "public"]).optional(),
  capacity: z.coerce.number().int().optional().nullable(),
  pickupLeadTimeHours: z.coerce.number().int().optional().nullable(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  policies: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  availability: z
    .array(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        unitsAvailable: z.coerce.number().int().optional().nullable(),
        status: z.string().default("available"),
        notes: z.string().optional().nullable(),
      })
    )
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can edit listings.", 403);
    }

    const company = await prisma.providerCompany.findUnique({
      where: { ownerUserId: user.id },
      select: { id: true },
    });

    if (!company) {
      return apiError("Provider company profile not found.", 404);
    }

    const listing = await prisma.providerListing.findFirst({
      where: {
        id: params.id,
        companyId: company.id,
      },
      select: { id: true },
    });

    if (!listing) {
      return apiError("Listing not found.", 404);
    }

    const payload = updateListingSchema.parse(await request.json());

    await prisma.providerListing.update({
      where: { id: listing.id },
      data: {
        title: payload.title,
        category: payload.category,
        listingType: payload.listingType,
        shortDescription: payload.shortDescription,
        description: payload.description,
        location: payload.location,
        pricingModel: payload.pricingModel,
        basePrice: payload.basePrice,
        currency: payload.currency,
        instantBooking: payload.instantBooking,
        bookingMode: payload.bookingMode,
        status: payload.status,
        visibility: payload.visibility,
        capacity: payload.capacity,
        pickupLeadTimeHours: payload.pickupLeadTimeHours,
        images: payload.images ? JSON.stringify(payload.images) : undefined,
        tags: payload.tags ? JSON.stringify(payload.tags) : undefined,
        amenities: payload.amenities ? JSON.stringify(payload.amenities) : undefined,
        policies: payload.policies ? JSON.stringify(payload.policies) : undefined,
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : undefined,
      },
    });

    if (payload.availability) {
      await prisma.listingAvailability.deleteMany({
        where: { listingId: listing.id },
      });

      if (payload.availability.length > 0) {
        await prisma.listingAvailability.createMany({
          data: payload.availability.map((slot) => ({
            listingId: listing.id,
            startDate: new Date(slot.startDate),
            endDate: new Date(slot.endDate),
            unitsAvailable: slot.unitsAvailable ?? null,
            status: slot.status,
            notes: slot.notes || null,
          })),
        });
      }
    }

    const updatedListing = await prisma.providerListing.findUnique({
      where: { id: listing.id },
      include: {
        availability: true,
        bookings: true,
      },
    });

    if (!updatedListing) {
      return apiError("Listing not found.", 404);
    }

    return NextResponse.json({ listing: serializeListing(updatedListing) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid listing payload", 422);
    }

    console.error("Provider listing update error:", error);
    return apiError("Unable to update listing right now.", 500);
  }
}

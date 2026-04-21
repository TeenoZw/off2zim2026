import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import {
  sendBookingConfirmation,
  sendProviderNewBookingAlert,
} from "@/lib/platform-email";

export const dynamic = "force-dynamic";
const bookingRequestSchema = z.object({
  guests: z.coerce.number().int().positive().default(1),
  checkIn: z.string().optional().nullable(),
  checkOut: z.string().optional().nullable(),
  specialRequests: z.string().optional().nullable(),
});

function confirmationNumber() {
  return `OFF2ZIM-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { user } = await requireSessionUser();
    const payload = bookingRequestSchema.parse(await request.json());

    const listing = await prisma.providerListing.findUnique({
      where: { slug: params.slug },
      include: {
        company: true,
      },
    });

    if (!listing || listing.visibility !== "public") {
      return apiError("Listing not found.", 404);
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        providerId: listing.companyId,
        listingId: listing.id,
        bookingType: listing.listingType.toUpperCase(),
        status: listing.instantBooking ? "CONFIRMED" : "REQUESTED",
        totalAmount: listing.basePrice || 0,
        currency: listing.currency,
        confirmationNumber: confirmationNumber(),
        checkIn: payload.checkIn ? new Date(payload.checkIn) : null,
        checkOut: payload.checkOut ? new Date(payload.checkOut) : null,
        guests: payload.guests,
        specialRequests: payload.specialRequests || null,
        metadata: JSON.stringify({
          listingTitle: listing.title,
          bookingMode: listing.bookingMode,
          providerCompanyId: listing.companyId,
        }),
      },
    });

    // Fire-and-forget emails
    void sendBookingConfirmation({
      to: user.email,
      explorerName: user.name ?? user.email,
      confirmationNumber: booking.confirmationNumber,
      listingTitle: listing.title,
      providerName: listing.company.companyName,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      checkIn: payload.checkIn ?? null,
    }).catch(() => {});

    void (async () => {
      const providerOwner = await prisma.user.findUnique({
        where: { id: listing.company.ownerUserId },
        select: { email: true, name: true },
      });
      if (providerOwner?.email) {
        void sendProviderNewBookingAlert({
          to: providerOwner.email,
          providerName: listing.company.companyName,
          confirmationNumber: booking.confirmationNumber,
          listingTitle: listing.title,
          explorerName: user.name ?? user.email,
          guests: payload.guests,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          checkIn: payload.checkIn ?? null,
        }).catch(() => {});
      }
    })();

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        confirmationNumber: booking.confirmationNumber,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid booking request", 422);
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Please sign in to place a booking request.", 401);
    }

    console.error("Public booking request error:", error);
    return apiError("Unable to create booking right now.", 500);
  }
}

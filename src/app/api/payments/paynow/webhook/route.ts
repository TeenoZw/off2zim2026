import { NextRequest, NextResponse } from "next/server";
import type { StatusResponse } from "paynow";
import { getPaynowClient } from "@/lib/paynow";
import { prisma } from "@/lib/prisma";
import { sendBookingStatusUpdate } from "@/lib/platform-email";

// parseStatusUpdate exists on the Paynow class at runtime but is not in the
// bundled .js type inference (the package ships no .d.ts). We type it here.
interface PaynowWithStatusUpdate {
  parseStatusUpdate(queryString: string): StatusResponse;
}

export const dynamic = "force-dynamic";

/**
 * Paynow result URL — receives URL-encoded POST after each status change.
 *
 * Paynow sends:
 *   reference, paynowreference, amount, status, pollurl, hash
 *
 * Security: hash is SHA-512(all_values_concat + integrationKey).
 * We delegate verification to the Paynow SDK's parseStatusUpdate().
 */
export async function POST(request: NextRequest) {
  // ── Read URL-encoded body ─────────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  if (!rawBody) {
    return new NextResponse("Empty body", { status: 400 });
  }

  // ── Verify hash via Paynow SDK ────────────────────────────────────────────
  let paynow;
  try {
    paynow = getPaynowClient();
  } catch (err) {
    console.error("[paynow/webhook] Client init failed:", err);
    return new NextResponse("Payment provider not configured", { status: 503 });
  }

  let statusResponse: StatusResponse;
  try {
    statusResponse = (paynow as unknown as PaynowWithStatusUpdate).parseStatusUpdate(rawBody);
  } catch (err) {
    console.error("[paynow/webhook] Hash verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // ── Map Paynow status to internal status ──────────────────────────────────
  const paynowStatus = statusResponse.status?.toLowerCase();
  let internalStatus: string;

  switch (paynowStatus) {
    case "paid":
    case "awaiting delivery":
    case "delivered":
      internalStatus = "PAID";
      break;
    case "cancelled":
    case "failed":
      internalStatus = "FAILED";
      break;
    default:
      // "pending", "sent", "disputed" — don't change DB yet
      return new NextResponse("Ok", { status: 200 });
  }

  // ── Find the payment record ───────────────────────────────────────────────
  const reference = statusResponse.reference; // e.g. "OFF2ZIM-<bookingId>"
  if (!reference) {
    console.error("[paynow/webhook] No reference in status update");
    return new NextResponse("Ok", { status: 200 });
  }

  const paymentRecord = await prisma.payment.findFirst({
    where: { reference },
    include: {
      booking: {
        select: {
          id: true,
          status: true,
          confirmationNumber: true,
          user: { select: { email: true, name: true } },
          listing: { select: { title: true } },
        },
      },
    },
  });

  if (!paymentRecord) {
    console.warn(`[paynow/webhook] No payment found for reference: ${reference}`);
    return new NextResponse("Ok", { status: 200 });
  }

  // Already settled — idempotent
  if (paymentRecord.status === internalStatus) {
    return new NextResponse("Ok", { status: 200 });
  }

  // ── Update payment and booking atomically ─────────────────────────────────
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: internalStatus,
        processedAt: internalStatus === "PAID" ? new Date() : null,
      },
    });

    if (internalStatus === "PAID") {
      await tx.booking.update({
        where: { id: paymentRecord.bookingId },
        data: { status: "CONFIRMED" },
      });
    } else if (internalStatus === "FAILED") {
      // Only cancel if booking hasn't progressed beyond CONFIRMED
      const booking = await tx.booking.findUnique({
        where: { id: paymentRecord.bookingId },
        select: { status: true },
      });
      if (booking && ["PENDING", "REQUESTED", "CONFIRMED"].includes(booking.status)) {
        await tx.booking.update({
          where: { id: paymentRecord.bookingId },
          data: { status: "CANCELLED" },
        });
      }
    }
  });

  // ── Fire email notifications ──────────────────────────────────────────────
  const { booking } = paymentRecord;
  if (booking) {
    const newBookingStatus = internalStatus === "PAID" ? "CONFIRMED" : "CANCELLED";
    void sendBookingStatusUpdate({
      to: booking.user.email,
      explorerName: booking.user.name ?? "Explorer",
      confirmationNumber: booking.confirmationNumber,
      listingTitle: booking.listing?.title ?? "your booking",
      newStatus: newBookingStatus,
    }).catch((err) => {
      console.error("[paynow/webhook] Email send failed:", err);
    });
  }

  return new NextResponse("Ok", { status: 200 });
}

/**
 * Paynow return URL health check — Paynow may GET this URL to confirm it is reachable.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", paymentsEnabled: true });
}

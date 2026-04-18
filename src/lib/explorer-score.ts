import { prisma } from "@/lib/prisma";

export interface ExplorerScoreBreakdown {
  total: number;
  completedBookings: number;
  lastMinuteCancellations: number;
  reviewsWritten: number;
  disputesLost: number;
}

const POINTS = {
  completedBooking: 10,
  lastMinuteCancellation: -15,
  reviewWritten: 3,
  disputeLost: -5,
} as const;

// A cancellation is "last-minute" if it happens within 48 hours of check-in
const LAST_MINUTE_HOURS = 48;

function isLastMinuteCancellation(booking: {
  checkIn: Date | null;
  updatedAt: Date;
}): boolean {
  if (!booking.checkIn) return false;
  const hoursUntilCheckIn =
    (booking.checkIn.getTime() - booking.updatedAt.getTime()) / (1000 * 60 * 60);
  return hoursUntilCheckIn < LAST_MINUTE_HOURS;
}

export async function recalculateExplorerScore(
  userId: string
): Promise<ExplorerScoreBreakdown> {
  const [bookings, reviews] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      select: {
        status: true,
        checkIn: true,
        updatedAt: true,
        disputes: {
          select: { status: true },
        },
      },
    }),
    prisma.review.findMany({
      where: { userId },
      select: { id: true },
    }),
  ]);

  let completedBookings = 0;
  let lastMinuteCancellations = 0;
  let disputesLost = 0;

  for (const booking of bookings) {
    if (booking.status === "COMPLETED") {
      completedBookings++;
    } else if (booking.status === "CANCELLED" && isLastMinuteCancellation(booking)) {
      lastMinuteCancellations++;
    }

    for (const dispute of booking.disputes) {
      if (dispute.status === "resolved_against_explorer") {
        disputesLost++;
      }
    }
  }

  const reviewsWritten = reviews.length;

  const total = Math.max(
    0,
    completedBookings * POINTS.completedBooking +
      lastMinuteCancellations * POINTS.lastMinuteCancellation +
      reviewsWritten * POINTS.reviewWritten +
      disputesLost * POINTS.disputeLost
  );

  const breakdown: ExplorerScoreBreakdown = {
    total,
    completedBookings,
    lastMinuteCancellations,
    reviewsWritten,
    disputesLost,
  };

  await prisma.user.update({
    where: { id: userId },
    data: {
      explorerScore: JSON.stringify(breakdown),
    },
  });

  return breakdown;
}

export function parseExplorerScore(raw: string | null | undefined): ExplorerScoreBreakdown {
  if (!raw) {
    return {
      total: 0,
      completedBookings: 0,
      lastMinuteCancellations: 0,
      reviewsWritten: 0,
      disputesLost: 0,
    };
  }
  try {
    return JSON.parse(raw) as ExplorerScoreBreakdown;
  } catch {
    return {
      total: 0,
      completedBookings: 0,
      lastMinuteCancellations: 0,
      reviewsWritten: 0,
      disputesLost: 0,
    };
  }
}

export function scoreLabel(total: number): string {
  if (total >= 100) return "Excellent";
  if (total >= 60) return "Good";
  if (total >= 30) return "Fair";
  return "New";
}

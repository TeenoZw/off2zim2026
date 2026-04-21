import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "admin") return apiError("Admins only.", 403);

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Commission aggregates by type and status
    const commissionsByType = await prisma.platformCommission.groupBy({
      by: ["transactionType", "status"],
      where: { createdAt: { gte: since } },
      _sum: { commissionAmount: true, grossAmount: true, netAmount: true },
      _count: { id: true },
    });

    // Total commission in period
    const totalCommission = await prisma.platformCommission.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { commissionAmount: true, grossAmount: true },
      _count: { id: true },
    });

    // Subscription revenue
    const subscriptionCounts = await prisma.subscription.groupBy({
      by: ["planType", "billingCycle", "status"],
      _count: { id: true },
    });

    const activeVerifiedCount = await prisma.subscription.count({
      where: { planType: "verified_badge", status: "active", currentPeriodEnd: { gte: new Date() } },
    });

    const activeFeaturedCount = await prisma.subscription.count({
      where: { planType: "featured_placement", status: "active", currentPeriodEnd: { gte: new Date() } },
    });

    // Pending payout total
    const pendingPayouts = await prisma.payout.aggregate({
      where: { status: { in: ["pending", "processing"] } },
      _sum: { amount: true },
      _count: { id: true },
    });

    // Recent commissions (last 10)
    const recentCommissions = await prisma.platformCommission.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        transactionType: true,
        transactionId: true,
        grossAmount: true,
        commissionRate: true,
        commissionAmount: true,
        netAmount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
    });

    // Recent payout requests
    const recentPayouts = await prisma.payout.findMany({
      where: { requestedAt: { gte: since } },
      orderBy: { requestedAt: "desc" },
      take: 10,
      include: {
        company: {
          select: { companyName: true, tradingName: true },
        },
      },
    });

    return NextResponse.json({
      period: { days, since: since.toISOString() },
      commissions: {
        total: {
          count: totalCommission._count.id,
          grossAmount: totalCommission._sum.grossAmount ?? 0,
          commissionAmount: totalCommission._sum.commissionAmount ?? 0,
        },
        byType: commissionsByType.map((row) => ({
          transactionType: row.transactionType,
          status: row.status,
          count: row._count.id,
          grossAmount: row._sum.grossAmount ?? 0,
          commissionAmount: row._sum.commissionAmount ?? 0,
          netAmount: row._sum.netAmount ?? 0,
        })),
        recent: recentCommissions.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
      },
      subscriptions: {
        activeVerified: activeVerifiedCount,
        activeFeatured: activeFeaturedCount,
        breakdown: subscriptionCounts.map((row) => ({
          planType: row.planType,
          billingCycle: row.billingCycle,
          status: row.status,
          count: row._count.id,
        })),
      },
      payouts: {
        pendingCount: pendingPayouts._count.id,
        pendingAmount: pendingPayouts._sum.amount ?? 0,
        recent: recentPayouts.map((p) => ({
          id: p.id,
          companyName: p.company.tradingName || p.company.companyName,
          amount: p.amount,
          currency: p.currency,
          method: p.method,
          status: p.status,
          requestedAt: p.requestedAt.toISOString(),
          processedAt: p.processedAt?.toISOString() ?? null,
        })),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Admin revenue error:", error);
    return apiError("Unable to load revenue data.", 500);
  }
}

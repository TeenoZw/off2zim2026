"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client-api";
import {
  BadgeCheck,
  CreditCard,
  DollarSign,
  Star,
  TrendingUp,
  Wallet,
  Check,
  X,
  Clock,
} from "lucide-react";

interface CommissionRow {
  transactionType: string;
  status: string;
  count: number;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
}

interface RecentCommission {
  id: string;
  transactionType: string;
  transactionId: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface RecentPayout {
  id: string;
  companyName: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

interface RevenueData {
  period: { days: number; since: string };
  commissions: {
    total: { count: number; grossAmount: number; commissionAmount: number };
    byType: CommissionRow[];
    recent: RecentCommission[];
  };
  subscriptions: {
    activeVerified: number;
    activeFeatured: number;
    breakdown: { planType: string; billingCycle: string; status: string; count: number }[];
  };
  payouts: {
    pendingCount: number;
    pendingAmount: number;
    recent: RecentPayout[];
  };
}

const PERIOD_OPTIONS = [7, 30, 90, 365];

const TYPE_LABELS: Record<string, string> = {
  booking: "Bookings",
  guide_booking: "Guide+",
  shop_order: "Marketplace",
};

const STATUS_BADGE: Record<string, string> = {
  held: "bg-[#fbbf24]/10 text-[#fbbf24]",
  released: "bg-[#4ade80]/10 text-[#4ade80]",
  refunded: "bg-white/8 text-white/40",
  pending: "bg-[#fbbf24]/10 text-[#fbbf24]",
  processing: "bg-[#8dc9ff]/10 text-[#8dc9ff]",
  completed: "bg-[#4ade80]/10 text-[#4ade80]",
  failed: "bg-[#ff5630]/10 text-[#ff5630]",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof DollarSign;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="theme-panel rounded-[20px] p-5">
      <div className="flex items-start gap-4">
        <div className={`rounded-2xl p-2.5 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-white/40">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [error, setError] = useState("");
  const [processingPayout, setProcessingPayout] = useState<string | null>(null);
  const [payoutError, setPayoutError] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const d = await apiFetch<RevenueData>(`/api/admin/revenue?days=${period}`);
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load revenue data.");
    } finally {
      setLoading(false);
    }
  }

  async function processPayout(id: string, status: "completed" | "failed") {
    setProcessingPayout(id);
    setPayoutError("");
    try {
      await apiFetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : "Unable to process payout.");
    } finally {
      setProcessingPayout(null);
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminShell
        activePath="/admin/revenue"
        title="Revenue & Monetization"
        description="Commission income, subscription analytics, and payout management."
      >
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Period selector */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-white/40">Period:</span>
            <div className="flex gap-2">
              {PERIOD_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setPeriod(d)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    period === d
                      ? "bg-[#ff5630] text-white"
                      : "border border-white/10 text-white/50 hover:text-white/80"
                  }`}
                >
                  {d === 365 ? "1y" : `${d}d`}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
              {error}
            </div>
          ) : null}

          {loading || !data ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="theme-panel animate-pulse rounded-[20px] p-5 h-24" />
              ))}
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label={`Commission (${period}d)`}
                  value={`$${data.commissions.total.commissionAmount.toFixed(2)}`}
                  sub={`${data.commissions.total.count} transactions`}
                  icon={DollarSign}
                  iconColor="text-[#4ade80]"
                  iconBg="bg-[#4ade80]/10"
                />
                <StatCard
                  label="GMV (gross volume)"
                  value={`$${data.commissions.total.grossAmount.toFixed(2)}`}
                  sub={`${period}-day period`}
                  icon={TrendingUp}
                  iconColor="text-[#8dc9ff]"
                  iconBg="bg-[#8dc9ff]/10"
                />
                <StatCard
                  label="Verified subscribers"
                  value={String(data.subscriptions.activeVerified)}
                  sub={`${data.subscriptions.activeFeatured} featured`}
                  icon={BadgeCheck}
                  iconColor="text-[#4ade80]"
                  iconBg="bg-[#4ade80]/10"
                />
                <StatCard
                  label="Pending payouts"
                  value={`$${data.payouts.pendingAmount.toFixed(2)}`}
                  sub={`${data.payouts.pendingCount} requests`}
                  icon={Wallet}
                  iconColor="text-[#fbbf24]"
                  iconBg="bg-[#fbbf24]/10"
                />
              </div>

              {/* Commission breakdown by type */}
              <div className="theme-panel rounded-[24px] p-6">
                <h2 className="mb-4 text-base font-semibold text-white/80">
                  Commission by transaction type
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-white/35 border-b border-white/8">
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium text-right">Transactions</th>
                        <th className="pb-3 font-medium text-right">Gross</th>
                        <th className="pb-3 font-medium text-right">Commission</th>
                        <th className="pb-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.commissions.byType.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-white/30">
                            No commission transactions in this period.
                          </td>
                        </tr>
                      ) : (
                        data.commissions.byType.map((row, i) => (
                          <tr key={i}>
                            <td className="py-3 text-white/70">
                              {TYPE_LABELS[row.transactionType] ?? row.transactionType}
                            </td>
                            <td className="py-3 text-right text-white/50">{row.count}</td>
                            <td className="py-3 text-right text-white/70">
                              ${row.grossAmount.toFixed(2)}
                            </td>
                            <td className="py-3 text-right font-medium text-[#4ade80]">
                              ${row.commissionAmount.toFixed(2)}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[row.status] ?? "bg-white/8 text-white/40"}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subscriptions breakdown */}
              <div className="theme-panel rounded-[24px] p-6">
                <h2 className="mb-4 text-base font-semibold text-white/80">
                  Active subscriptions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-[#4ade80]/15 bg-[#4ade80]/5 p-4">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-[#4ade80]" />
                      <div>
                        <p className="text-xs text-white/40">Verified Badge</p>
                        <p className="text-2xl font-bold text-white">
                          {data.subscriptions.activeVerified}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-[#fbbf24]/15 bg-[#fbbf24]/5 p-4">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-[#fbbf24]" />
                      <div>
                        <p className="text-xs text-white/40">Featured Placement</p>
                        <p className="text-2xl font-bold text-white">
                          {data.subscriptions.activeFeatured}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending payouts */}
              {data.payouts.recent.length > 0 && (
                <div className="theme-panel rounded-[24px] p-6">
                  <h2 className="mb-4 text-base font-semibold text-white/80">
                    Recent payout requests
                  </h2>
                  {payoutError ? (
                    <div className="mb-4 rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
                      {payoutError}
                    </div>
                  ) : null}
                  <div className="space-y-3">
                    {data.payouts.recent.map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-white/6 bg-white/[0.02] px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate">
                            {payout.companyName}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/35">
                            <span>${payout.amount.toFixed(2)} {payout.currency}</span>
                            <span>·</span>
                            <span className="capitalize">{payout.method.replace("_", " ")}</span>
                            <span>·</span>
                            <Clock className="h-3 w-3" />
                            <span>{new Date(payout.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[payout.status] ?? "bg-white/8 text-white/40"}`}>
                            {payout.status}
                          </span>
                          {payout.status === "pending" && (
                            <>
                              <button
                                onClick={() => processPayout(payout.id, "completed")}
                                disabled={processingPayout === payout.id}
                                className="rounded-lg bg-[#4ade80]/10 p-1.5 text-[#4ade80] hover:bg-[#4ade80]/20 disabled:opacity-50"
                                title="Mark completed"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => processPayout(payout.id, "failed")}
                                disabled={processingPayout === payout.id}
                                className="rounded-lg bg-[#ff5630]/10 p-1.5 text-[#ff5630] hover:bg-[#ff5630]/20 disabled:opacity-50"
                                title="Mark failed"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent commissions */}
              {data.commissions.recent.length > 0 && (
                <div className="theme-panel rounded-[24px] p-6">
                  <h2 className="mb-4 text-base font-semibold text-white/80">
                    Recent commission events
                  </h2>
                  <div className="space-y-2">
                    {data.commissions.recent.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-white/6 bg-white/[0.02] px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CreditCard className="h-4 w-4 shrink-0 text-white/30" />
                          <div className="min-w-0">
                            <p className="text-white/70 truncate">
                              {TYPE_LABELS[c.transactionType] ?? c.transactionType}
                              <span className="ml-2 font-mono text-xs text-white/25">
                                {c.transactionId.slice(-8)}
                              </span>
                            </p>
                            <p className="text-xs text-white/30">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-[#4ade80]">
                            +${c.commissionAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-white/30">
                            {Math.round(c.commissionRate * 100)}% of ${c.grossAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

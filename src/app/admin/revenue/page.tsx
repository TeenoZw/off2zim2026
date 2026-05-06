"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ActionButton from "@/components/admin/ActionButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatGrid from "@/components/admin/AdminStatGrid";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetch } from "@/lib/client-api";
import {
  BadgeCheck,
  CircleDollarSign,
  TrendingUp,
  Wallet,
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

function statusTone(status: string) {
  if (["completed", "released"].includes(status)) return "success" as const;
  if (["pending", "processing", "held"].includes(status)) return "pending" as const;
  if (["failed", "refunded"].includes(status)) return "danger" as const;
  return "neutral" as const;
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
      const response = await apiFetch<RevenueData>(`/api/admin/revenue?days=${period}`);
      setData(response);
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

  const chartData = useMemo(
    () =>
      (data?.commissions.byType || []).map((row) => ({
        name: TYPE_LABELS[row.transactionType] ?? row.transactionType,
        gross: Number(row.grossAmount.toFixed(2)),
        commission: Number(row.commissionAmount.toFixed(2)),
      })),
    [data]
  );

  return (
    <ProtectedRoute requiredRole="admin" surface="admin">
      <AdminShell
        activePath="/admin/revenue"
        title="Revenue"
        description="Track marketplace revenue, commission earned, subscription counts, and payout processing."
        actions={
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((value) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  period === value
                    ? "bg-[#ff5630] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-white/70 dark:hover:bg-white/[0.04]"
                }`}
              >
                {value === 365 ? "1 year" : `${value} days`}
              </button>
            ))}
          </div>
        }
      >
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        ) : null}
        {payoutError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {payoutError}
          </div>
        ) : null}

        <AdminStatGrid>
          <AdminCard
            label="Total revenue"
            value={
              loading || !data ? "—" : `$${data.commissions.total.grossAmount.toFixed(2)}`
            }
            icon={CircleDollarSign}
            tone="success"
          />
          <AdminCard
            label="Commission earned"
            value={
              loading || !data
                ? "—"
                : `$${data.commissions.total.commissionAmount.toFixed(2)}`
            }
            icon={TrendingUp}
            tone="info"
          />
          <AdminCard
            label="Pending payouts"
            value={loading || !data ? "—" : data.payouts.pendingCount}
            icon={Wallet}
            tone="warning"
          />
          <AdminCard
            label="Verified subscriptions"
            value={loading || !data ? "—" : data.subscriptions.activeVerified}
            icon={BadgeCheck}
            tone="default"
          />
        </AdminStatGrid>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
            <div className="px-6 pt-5">
              <AdminSectionHeader
                title="Commission by transaction type"
                description="Gross value and commission generated by each transaction type."
              />
            </div>
            <div className="h-[320px] px-4 pb-4 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="gross" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="commission" fill="#ff5630" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101010]">
            <AdminSectionHeader
              title="Subscriptions"
              description="Current verified badge and featured placement counts."
            />
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="text-sm text-slate-500 dark:text-white/45">Verified badge</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {loading || !data ? "—" : data.subscriptions.activeVerified}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="text-sm text-slate-500 dark:text-white/45">Featured placement</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {loading || !data ? "—" : data.subscriptions.activeFeatured}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="text-sm text-slate-500 dark:text-white/45">Pending payout amount</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {loading || !data ? "—" : `$${data.payouts.pendingAmount.toFixed(2)}`}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
          <div className="px-6 pt-5">
            <AdminSectionHeader
              title="Transactions"
              description="Recent commission events by transaction source."
            />
          </div>
          <div className="px-6 pb-6 pt-4">
            <AdminTable
              columns={[
                {
                  key: "type",
                  header: "Type",
                  cell: (row: RecentCommission) =>
                    TYPE_LABELS[row.transactionType] ?? row.transactionType,
                },
                {
                  key: "transaction",
                  header: "Transaction",
                  cell: (row: RecentCommission) => row.transactionId,
                },
                {
                  key: "gross",
                  header: "Total revenue",
                  cell: (row: RecentCommission) => `$${row.grossAmount.toFixed(2)}`,
                },
                {
                  key: "commission",
                  header: "Commission earned",
                  cell: (row: RecentCommission) => `$${row.commissionAmount.toFixed(2)}`,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (row: RecentCommission) => (
                    <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>
                  ),
                },
              ]}
              rows={data?.commissions.recent || []}
              rowKey={(row) => row.id}
              emptyState="No recent transactions in this period."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
          <div className="px-6 pt-5">
            <AdminSectionHeader
              title="Payouts"
              description="Approve or fail pending provider payouts."
            />
          </div>
          <div className="px-6 pb-6 pt-4">
            <AdminTable
              columns={[
                {
                  key: "company",
                  header: "Provider",
                  cell: (row: RecentPayout) => row.companyName,
                },
                {
                  key: "amount",
                  header: "Amount",
                  cell: (row: RecentPayout) => `$${row.amount.toFixed(2)} ${row.currency}`,
                },
                {
                  key: "method",
                  header: "Method",
                  cell: (row: RecentPayout) => row.method,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (row: RecentPayout) => (
                    <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (row: RecentPayout) => (
                    <div className="flex flex-wrap gap-2">
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={processingPayout === row.id}
                        onClick={() => processPayout(row.id, "completed")}
                      >
                        Complete
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        size="sm"
                        disabled={processingPayout === row.id}
                        onClick={() => processPayout(row.id, "failed")}
                      >
                        Fail
                      </ActionButton>
                    </div>
                  ),
                },
              ]}
              rows={data?.payouts.recent || []}
              rowKey={(row) => row.id}
              emptyState="No payout records available."
            />
          </div>
        </section>
      </AdminShell>
    </ProtectedRoute>
  );
}

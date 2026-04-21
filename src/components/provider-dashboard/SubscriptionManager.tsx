"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  Star,
  TrendingUp,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { apiFetch } from "@/lib/client-api";

interface SubscriptionRecord {
  id: string;
  planType: string;
  billingCycle: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
}

interface Plans {
  verified_badge: { monthly: number; annual: number };
  featured_placement: { monthly: number; annual: number };
}

interface SubState {
  subscriptions: SubscriptionRecord[];
  plans: Plans;
  company: { isVerified: boolean; isFeaturedEligible: boolean };
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  method: string;
  accountRef: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

type ActivePanel = "subscriptions" | "earnings";

const PAYOUT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  ecocash: "EcoCash",
  onemoney: "OneMoney",
  telecash: "TeleCash",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-[#4ade80] bg-[#4ade80]/10",
  cancelled: "text-white/40 bg-white/8",
  expired: "text-white/40 bg-white/8",
  past_due: "text-[#ff5630] bg-[#ff5630]/10",
  pending: "text-[#fbbf24] bg-[#fbbf24]/10",
  processing: "text-[#8dc9ff] bg-[#8dc9ff]/10",
  completed: "text-[#4ade80] bg-[#4ade80]/10",
  failed: "text-[#ff5630] bg-[#ff5630]/10",
};

export default function SubscriptionManager() {
  const [panel, setPanel] = useState<ActivePanel>("subscriptions");
  const [subState, setSubState] = useState<SubState | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingPayoutTotal, setPendingPayoutTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Subscribe flow
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<Record<string, "monthly" | "annual">>({
    verified_badge: "monthly",
    featured_placement: "monthly",
  });
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Payout request form
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("ecocash");
  const [payoutRef, setPayoutRef] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [subData, payoutData] = await Promise.all([
        apiFetch<SubState>("/api/subscriptions"),
        apiFetch<{ payouts: Payout[]; pendingPayoutTotal: number }>("/api/provider/payouts"),
      ]);
      setSubState(subData);
      setPayouts(payoutData.payouts);
      setPendingPayoutTotal(payoutData.pendingPayoutTotal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load subscription data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(planType: string) {
    setSubscribing(planType);
    setError("");
    setSuccess("");
    try {
      await apiFetch("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          planType,
          billingCycle: selectedCycle[planType] ?? "monthly",
        }),
      });
      setSuccess(`${planType === "verified_badge" ? "Verified Badge" : "Featured Placement"} subscription activated.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to subscribe.");
    } finally {
      setSubscribing(null);
    }
  }

  async function handleCancel(subId: string, planType: string) {
    if (!confirm(`Cancel your ${planType.replace("_", " ")} subscription? Access ends immediately.`)) return;
    setCancelling(subId);
    setError("");
    try {
      await apiFetch(`/api/subscriptions/${subId}/cancel`, { method: "POST", body: "{}" });
      setSuccess("Subscription cancelled.");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel.");
    } finally {
      setCancelling(null);
    }
  }

  async function handlePayoutRequest(e: React.FormEvent) {
    e.preventDefault();
    setRequestingPayout(true);
    setError("");
    try {
      await apiFetch("/api/provider/payouts", {
        method: "POST",
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          method: payoutMethod,
          accountRef: payoutRef,
        }),
      });
      setSuccess("Payout request submitted. The team will process it within 2–3 business days.");
      setShowPayoutForm(false);
      setPayoutAmount("");
      setPayoutRef("");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request payout.");
    } finally {
      setRequestingPayout(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="theme-panel animate-pulse rounded-[20px] p-6 h-32" />
        ))}
      </div>
    );
  }

  const activeSubs = subState?.subscriptions.filter((s) => s.status === "active") ?? [];
  const hasVerified = activeSubs.some((s) => s.planType === "verified_badge");
  const hasFeatured = activeSubs.some((s) => s.planType === "featured_placement");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-white/5 p-1">
        {(["subscriptions", "earnings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPanel(tab)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${
              panel === tab
                ? "bg-white/10 text-white"
                : "text-white/45 hover:text-white/70"
            }`}
          >
            {tab === "subscriptions" ? "Subscriptions" : "Earnings & Payouts"}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/8 px-4 py-3 text-sm text-[#4ade80]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {success}
        </div>
      ) : null}

      {panel === "subscriptions" && subState && (
        <div className="space-y-5">
          {/* Verified Badge plan */}
          <PlanCard
            title="Verified Badge"
            description="Get the Verified badge on your profile and all listings. Required for Featured Placement."
            icon={BadgeCheck}
            iconColor="text-[#4ade80]"
            iconBg="bg-[#4ade80]/10"
            price={subState.plans.verified_badge}
            isActive={hasVerified}
            activeSub={activeSubs.find((s) => s.planType === "verified_badge")}
            selectedCycle={selectedCycle.verified_badge}
            onCycleChange={(c) => setSelectedCycle((prev) => ({ ...prev, verified_badge: c }))}
            onSubscribe={() => handleSubscribe("verified_badge")}
            onCancel={(id) => handleCancel(id, "verified_badge")}
            subscribing={subscribing === "verified_badge"}
            cancelling={cancelling}
            canSubscribe={true}
          />

          {/* Featured Placement plan */}
          <PlanCard
            title="Featured Placement"
            description="Join the sponsored rotation on the Featured section. Requires an active Verified Badge."
            icon={Star}
            iconColor="text-[#fbbf24]"
            iconBg="bg-[#fbbf24]/10"
            price={subState.plans.featured_placement}
            isActive={hasFeatured}
            activeSub={activeSubs.find((s) => s.planType === "featured_placement")}
            selectedCycle={selectedCycle.featured_placement}
            onCycleChange={(c) => setSelectedCycle((prev) => ({ ...prev, featured_placement: c }))}
            onSubscribe={() => handleSubscribe("featured_placement")}
            onCancel={(id) => handleCancel(id, "featured_placement")}
            subscribing={subscribing === "featured_placement"}
            cancelling={cancelling}
            canSubscribe={hasVerified}
            gateMessage="Requires an active Verified Badge subscription"
          />

          {/* Subscription history */}
          {subState.subscriptions.length > 0 && (
            <div className="theme-panel rounded-[20px] p-5">
              <h3 className="mb-4 text-sm font-semibold text-white/70">Subscription history</h3>
              <div className="space-y-3">
                {subState.subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-white/80">
                        {sub.planType === "verified_badge" ? "Verified Badge" : "Featured Placement"}
                        {" · "}
                        <span className="capitalize text-white/45">{sub.billingCycle}</span>
                      </p>
                      <p className="text-xs text-white/35">
                        {new Date(sub.currentPeriodStart).toLocaleDateString()} –{" "}
                        {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[sub.status] ?? "text-white/40 bg-white/8"}`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {panel === "earnings" && (
        <div className="space-y-5">
          {/* Earnings summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="theme-panel rounded-[20px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#4ade80]/10 p-2.5">
                  <TrendingUp className="h-5 w-5 text-[#4ade80]" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Pending payouts</p>
                  <p className="text-xl font-bold text-white">
                    ${pendingPayoutTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="theme-panel rounded-[20px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#8dc9ff]/10 p-2.5">
                  <Wallet className="h-5 w-5 text-[#8dc9ff]" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Total payout requests</p>
                  <p className="text-xl font-bold text-white">{payouts.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request payout */}
          {!showPayoutForm ? (
            <button
              onClick={() => setShowPayoutForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff5630] py-3 text-sm font-semibold text-white transition hover:bg-[#ff4520]"
            >
              <CreditCard className="h-4 w-4" />
              Request payout
            </button>
          ) : (
            <form onSubmit={handlePayoutRequest} className="theme-panel rounded-[20px] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/80">Request payout</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                  >
                    {Object.entries(PAYOUT_METHOD_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">
                  {payoutMethod === "bank_transfer" ? "Bank account number" : "Mobile number"}
                </label>
                <input
                  type="text"
                  required
                  value={payoutRef}
                  onChange={(e) => setPayoutRef(e.target.value)}
                  className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                  placeholder={payoutMethod === "bank_transfer" ? "Account number" : "+263 7X XXX XXXX"}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={requestingPayout}
                  className="flex-1 rounded-xl bg-[#ff5630] py-3 text-sm font-semibold text-white transition hover:bg-[#ff4520] disabled:opacity-50"
                >
                  {requestingPayout ? "Requesting…" : "Submit request"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayoutForm(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Payout history */}
          {payouts.length > 0 ? (
            <div className="theme-panel rounded-[20px] p-5">
              <h3 className="mb-4 text-sm font-semibold text-white/70">Payout history</h3>
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white/80">
                          ${payout.amount.toFixed(2)} {payout.currency}
                        </p>
                        <span className="text-xs text-white/35">
                          via {PAYOUT_METHOD_LABELS[payout.method] ?? payout.method}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-white/35">
                        <Clock className="h-3 w-3" />
                        {new Date(payout.requestedAt).toLocaleDateString()}
                        {payout.processedAt ? ` · processed ${new Date(payout.processedAt).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[payout.status] ?? "text-white/40 bg-white/8"}`}>
                      {payout.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="theme-panel rounded-[28px] p-8 text-center">
              <Wallet className="mx-auto mb-2 h-8 w-8 text-white/20" />
              <p className="theme-muted text-sm">No payout requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  price,
  isActive,
  activeSub,
  selectedCycle,
  onCycleChange,
  onSubscribe,
  onCancel,
  subscribing,
  cancelling,
  canSubscribe,
  gateMessage,
}: {
  title: string;
  description: string;
  icon: typeof BadgeCheck;
  iconColor: string;
  iconBg: string;
  price: { monthly: number; annual: number };
  isActive: boolean;
  activeSub?: SubscriptionRecord;
  selectedCycle: "monthly" | "annual";
  onCycleChange: (c: "monthly" | "annual") => void;
  onSubscribe: () => void;
  onCancel: (id: string) => void;
  subscribing: boolean;
  cancelling: string | null;
  canSubscribe: boolean;
  gateMessage?: string;
}) {
  const displayPrice = selectedCycle === "monthly" ? price.monthly : price.annual;
  const annualSaving = Math.round(((price.monthly * 12 - price.annual) / (price.monthly * 12)) * 100);

  return (
    <div className={`theme-panel rounded-[24px] p-6 ${isActive ? "border border-[#4ade80]/20" : ""}`}>
      <div className="flex items-start gap-4">
        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="theme-heading font-semibold">{title}</h3>
            {isActive && (
              <span className="rounded-full bg-[#4ade80]/10 px-2.5 py-0.5 text-xs font-medium text-[#4ade80]">
                Active
              </span>
            )}
          </div>
          <p className="theme-muted mt-1 text-sm">{description}</p>

          {!isActive && (
            <>
              {/* Billing cycle toggle */}
              <div className="mt-4 flex gap-2">
                {(["monthly", "annual"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => onCycleChange(cycle)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition ${
                      selectedCycle === cycle
                        ? "border-white/25 text-white"
                        : "border-white/8 text-white/45 hover:border-white/15 hover:text-white/70"
                    }`}
                  >
                    <span className="capitalize">{cycle}</span>
                    <span className="font-semibold">
                      ${cycle === "monthly" ? price.monthly : price.annual}
                    </span>
                    {cycle === "annual" && (
                      <span className="rounded-full bg-[#4ade80]/15 px-1.5 py-0.5 text-xs text-[#4ade80]">
                        -{annualSaving}%
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {!canSubscribe && gateMessage ? (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-white/35">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {gateMessage}
                </p>
              ) : (
                <button
                  onClick={onSubscribe}
                  disabled={subscribing || !canSubscribe}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4520] disabled:opacity-50"
                >
                  {subscribing ? "Activating…" : `Subscribe · $${displayPrice}/${selectedCycle === "monthly" ? "mo" : "yr"}`}
                </button>
              )}
            </>
          )}

          {isActive && activeSub && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-white/40">
                Renews {new Date(activeSub.currentPeriodEnd).toLocaleDateString()}
                {" · "}
                <span className="capitalize">{activeSub.billingCycle}</span>
              </p>
              <button
                onClick={() => onCancel(activeSub.id)}
                disabled={cancelling === activeSub.id}
                className="text-xs text-white/40 underline hover:text-white/70 disabled:opacity-50"
              >
                {cancelling === activeSub.id ? "Cancelling…" : "Cancel subscription"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Flag,
  LayoutDashboard,
  ListChecks,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client-api";
import type {
  AdminBookingRecord,
  AdminListingRecord,
  DisputeRecord,
  ProviderCompanyRecord,
} from "@/types/platform";

type DashboardState = {
  providers: ProviderCompanyRecord[];
  bookings: AdminBookingRecord[];
  listings: AdminListingRecord[];
  disputes: DisputeRecord[];
};

const workspaceCards = [
  {
    title: "Provider onboarding",
    body: "Review submissions, documents, verification tiers, and launch readiness.",
    href: "/admin/providers",
    icon: BadgeCheck,
  },
  {
    title: "Platform bookings",
    body: "Track traveler activity, fulfillment status, and account-side exceptions.",
    href: "/admin/bookings",
    icon: ListChecks,
  },
  {
    title: "Listings oversight",
    body: "Control live visibility, category quality, and marketplace placement.",
    href: "/admin/listings",
    icon: ShoppingBag,
  },
  {
    title: "Dispute queue",
    body: "Move quickly on escalations and keep operator ownership clear.",
    href: "/admin/disputes",
    icon: Flag,
  },
];

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminOverviewContent />
    </ProtectedRoute>
  );
}

function AdminOverviewContent() {
  const [state, setState] = useState<DashboardState>({
    providers: [],
    bookings: [],
    listings: [],
    disputes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [providers, bookings, listings, disputes] = await Promise.all([
          apiFetch<{ providers: ProviderCompanyRecord[] }>("/api/admin/providers"),
          apiFetch<{ bookings: AdminBookingRecord[] }>("/api/admin/bookings"),
          apiFetch<{ listings: AdminListingRecord[] }>("/api/admin/listings"),
          apiFetch<{ disputes: DisputeRecord[] }>("/api/admin/disputes"),
        ]);

        setState({
          providers: providers.providers,
          bookings: bookings.bookings,
          listings: listings.listings,
          disputes: disputes.disputes,
        });
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin overview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const metrics = useMemo(() => {
    const onboardingOpen = state.providers.filter(
      (provider) => provider.onboardingStatus !== "basic_approved"
    ).length;
    const bookingsOpen = state.bookings.filter((booking) =>
      ["REQUESTED", "PENDING"].includes(booking.status)
    ).length;
    const listingsPending = state.listings.filter(
      (listing) => listing.status === "pending_review"
    ).length;
    const disputesOpen = state.disputes.filter((dispute) =>
      ["open", "under_review"].includes(dispute.status)
    ).length;

    return [
      {
        label: "Onboarding queue",
        value: onboardingOpen,
        icon: Building2,
        tone: "text-[#ff8a66]",
      },
      {
        label: "Live booking actions",
        value: bookingsOpen,
        icon: ListChecks,
        tone: "text-[#79dca1]",
      },
      {
        label: "Listings awaiting review",
        value: listingsPending,
        icon: ShoppingBag,
        tone: "text-[#8dc9ff]",
      },
      {
        label: "Open disputes",
        value: disputesOpen,
        icon: Flag,
        tone: "text-[#ffca74]",
      },
    ];
  }, [state]);

  const providerQueue = state.providers.slice(0, 5);
  const recentDisputes = state.disputes.slice(0, 4);

  return (
    <AdminShell
      activePath="/admin/overview"
      title="Platform operations"
      description="Start with the queues that affect traveler trust, provider onboarding, and marketplace quality."
      actions={
        <Link
          href="/admin/providers"
          className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white"
        >
          <BadgeCheck className="h-4 w-4" />
          Review onboarding
        </Link>
      }
    >
      {error ? (
        <div className="rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <section key={metric.label} className="theme-panel rounded-[28px] p-5">
              <div className={`inline-flex rounded-2xl p-3 ${metric.tone} bg-black/[0.04] dark:bg-white/[0.05]`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="theme-heading mt-5 text-3xl font-semibold">
                {loading ? "—" : metric.value}
              </div>
              <div className="theme-muted mt-2 text-sm">{metric.label}</div>
            </section>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="theme-panel rounded-[30px] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="theme-heading text-xl font-semibold">Admin workspace</div>
              <div className="theme-muted mt-1 text-sm">
                Core surfaces for provider and traveler administration.
              </div>
            </div>
            <LayoutDashboard className="h-5 w-5 text-[#ff5630]" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {workspaceCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="rounded-[24px] border border-black/8 bg-black/[0.03] p-5 transition hover:bg-black/[0.05] dark:border-white/8 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <Icon className="h-5 w-5 text-[#ff5630]" />
                  <div className="theme-heading mt-4 text-lg font-semibold">{card.title}</div>
                  <div className="theme-muted mt-2 text-sm leading-6">{card.body}</div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="theme-panel rounded-[30px] p-5">
          <div className="theme-heading text-xl font-semibold">Onboarding queue</div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-black/8 bg-black/[0.03] p-4 text-sm text-black/55 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/55">
                Loading onboarding queue...
              </div>
            ) : providerQueue.length === 0 ? (
              <div className="rounded-2xl border border-black/8 bg-black/[0.03] p-4 text-sm text-black/55 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/55">
                No provider reviews waiting.
              </div>
            ) : (
              providerQueue.map((provider) => (
                <Link
                  key={provider.id}
                  href="/admin/providers"
                  className="block rounded-2xl border border-black/8 bg-black/[0.03] p-4 transition hover:bg-black/[0.05] dark:border-white/8 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <div className="theme-heading text-base font-semibold">
                    {provider.companyName}
                  </div>
                  <div className="theme-muted mt-1 text-sm">
                    {provider.businessCategory || "Category pending"}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                    <span>{provider.documents.length} docs</span>
                    <span>{provider.onboardingStatus.replace(/_/g, " ")}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="theme-panel rounded-[30px] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="theme-heading text-xl font-semibold">Disputes requiring attention</div>
            <div className="theme-muted mt-1 text-sm">
              Keep the risk queue visible while onboarding and bookings are moving.
            </div>
          </div>
          <Link
            href="/admin/disputes"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/[0.05] dark:border-white/10 dark:text-white/75 dark:hover:bg-white/[0.06]"
          >
            Open dispute queue
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {loading ? (
            <div className="rounded-2xl border border-black/8 bg-black/[0.03] p-4 text-sm text-black/55 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/55">
              Loading dispute queue...
            </div>
          ) : recentDisputes.length === 0 ? (
            <div className="rounded-2xl border border-black/8 bg-black/[0.03] p-4 text-sm text-black/55 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/55">
              No active disputes.
            </div>
          ) : (
            recentDisputes.map((dispute) => (
              <article
                key={dispute.id}
                className="rounded-2xl border border-black/8 bg-black/[0.03] p-4 dark:border-white/8 dark:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="theme-heading text-base font-semibold">{dispute.reason}</div>
                  <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                    {dispute.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="theme-muted mt-2 text-sm">
                  {dispute.bookingConfirmationNumber}
                </div>
                <div className="theme-muted mt-3 text-sm">
                  {dispute.provider?.companyName || "Off2Zim"} • {dispute.openedBy.name}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import { ArrowRight, Compass, Heart, MapPinned, ReceiptText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { explorerWorkspaceCards } from "@/lib/surface-config";
import { apiFetch } from "@/lib/client-api";

interface DashboardStats {
  savedCount: number;
  bookingCount: number;
}

function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({ savedCount: 0, bookingCount: 0 });

  useEffect(() => {
    Promise.all([
      apiFetch<{ favorites: unknown[] }>("/api/favorites").catch(() => ({ favorites: [] })),
      apiFetch<{ bookings: unknown[] }>("/api/bookings").catch(() => ({ bookings: [] })),
    ]).then(([fav, bk]) => {
      setStats({
        savedCount: fav.favorites.length,
        bookingCount: bk.bookings.length,
      });
    });
  }, []);

  return stats;
}

function ExplorerDashboardShell() {
  const { user } = useAuth();
  const stats = useDashboardStats();

  return (
    <div className="theme-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <p className="theme-label text-xs uppercase tracking-[0.24em]">
                Explorer workspace
              </p>
              <h1 className="theme-heading mt-3 text-4xl font-semibold">
                {user?.firstName ? `Welcome back, ${user.firstName}` : "Welcome back"}
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                Trips, bookings, saved places, and planning tools stay connected here.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/trip-planner"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6f4d]"
                >
                  Open planner
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/travel-guide"
                  className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  Explore destinations
                </Link>
                <Link
                  href="/community-guides"
                  className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  Ask a local
                </Link>
              </div>
            </div>
            <div className="grid gap-3 bg-black/[0.03] p-6 dark:bg-white/[0.02] md:grid-cols-2 md:p-8">
              <WorkspaceStat
                label="Saved places"
                value={stats.savedCount > 0 ? String(stats.savedCount) : "—"}
                meta="Ready to revisit"
                icon={<Heart className="h-5 w-5 text-[#ff7352]" />}
              />
              <WorkspaceStat
                label="Trip plans"
                value="—"
                meta="Active itineraries"
                icon={<MapPinned className="h-5 w-5 text-[#5aa7ff]" />}
              />
              <WorkspaceStat
                label="Bookings"
                value={stats.bookingCount > 0 ? String(stats.bookingCount) : "—"}
                meta="Current trip activity"
                icon={<ReceiptText className="h-5 w-5 text-[#8cf0a1]" />}
              />
              <WorkspaceStat
                label="Account"
                value={user?.explorerType === "local" ? "Local" : "Explorer"}
                meta="Profile status"
                icon={<Compass className="h-5 w-5 text-[#ffc247]" />}
              />
            </div>
          </div>
        </section>

        <section>
          <AppServiceStrip activeLabel="Trip Planner" />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {explorerWorkspaceCards.map((card) => {
            const Icon = card.icon;
            return (
              <DashboardCard
                key={card.title}
                title={card.title}
                body={card.body}
                href={card.href}
                label={card.label}
                icon={<Icon className={`h-5 w-5 ${card.accent}`} />}
              />
            );
          })}
        </section>

        <section className="theme-panel rounded-[32px] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="theme-heading text-2xl font-semibold">
                Continue where the trip is moving next
              </h2>
              <p className="theme-muted mt-2 text-sm leading-6">
                Use the explorer surface for planning, saved places, and confirmed travel activity.
              </p>
            </div>
            <Link
              href="/travel-guide"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-sm font-medium theme-muted transition hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
            >
              Open explorer surface
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function WorkspaceStat({
  label,
  value,
  meta,
  icon,
}: {
  label: string;
  value: string;
  meta: string;
  icon: ReactNode;
}) {
  return (
    <div className="theme-card-soft rounded-[26px] p-4">
      <div className="theme-subtle flex items-center gap-2 text-sm">
        {icon}
        {label}
      </div>
      <div className="theme-heading mt-3 text-3xl font-semibold">{value}</div>
      <div className="theme-subtle mt-1 text-xs">{meta}</div>
    </div>
  );
}

function DashboardCard({
  title,
  body,
  href,
  label,
  icon,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="theme-card rounded-[30px] p-6">
      {icon}
      <h2 className="theme-heading mt-4 text-2xl font-semibold">{title}</h2>
      <p className="theme-muted mt-3 text-sm leading-6">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-sm theme-muted transition hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
      >
        {label}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ExplorerDashboardShell />
    </ProtectedRoute>
  );
}

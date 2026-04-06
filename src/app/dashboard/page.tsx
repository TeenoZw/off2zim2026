"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Compass, MapPinned, ReceiptText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function ExplorerDashboardShell() {
  const { user } = useAuth();

  return (
    <div className="theme-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <p className="theme-label text-xs uppercase tracking-[0.24em]">
                Explorer dashboard
              </p>
              <h1 className="theme-heading mt-3 text-4xl font-semibold">
                {user?.firstName ? `Welcome back, ${user.firstName}` : "Welcome back"}
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                This dashboard is the calmer operating surface for your Off2Zim
                account. From here you can move back into discovery, planning, and
                booking without breaking the journey context.
              </p>
            </div>
            <div
              className="min-h-[220px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.48)), url('/images/eastern-highlands.jpg')",
              }}
            />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <DashboardCard
            title="Profile"
            body="Review traveler details, preferences, and account settings."
            href="/profile"
            label="Open profile"
            icon={<Compass className="h-5 w-5 text-[#ff7352]" />}
          />
          <DashboardCard
            title="Bookings"
            body="Track your current reservations and move back into checkout when needed."
            href="/checkout"
            label="View bookings"
            icon={<ReceiptText className="h-5 w-5 text-[#8cf0a1]" />}
          />
          <DashboardCard
            title="Explore"
            body="Return to destinations, stays, activities, and trip planning."
            href="/trip-planner"
            label="Continue planning"
            icon={<MapPinned className="h-5 w-5 text-[#5aa7ff]" />}
          />
        </section>
      </div>
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
        className="mt-6 inline-flex rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-sm text-slate-800 transition hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:hover:bg-white/[0.08]"
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

"use client";

import React from "react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function ProviderOverview({
  onNavigateToTab,
}: {
  onNavigateToTab?: (tabId: string) => void;
}) {
  const metrics = [
    {
      title: "Revenue",
      value: "$12,450",
      change: "+18.2%",
      tone: "text-[#8cf0a1]",
      icon: <DollarSign className="h-5 w-5 text-[#8cf0a1]" />,
      trend: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Profile views",
      value: "2,847",
      change: "+24.1%",
      tone: "text-[#8dc9ff]",
      icon: <Eye className="h-5 w-5 text-[#8dc9ff]" />,
      trend: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Booking rate",
      value: "68%",
      change: "-5.2%",
      tone: "text-[#ffca74]",
      icon: <Calendar className="h-5 w-5 text-[#ffca74]" />,
      trend: <TrendingDown className="h-4 w-4" />,
    },
    {
      title: "Response time",
      value: "2.3h",
      change: "+12 min",
      tone: "text-[#ff8a63]",
      icon: <MessageSquare className="h-5 w-5 text-[#ff8a63]" />,
      trend: <TrendingDown className="h-4 w-4" />,
    },
  ];

  const activities = [
    {
      title: "New booking confirmed",
      body: "Victoria Falls Helicopter Tour booked by Sarah Chen",
      meta: "2 hours ago",
      amount: "+$180",
      tone: "text-[#8cf0a1]",
    },
    {
      title: "New 5-star review",
      body: "Amazing experience. Highly recommend this tour.",
      meta: "4 hours ago",
      amount: "5.0",
      tone: "text-[#ffc247]",
    },
    {
      title: "Customer inquiry",
      body: "Question about group discounts for a Falls tour",
      meta: "6 hours ago",
      amount: "Inbox",
      tone: "text-[#8dc9ff]",
    },
    {
      title: "Booking cancelled",
      body: "Matobo Rock Art tour cancelled by customer",
      meta: "2 days ago",
      amount: "-$95",
      tone: "text-[#ff8a78]",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="theme-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="theme-heading text-2xl font-semibold">Performance overview</h2>
          </div>
          <select className="theme-chip rounded-full px-4 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="theme-card-soft p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]">
                  {metric.icon}
                </div>
                <div className={`inline-flex items-center gap-1 text-sm ${metric.tone}`}>
                  {metric.trend}
                  {metric.change}
                </div>
              </div>
              <div className="theme-heading mt-4 text-3xl font-semibold">{metric.value}</div>
              <div className="theme-subtle mt-1 text-sm">{metric.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="theme-panel rounded-[32px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="theme-heading text-2xl font-semibold">Revenue trends</h2>
            <div className="flex gap-2">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                Revenue
              </button>
              <button className="theme-button-secondary rounded-full px-4 py-2 text-sm">
                Bookings
              </button>
              <button className="theme-button-secondary rounded-full px-4 py-2 text-sm">
                Views
              </button>
            </div>
          </div>

          <div className="theme-card-soft mt-6 flex h-72 items-center justify-center rounded-[28px] border border-dashed">
            <div className="text-center">
              <BarChart3 className="theme-subtle mx-auto h-10 w-10" />
              <p className="theme-muted mt-3 text-sm">Analytics coming soon</p>
            </div>
          </div>
        </div>

        <div className="theme-panel rounded-[32px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="theme-heading text-2xl font-semibold">Recent activity</h2>
            <button className="theme-muted text-sm hover:text-slate-950 dark:hover:text-white">View all</button>
          </div>

          <div className="mt-6 space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="theme-card-soft p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="theme-heading font-semibold">{activity.title}</h3>
                    <p className="theme-muted mt-1 text-sm">{activity.body}</p>
                    <p className="theme-subtle mt-2 text-xs">{activity.meta}</p>
                  </div>
                  <div className={`text-sm font-semibold ${activity.tone}`}>{activity.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-panel rounded-[32px] p-6">
        <h2 className="theme-heading text-2xl font-semibold">Quick actions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => onNavigateToTab?.("listings")}
            className="theme-card-soft p-5 text-left transition hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
          >
            <div className="theme-heading text-lg font-semibold">Add new listing</div>
            <p className="theme-muted mt-2 text-sm">
              Create another bookable product inside your business profile.
            </p>
          </button>
          <button
            onClick={() => onNavigateToTab?.("profile")}
            className="theme-card-soft p-5 text-left transition hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
          >
            <div className="theme-heading text-lg font-semibold">Update profile</div>
            <p className="theme-muted mt-2 text-sm">
              Keep your public-facing business information trustworthy and current.
            </p>
          </button>
          <button
            onClick={() => onNavigateToTab?.("verification")}
            className="theme-card-soft p-5 text-left transition hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
          >
            <div className="theme-heading text-lg font-semibold">Continue verification</div>
            <p className="theme-muted mt-2 text-sm">
              Unlock more trust signals, eligibility, and better placement.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}

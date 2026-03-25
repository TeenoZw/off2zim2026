"use client";

import React from "react";
import {
  Badge,
  Bell,
  Building2,
  Calendar,
  Settings,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";

interface ProviderProfile {
  name: string;
  logo: string;
  category: string;
  location: string;
  isVerified: boolean;
  verificationLevel: "Basic" | "Verified" | "Premium";
  rating: number;
  reviewCount: number;
  joinDate: string;
}

export default function ProviderDashboardHeader() {
  const provider: ProviderProfile = {
    name: "Victoria Falls Adventure Co.",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    category: "Adventure Activities",
    location: "Victoria Falls, Zimbabwe",
    isVerified: true,
    verificationLevel: "Verified",
    rating: 4.8,
    reviewCount: 127,
    joinDate: "March 2023",
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "Premium":
        return {
          icon: <Shield className="h-4 w-4" />,
          className: "bg-[#241733] text-[#d0adff]",
          text: "Premium Verified",
        };
      case "Verified":
        return {
          icon: <Badge className="h-4 w-4" />,
          className: "bg-[#13283a] text-[#8dc9ff]",
          text: "Verified",
        };
      default:
        return {
          icon: <Building2 className="h-4 w-4" />,
          className: "bg-black/[0.05] text-slate-700 dark:bg-white/10 dark:text-white/70",
          text: "Basic",
        };
    }
  };

  const badge = getVerificationBadge(provider.verificationLevel);

  return (
    <section className="border-b border-black/10 bg-transparent dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="theme-panel overflow-hidden rounded-[36px]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="h-20 w-20 rounded-[24px] border border-black/10 object-cover dark:border-white/10"
                    />
                    {provider.isVerified && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-[#13283a] p-1.5">
                        <Badge className="h-3 w-3 text-[#8dc9ff]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="theme-heading text-3xl font-semibold">{provider.name}</h1>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                      >
                        {badge.icon}
                        {badge.text}
                      </span>
                    </div>
                    <div className="theme-muted mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span>{provider.category}</span>
                      <span>{provider.location}</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                        {provider.rating} ({provider.reviewCount} reviews)
                      </span>
                      <span>Member since {provider.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="theme-button-secondary relative rounded-full p-3">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#ff5630]" />
                  </button>
                  <button className="theme-button-secondary rounded-full px-4 py-3 text-sm font-medium">
                    <Settings className="mr-2 inline h-4 w-4" />
                    Settings
                  </button>
                  <button className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
                    View public profile
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 bg-black/[0.03] p-6 dark:bg-white/[0.02] md:grid-cols-2 md:p-8">
              <StatCard
                icon={<TrendingUp className="h-5 w-5 text-[#7ddf8c]" />}
                label="This month"
                value="$4,250"
                meta="+12% from last month"
              />
              <StatCard
                icon={<Calendar className="h-5 w-5 text-[#5aa7ff]" />}
                label="Bookings"
                value="23"
                meta="8 pending confirmation"
              />
              <StatCard
                icon={<Star className="h-5 w-5 text-[#ffc247]" />}
                label="Recent rating"
                value="4.9"
                meta="From last 10 reviews"
              />
              <StatCard
                icon={<Building2 className="h-5 w-5 text-[#ff8a63]" />}
                label="Active listings"
                value="12"
                meta="3 awaiting approval"
              />
            </div>
          </div>

          <div className="border-t border-black/10 px-6 py-5 dark:border-white/10 md:px-8">
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#16361e] px-4 py-2 text-sm font-medium text-[#8cf0a1]">
                + Add new listing
              </button>
              <button className="rounded-full bg-[#13283a] px-4 py-2 text-sm font-medium text-[#8dc9ff]">
                Manage calendar
              </button>
              <button className="rounded-full bg-[#2d1714] px-4 py-2 text-sm font-medium text-[#ff8a63]">
                Update company profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
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

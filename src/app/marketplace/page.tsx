"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Filter,
  Grid,
  List,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import type { PublicListingRecord } from "@/types/platform";

function MarketplacePageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || "all"
  );
  const [listingType] = useState(searchParams?.get("listingType") || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<PublicListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        const payload = await apiFetch<{ listings: PublicListingRecord[] }>(
          `/api/listings?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}&listingType=${encodeURIComponent(listingType)}`
        );
        setListings(payload.listings);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load public listings.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadListings, 200);
    return () => window.clearTimeout(timeout);
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of listings) {
      counts.set(listing.category, (counts.get(listing.category) || 0) + 1);
    }

    return [
      { id: "all", label: "All Listings", count: listings.length },
      ...Array.from(counts.entries()).map(([category, count]) => ({
        id: category,
        label: category,
        count,
      })),
    ];
  }, [listings]);

  return (
    <div className="theme-page min-h-screen">
      <div className="border-b border-black/10 bg-white/88 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/94">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 dark:border-white/10 dark:bg-[#151515] dark:text-white/72 dark:hover:bg-[#1b1b1b] dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold theme-heading">Marketplace</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                Shop trusted stays, experiences, services, and travel essentials.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-white/35" />
              <input
                type="text"
                placeholder="Search listings, locations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white pl-10 pr-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-[#ff5630] focus:outline-none focus:ring-2 focus:ring-[#ff5630]/20 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:placeholder:text-white/28"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:hover:bg-[#1c1c1c]"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>

              <div className="flex rounded-2xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#151515]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-xl p-2 transition ${
                    viewMode === "grid"
                      ? "bg-[#ff5630]/12 text-[#ff5630] dark:bg-[#ff5630]/18"
                      : "text-slate-500 hover:bg-slate-100 dark:text-white/55 dark:hover:bg-white/7"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-xl p-2 transition ${
                    viewMode === "list"
                      ? "bg-[#ff5630]/12 text-[#ff5630] dark:bg-[#ff5630]/18"
                      : "text-slate-500 hover:bg-slate-100 dark:text-white/55 dark:hover:bg-white/7"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <aside className="lg:w-80 space-y-6">
              <div className="theme-panel-strong rounded-[28px] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
                <h3 className="mb-4 font-semibold theme-heading">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                        selectedCategory === category.id
                          ? "bg-[#ff5630]/10 text-[#ff5630] dark:bg-[#ff5630]/16"
                          : "text-slate-700 hover:bg-black/[0.045] dark:text-white/78 dark:hover:bg-white/7"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-sm opacity-70">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <main className="flex-1">
            {error ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="theme-panel-strong rounded-[28px] p-8 text-slate-500 dark:text-white/58">
                Loading listings...
              </div>
            ) : listings.length === 0 ? (
              <div className="theme-panel-strong rounded-[28px] p-8 text-slate-500 dark:text-white/58">
                No listings found.
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/marketplace/${listing.slug}`}
                    className={`theme-panel-strong overflow-hidden rounded-[28px] shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_26px_90px_rgba(0,0,0,0.34)] ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                  >
                    <div className={`bg-gradient-to-br from-[#ffd4c8] via-[#fff0ea] to-[#dce8ff] dark:from-[#3d251f] dark:via-[#231c1b] dark:to-[#172233] ${viewMode === "list" ? "md:w-72" : "h-48"} flex items-center justify-center`}>
                      <span className="text-sm font-medium text-slate-700 dark:text-white/72">
                        {listing.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold theme-heading">
                            {listing.title}
                          </h2>
                          <p className="mt-2 text-sm text-slate-600 dark:text-white/62">
                            {listing.shortDescription || listing.description}
                          </p>
                        </div>
                        {listing.provider.hasVerifiedBadge ? (
                          <ShieldCheck className="h-5 w-5 text-[#ff5630] shrink-0" />
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-white/52">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {listing.location}
                        </span>
                        <span>{listing.provider.companyName}</span>
                        <span>
                          {listing.basePrice ? `$${listing.basePrice}` : "Quote"}
                        </span>
                        <span>{listing.bookingMode === "instant" ? "Instant booking" : "Booking request"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8 text-gray-500">
          Loading...
        </div>
      }
    >
      <MarketplacePageContent />
    </Suspense>
  );
}

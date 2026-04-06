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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Off2Zim Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Discover live provider listings published from the new supplier backend
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings, locations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-sm">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <main className="flex-1">
            {error ? (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-gray-500">
                Loading live provider listings...
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-gray-500">
                No public listings match this search yet.
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
                    className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                  >
                    <div className={`bg-gradient-to-br from-orange-200 via-orange-100 to-blue-100 ${viewMode === "list" ? "md:w-72" : "h-48"} flex items-center justify-center`}>
                      <span className="text-sm font-medium text-slate-700">
                        {listing.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {listing.title}
                          </h2>
                          <p className="mt-2 text-sm text-gray-600">
                            {listing.shortDescription || listing.description}
                          </p>
                        </div>
                        {listing.provider.hasVerifiedBadge ? (
                          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
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
          Loading marketplace...
        </div>
      }
    >
      <MarketplacePageContent />
    </Suspense>
  );
}

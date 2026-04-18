"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client-api";
import type { AdminListingRecord } from "@/types/platform";

const categoryOptions = [
  "Accommodation",
  "Experience",
  "Shopping Product",
  "Transport",
  "Dining",
];

export default function AdminListingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminListingsContent />
    </ProtectedRoute>
  );
}

function AdminListingsContent() {
  const [listings, setListings] = useState<AdminListingRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        const payload = await apiFetch<{ listings: AdminListingRecord[] }>(
          "/api/admin/listings"
        );
        setListings(payload.listings);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listings.");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const normalized = query.toLowerCase();
    return listings.filter((listing) =>
      [
        listing.title,
        listing.slug,
        listing.category,
        listing.location,
        listing.provider.companyName,
        listing.provider.onboardingStatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [listings, query]);

  const statusCounts = useMemo(
    () => ({
      active: listings.filter((listing) => listing.status === "active").length,
      pending: listings.filter((listing) => listing.status === "pending_review").length,
      archived: listings.filter((listing) => listing.status === "archived").length,
    }),
    [listings]
  );

  const updateListing = async (
    listingId: string,
    patch: Partial<Pick<AdminListingRecord, "status" | "visibility" | "category">>
  ) => {
    setUpdatingId(listingId);
    try {
      const payload = await apiFetch<{ listing: AdminListingRecord }>(
        `/api/admin/listings/${listingId}`,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        }
      );
      setListings((current) =>
        current.map((item) => (item.id === payload.listing.id ? payload.listing : item))
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update listing.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <AdminShell
      activePath="/admin/listings"
      title="Platform listings"
      description="Review provider inventory, correct category placement, and control listing visibility across the marketplace."
    >

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Active listings</div>
            <div className="mt-2 text-3xl font-semibold">{statusCounts.active}</div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Pending review</div>
            <div className="mt-2 text-3xl font-semibold">{statusCounts.pending}</div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Archived</div>
            <div className="mt-2 text-3xl font-semibold">{statusCounts.archived}</div>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/10 bg-[#111111] p-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search listings, providers, status, or category"
            className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-white/35"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              Loading platform listings...
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              No listings match the current search.
            </div>
          ) : (
            filteredListings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-[28px] border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">{listing.title}</h2>
                      <span className="rounded-full bg-[#13283a] px-3 py-1 text-xs font-medium text-[#8dc9ff]">
                        {listing.status}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                        {listing.visibility}
                      </span>
                      {listing.disputesCount > 0 ? (
                        <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                          {listing.disputesCount} dispute
                          {listing.disputesCount > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 text-sm text-white/55">
                      {listing.provider.companyName} • {listing.location} • {listing.slug}
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-white/55 md:grid-cols-5">
                      <div>
                        <div className="text-white/35">Category</div>
                        <div>{listing.category}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Listing type</div>
                        <div>{listing.listingType}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Bookings</div>
                        <div>{listing.bookingsCount}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Availability slots</div>
                        <div>{listing.availabilityCount}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Provider tier</div>
                        <div>
                          {listing.provider.verificationTier} /{" "}
                          {listing.provider.onboardingStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
                    <select
                      value={listing.status}
                      disabled={updatingId === listing.id}
                      onChange={(event) =>
                        updateListing(listing.id, {
                          status: event.target.value as AdminListingRecord["status"],
                        })
                      }
                      className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending review</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="archived">Archived</option>
                    </select>
                    <select
                      value={listing.visibility}
                      disabled={updatingId === listing.id}
                      onChange={(event) =>
                        updateListing(listing.id, {
                          visibility: event.target.value as AdminListingRecord["visibility"],
                        })
                      }
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                    <select
                      value={listing.category}
                      disabled={updatingId === listing.id}
                      onChange={(event) =>
                        updateListing(listing.id, {
                          category: event.target.value,
                        })
                      }
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
    </AdminShell>
  );
}

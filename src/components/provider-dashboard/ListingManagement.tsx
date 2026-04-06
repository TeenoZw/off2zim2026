"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { ProviderListingRecord } from "@/types/platform";

const initialForm = {
  title: "",
  category: "Experience",
  listingType: "experience",
  description: "",
  shortDescription: "",
  location: "",
  pricingModel: "per_service",
  basePrice: "",
  currency: "USD",
  bookingMode: "request",
  visibility: "private" as "private" | "public",
  status: "draft" as ProviderListingRecord["status"],
};

export default function ListingManagement() {
  const [listings, setListings] = useState<ProviderListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadListings = async () => {
    try {
      const payload = await apiFetch<{ listings: ProviderListingRecord[] }>(
        "/api/provider/listings"
      );
      setListings(payload.listings);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return listings.filter((listing) =>
      [listing.title, listing.category, listing.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [listings, query]);

  const handleCreateListing = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = await apiFetch<{ listing: ProviderListingRecord }>(
        "/api/provider/listings",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            basePrice: form.basePrice ? Number(form.basePrice) : null,
            instantBooking: form.bookingMode === "instant",
            amenities: [],
            tags: [],
            policies: {},
            metadata: {},
            availability: [],
          }),
        }
      );

      setListings((current) => [payload.listing, ...current]);
      setForm(initialForm);
      setShowComposer(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create listing.");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (listing: ProviderListingRecord) => {
    try {
      const payload = await apiFetch<{ listing: ProviderListingRecord }>(
        `/api/provider/listings/${listing.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            visibility: listing.visibility === "public" ? "private" : "public",
          }),
        }
      );

      setListings((current) =>
        current.map((item) => (item.id === payload.listing.id ? payload.listing : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update listing.");
    }
  };

  const toggleStatus = async (listing: ProviderListingRecord) => {
    try {
      const payload = await apiFetch<{ listing: ProviderListingRecord }>(
        `/api/provider/listings/${listing.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: listing.status === "active" ? "paused" : "active",
            visibility: listing.status === "active" ? listing.visibility : "public",
          }),
        }
      );

      setListings((current) =>
        current.map((item) => (item.id === payload.listing.id ? payload.listing : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update listing.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="theme-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="theme-heading text-2xl font-semibold">Listing management</h2>
            <p className="theme-muted mt-2 text-sm">
              Providers can create and control multiple PRD-aligned listings from one
              company profile.
            </p>
          </div>
          <button
            onClick={() => setShowComposer((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            {showComposer ? "Close composer" : "Add new listing"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_auto]">
          <div className="relative">
            <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search listings"
              className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="theme-card-soft rounded-2xl px-5 py-3 text-sm">
            {filteredListings.length} listing{filteredListings.length === 1 ? "" : "s"}
          </div>
        </div>

        {showComposer ? (
          <form
            onSubmit={handleCreateListing}
            className="mt-6 grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2"
          >
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
              placeholder="Listing title"
              required
            />
            <input
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
              placeholder="Location"
              required
            />
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
            >
              <option>Accommodation</option>
              <option>Experience</option>
              <option>Shopping Product</option>
              <option>Transport</option>
              <option>Dining</option>
            </select>
            <select
              value={form.bookingMode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bookingMode: event.target.value,
                  status: event.target.value === "instant" ? "active" : current.status,
                }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
            >
              <option value="request">Booking request</option>
              <option value="instant">Instant booking</option>
            </select>
            <input
              value={form.basePrice}
              onChange={(event) =>
                setForm((current) => ({ ...current, basePrice: event.target.value }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
              placeholder="Base price"
            />
            <select
              value={form.visibility}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  visibility: event.target.value as "private" | "public",
                }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <input
              value={form.shortDescription}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  shortDescription: event.target.value,
                }))
              }
              className="theme-input rounded-2xl px-4 py-3 text-sm md:col-span-2"
              placeholder="Short description"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="theme-input min-h-32 rounded-2xl px-4 py-3 text-sm md:col-span-2"
              placeholder="Describe the service, what is included, and what travelers should expect."
              required
            />
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create listing"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setShowComposer(false);
                }}
                className="theme-button-secondary rounded-full px-5 py-3 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {error ? <p className="mt-4 text-sm text-[#ff8a63]">{error}</p> : null}
      </section>

      {loading ? (
        <section className="theme-panel rounded-[32px] p-6 text-sm">
          Loading provider listings...
        </section>
      ) : (
        <section className="grid gap-5">
          {filteredListings.map((listing) => (
            <article key={listing.id} className="theme-panel rounded-[32px] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="theme-heading text-2xl font-semibold">{listing.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        listing.status === "active"
                          ? "bg-[#153220] text-[#8cf0a1]"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {listing.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="theme-muted mt-3 flex flex-wrap gap-3 text-sm">
                    <span>{listing.category}</span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#ff7352]" />
                      {listing.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                      {listing.bookingMode === "instant" ? "Instant booking" : "Booking request"}
                    </span>
                    <span>{listing.bookingsCount || 0} bookings</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <div className="theme-heading text-2xl font-semibold">
                      {listing.basePrice ? `$${listing.basePrice}` : "Quote"}
                    </div>
                    <div className="theme-subtle text-sm">{listing.visibility}</div>
                  </div>
                  <button
                    onClick={() => toggleVisibility(listing)}
                    className="theme-button-secondary rounded-full p-3"
                  >
                    {listing.visibility === "public" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleStatus(listing)}
                    className="theme-button-secondary rounded-full px-4 py-3 text-sm font-medium"
                  >
                    {listing.status === "active" ? "Pause" : "Publish"}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                  {listing.shortDescription || "Add a concise storefront summary for this listing."}
                </div>
                <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                  {listing.visibility === "public"
                    ? "Publicly discoverable on the marketplace."
                    : "Private until the provider chooses to publish it."}
                </div>
                <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                  {listing.bookingMode === "instant"
                    ? "Configured for instant confirmation."
                    : "Configured for booking requests and supplier review."}
                </div>
              </div>
            </article>
          ))}

          {!loading && filteredListings.length === 0 ? (
            <article className="theme-panel rounded-[32px] p-6 text-sm">
              No listings match the current search yet.
            </article>
          ) : null}
        </section>
      )}

      <section className="theme-panel rounded-[32px] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#153220] p-3">
            <CheckCircle className="h-5 w-5 text-[#8cf0a1]" />
          </div>
          <div>
            <h3 className="theme-heading text-lg font-semibold">One business, many services</h3>
            <p className="theme-muted mt-2 text-sm leading-6">
              The provider workspace now stores listings in the backend against the
              core company profile, which matches the PRD’s operating model.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

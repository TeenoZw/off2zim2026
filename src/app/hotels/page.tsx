"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { PublicListingRecord } from "@/types/platform";

export default function HotelsPage() {
  const [listings, setListings] = useState<PublicListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        const payload = await apiFetch<{ listings: PublicListingRecord[] }>(
          "/api/listings?category=Accommodation"
        );
        setListings(payload.listings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load accommodation listings.");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/accommodation"
          className="theme-muted inline-flex items-center gap-2 text-sm transition hover:text-slate-950 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to accommodation
        </Link>

        <div className="theme-panel-strong mt-5 overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Hotels
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Stays that give the route a reliable base
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                This route keeps hotel discovery in the same Off2Zim language as the
                planner and marketplace, so travelers can compare trusted options and
                move into booking or planning without a visual reset.
              </p>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('/images/palm-river-hotel-604329-original.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {error ? (
          <div className="theme-panel rounded-[28px] p-6 text-sm text-rose-500">{error}</div>
        ) : loading ? (
          <div className="theme-panel rounded-[28px] p-8 text-center">
            <p className="theme-muted text-sm">Loading accommodation listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="theme-panel rounded-[28px] p-8 text-center">
            <p className="theme-muted text-sm">No hotel listings are published yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/marketplace/${listing.slug}`} className="theme-card overflow-hidden">
                <div
                  className="min-h-[220px] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.42)), url('${listing.images[0] || "/images/palm-river-hotel-604329-original.jpg"}')`,
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="theme-label text-xs uppercase tracking-[0.24em]">
                        {listing.category}
                      </div>
                      <h2 className="theme-heading mt-2 text-xl font-semibold">{listing.title}</h2>
                    </div>
                    {listing.provider.hasVerifiedBadge ? (
                      <ShieldCheck className="h-5 w-5 shrink-0 text-[#8cf0a1]" />
                    ) : null}
                  </div>
                  <p className="theme-muted mt-3 text-sm leading-6">
                    {listing.shortDescription || listing.description}
                  </p>
                  <div className="theme-muted mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#ff7352]" />
                      {listing.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#ffca74]" />
                      {listing.basePrice ? `$${listing.basePrice}` : "Quote"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

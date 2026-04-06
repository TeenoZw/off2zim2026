"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, MapPin, Search, Star, Users } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { PublicListingRecord } from "@/types/platform";
import { publicListingToPlannerCatalogItem } from "@/lib/public-listing-adapter";

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PublicListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const payload = await apiFetch<{ listings: PublicListingRecord[] }>(
          `/api/listings?listingType=experience&search=${encodeURIComponent(searchTerm)}`
        );
        setResults(payload.listings);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load activities.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadActivities, 200);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const activities = useMemo(
    () => results.map(publicListingToPlannerCatalogItem),
    [results]
  );

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1fr_1fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Things to do
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Book provider-led Zimbabwe experiences from the live catalog
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                This page now reflects the provider platform directly, so activity
                listings published in the dashboard appear here for customers to discover.
              </p>
            </div>
            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/rafting.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[32px] p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_auto]">
            <div className="relative">
              <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search live experiences"
                className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
            <Link
              href="/marketplace?listingType=experience"
              className="theme-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm"
            >
              Open full marketplace
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="theme-panel rounded-[36px] p-12 text-center">
            <p className="theme-muted text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="theme-panel rounded-[36px] p-12 text-center">
            <p className="theme-muted text-sm">Loading live experiences...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="theme-panel rounded-[36px] p-12 text-center">
            <p className="theme-muted text-sm">No public experiences match this search yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <article key={activity.id} className="theme-card overflow-hidden">
                <div
                  className="relative h-56 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.42)), url('${activity.image}')`,
                  }}
                />

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="theme-label text-sm">{activity.category}</p>
                    <div className="inline-flex items-center gap-1 text-sm text-[#ffc247]">
                      <Star className="h-4 w-4" />
                      <span className="theme-heading">{activity.rating}</span>
                    </div>
                  </div>

                  <h3 className="theme-heading mt-2 text-2xl font-semibold">{activity.name}</h3>
                  <div className="theme-muted mt-3 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#ff7352]" />
                    {activity.location}
                  </div>

                  <div className="theme-muted mt-3 flex flex-wrap gap-4 text-sm">
                    {activity.duration ? (
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#5aa7ff]" />
                        {activity.duration}
                      </span>
                    ) : null}
                    {activity.maxGuests ? (
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#7ddf8c]" />
                        Up to {activity.maxGuests}
                      </span>
                    ) : null}
                  </div>

                  <p className="theme-muted mt-4 text-sm leading-6">{activity.description}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="theme-heading text-2xl font-bold">{activity.price}</span>
                      <span className="theme-subtle ml-1 text-sm">{activity.priceUnit}</span>
                    </div>
                    <Link
                      href={`/marketplace/${activity.id}`}
                      className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-semibold text-white"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

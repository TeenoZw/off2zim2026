"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight, Clock3, MapPin, Search, Star, Users, Zap } from "lucide-react";
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
                Browse live experiences, compare options, and add the right moments to your trip.
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

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Things To Do" />
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
            <p className="theme-muted text-sm">Loading experiences...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="theme-panel rounded-[36px] p-12 text-center">
            <p className="theme-muted text-sm">No experiences found.</p>
          </div>
        ) : (
          <>
            <SectionHeader
              eyebrow="Live catalog"
              title="Provider-led experiences worth adding to the route"
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <article key={activity.id} className="theme-card flex flex-col overflow-hidden">
                {/* Linked image → detail page */}
                <Link href={`/marketplace/${activity.id}`} className="block">
                  <div
                    className="relative h-56 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.42)), url('${activity.image}')`,
                    }}
                  />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  {/* Linked content → detail page */}
                  <Link href={`/marketplace/${activity.id}`} className="block flex-1">
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

                    <p className="theme-muted mt-4 text-sm leading-6 line-clamp-3">{activity.description}</p>
                  </Link>

                  {/* Price + CTA row */}
                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="theme-heading text-2xl font-bold">{activity.price}</span>
                        <span className="theme-subtle ml-1 text-sm">{activity.priceUnit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/marketplace/${activity.id}`}
                        className="theme-button-secondary flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        See details
                      </Link>
                      <Link
                        href={`/marketplace/${activity.id}#booking`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#ff5630] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#ff7352]"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

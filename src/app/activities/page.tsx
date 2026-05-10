"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import { apiFetch } from "@/lib/client-api";
import {
  getDestinationById,
  type ExplorerDestinationSummary,
} from "@/lib/destination-explorer";
import type { PublicListingRecord } from "@/types/platform";
import { ArrowRight, Clock3, MapPin, Search, Star, Users, Zap } from "lucide-react";

interface DestinationContextResponse {
  destination: ExplorerDestinationSummary;
  scoped: {
    activities: PublicListingRecord[];
  };
}

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams?.get("destination");
  const [destinations, setDestinations] = useState<ExplorerDestinationSummary[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<ExplorerDestinationSummary | null>(null);
  const [results, setResults] = useState<PublicListingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ destinations: ExplorerDestinationSummary[] }>("/api/destinations")
      .then((payload) => {
        setDestinations(payload.destinations);
        setSelectedDestination(getDestinationById(payload.destinations, destinationId));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load destinations."));
  }, [destinationId]);

  useEffect(() => {
    if (!destinationId) {
      setLoading(false);
      setResults([]);
      return;
    }

    setLoading(true);
    apiFetch<DestinationContextResponse>(`/api/destinations/${destinationId}/context`)
      .then((payload) => {
        setSelectedDestination(payload.destination);
        setResults(payload.scoped.activities);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load experiences."))
      .finally(() => setLoading(false));
  }, [destinationId]);

  const filteredActivities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return results;
    }

    return results.filter((activity) =>
      [activity.title, activity.description, activity.shortDescription, activity.location, activity.category]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [results, searchTerm]);

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
                Find things to do after you choose your destination
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                Activities are tied to the place you plan to visit. Choose a destination first, then compare the tours, experiences, and local options available there.
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
        <AppServiceStrip
          activeLabel="Things To Do"
          destinationId={selectedDestination?.id ?? destinationId}
          destinationName={selectedDestination?.name}
        />
      </section>

      {!destinationId ? (
        <DestinationChooser
          destinations={destinations}
          title="Choose a destination to view its activities"
          description="Things to do are organized by destination so you can see the right experiences in the right place."
        />
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="theme-panel rounded-[32px] p-4 md:p-5">
              <div className="grid gap-3 lg:grid-cols-[1.2fr_auto]">
                <div className="relative">
                  <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={`Search experiences in ${selectedDestination?.name || "this destination"}`}
                    className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>
                <Link
                  href={`/travel-guide/${selectedDestination?.id || destinationId}`}
                  className="theme-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm"
                >
                  Back to destination hub
                </Link>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {error ? (
              <ErrorState message={error} />
            ) : loading ? (
              <LoadingGrid />
            ) : filteredActivities.length === 0 ? (
              <EmptyState
                title={`No experiences linked to ${selectedDestination?.name || "this destination"} yet`}
                body="Activities for this destination will appear here automatically as more providers add them."
              />
            ) : (
              <>
                <SectionHeader
                  eyebrow={selectedDestination?.name || "Destination-selected"}
                  title={`Things to do in ${selectedDestination?.name || "this destination"}`}
                />
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredActivities.map((activity) => (
                    <article key={activity.id} className="theme-card flex flex-col overflow-hidden">
                      <Link href={`/marketplace/${activity.slug}`} className="block">
                        <div
                          className="relative h-56 bg-cover bg-center"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.42)), url('${activity.images[0] || "/images/background.png"}')`,
                          }}
                        />
                      </Link>

                      <div className="flex flex-1 flex-col p-6">
                        <Link href={`/marketplace/${activity.slug}`} className="block flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="theme-label text-sm">{activity.category}</p>
                            <div className="inline-flex items-center gap-1 text-sm text-[#ffc247]">
                              <Star className="h-4 w-4" />
                              <span className="theme-heading">
                                {activity.provider.hasVerifiedBadge ? "4.8" : "4.5"}
                              </span>
                            </div>
                          </div>

                          <h3 className="theme-heading mt-2 text-2xl font-semibold">{activity.title}</h3>
                          <div className="theme-muted mt-3 flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-[#ff7352]" />
                            {activity.location}
                          </div>

                          <div className="theme-muted mt-3 flex flex-wrap gap-4 text-sm">
                            {typeof activity.metadata.duration === "string" ? (
                              <span className="inline-flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-[#5aa7ff]" />
                                {activity.metadata.duration}
                              </span>
                            ) : null}
                            {activity.capacity ? (
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#7ddf8c]" />
                                Up to {activity.capacity}
                              </span>
                            ) : null}
                          </div>

                          <p className="theme-muted mt-4 text-sm leading-6 line-clamp-3">
                            {activity.shortDescription || activity.description}
                          </p>
                        </Link>

                        <div className="mt-5 border-t border-white/[0.06] pt-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <span className="theme-heading text-2xl font-bold">
                                {activity.basePrice ? `$${activity.basePrice}` : "Quote"}
                              </span>
                              <span className="theme-subtle ml-1 text-sm">
                                {activity.pricingModel === "per_person" ? "per person" : "per service"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/marketplace/${activity.slug}`}
                              className="theme-button-secondary flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                              See details
                            </Link>
                            <Link
                              href={`/marketplace/${activity.slug}#booking`}
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
        </>
      )}
    </div>
  );
}

function DestinationChooser({
  destinations,
  title,
  description,
}: {
  destinations: ExplorerDestinationSummary[];
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="theme-panel rounded-[32px] p-8">
        <h2 className="theme-heading text-2xl font-semibold">{title}</h2>
        <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">{description}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/activities?destination=${encodeURIComponent(destination.id)}`}
              className="theme-panel-soft rounded-[22px] p-4 transition hover:-translate-y-0.5"
            >
              <div className="theme-heading text-lg font-semibold">{destination.name}</div>
              <div className="theme-muted mt-2 text-sm">
                {destination.activities_count || 0} activities available
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="theme-panel rounded-[28px] overflow-hidden animate-pulse">
          <div className="h-56 bg-white/[0.06]" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
            <div className="h-5 w-3/4 rounded-full bg-white/[0.08]" />
            <div className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="theme-panel rounded-[36px] p-12 text-center space-y-4">
      <p className="theme-heading text-lg font-semibold">Could not load experiences</p>
      <p className="theme-muted text-sm max-w-sm mx-auto">{message}</p>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="theme-panel rounded-[36px] p-12 text-center space-y-4">
      <p className="theme-heading text-lg font-semibold">{title}</p>
      <p className="theme-muted text-sm max-w-sm mx-auto">{body}</p>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceSubtypeChips from "@/components/ui/ServiceSubtypeChips";
import { apiFetch } from "@/lib/client-api";
import {
  getDestinationById,
  type ExplorerDestinationSummary,
} from "@/lib/destination-explorer";
import { getSubtypesForGroup, normalizeTaxonomyValue } from "@/lib/taxonomy";
import { BedDouble, MapPin, Search, Star } from "lucide-react";

interface DestinationContextResponse {
  destination: ExplorerDestinationSummary;
  scoped: {
    stays: Array<{
      id: string;
      name: string;
      description?: string | null;
      image_url?: string | null;
      rating?: number | null;
      price?: number | null;
      full_location?: string | null;
      location?: string | null;
      amenities?: string[];
    }>;
  };
}

export default function AccommodationPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams?.get("destination");
  const [destinations, setDestinations] = useState<ExplorerDestinationSummary[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<ExplorerDestinationSummary | null>(null);
  const [stays, setStays] = useState<DestinationContextResponse["scoped"]["stays"]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubtype, setActiveSubtype] = useState(searchParams?.get("subtype") || "all");
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
      setStays([]);
      return;
    }

    setLoading(true);
    apiFetch<DestinationContextResponse>(`/api/destinations/${destinationId}/context`)
      .then((payload) => {
        setSelectedDestination(payload.destination);
        setStays(payload.scoped.stays);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load stays."))
      .finally(() => setLoading(false));
  }, [destinationId]);

  const filteredStays = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return stays.filter((stay) =>
      (activeSubtype === "all" ||
        [stay.name, stay.description, stay.location, stay.full_location, ...(stay.amenities || [])]
          .map((value) => normalizeTaxonomyValue(value))
          .some((value) => value.includes(activeSubtype))) &&
      (!query ||
        [stay.name, stay.description, stay.location, stay.full_location, ...(stay.amenities || [])]
          .join(" ")
          .toLowerCase()
          .includes(query))
    );
  }, [activeSubtype, searchTerm, stays]);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Stays
              </div>
              <h1 className="theme-heading mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                Find stays inside the destination you choose
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                Choose where you want to go first, then browse the lodges, camps, hotels, and other stays available there.
              </p>
            </div>

            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/palm-river-hotel-604329-original.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip
          activeLabel="Stays"
          destinationId={selectedDestination?.id ?? destinationId}
          destinationName={selectedDestination?.name}
        />
      </section>

      {!destinationId ? (
        <DestinationChooser
          destinations={destinations}
          title="Choose a destination to view its stays"
          description="Accommodation is organized by destination so you can browse stays in the place you plan to visit."
          hrefBase="/accommodation"
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
                    placeholder={`Search stays in ${selectedDestination?.name || "this destination"}`}
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
              <ServiceSubtypeChips
                subtypes={getSubtypesForGroup("stays")}
                activeSubtype={activeSubtype}
                onSelect={setActiveSubtype}
                allLabel="All stays"
                className="mt-4"
              />
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {error ? (
              <PanelState title="Could not load stays" body={error} />
            ) : loading ? (
              <LoadingGrid />
            ) : filteredStays.length === 0 ? (
              <PanelState
                title={`No stays linked to ${selectedDestination?.name || "this destination"} yet`}
                body="Stays for this destination will appear here automatically as more listings are added."
              />
            ) : (
              <>
                <SectionHeader
                  eyebrow={selectedDestination?.name || "Destination-selected"}
                  title={`Stays in ${selectedDestination?.name || "this destination"}`}
                />
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredStays.map((stay) => (
                    <article key={stay.id} className="theme-card overflow-hidden">
                      <div
                        className="h-56 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48)), url('${stay.image_url || "/images/background.png"}')`,
                        }}
                      />
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="theme-heading text-xl font-semibold">{stay.name}</h2>
                          {stay.rating ? (
                            <div className="inline-flex items-center gap-1 text-sm text-[#ffc247]">
                              <Star className="h-4 w-4" />
                              <span className="theme-heading">{stay.rating}</span>
                            </div>
                          ) : null}
                        </div>
                        <div className="theme-muted mt-3 flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#ff7352]" />
                          {stay.full_location || stay.location || selectedDestination?.name}
                        </div>
                        {stay.description ? (
                          <p className="theme-muted mt-4 text-sm leading-6 line-clamp-3">{stay.description}</p>
                        ) : null}
                        {stay.amenities?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {stay.amenities.slice(0, 4).map((amenity) => (
                              <span
                                key={amenity}
                                className="rounded-full border border-black/10 px-3 py-1 text-xs theme-muted dark:border-white/10"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        ) : null}
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
  hrefBase,
}: {
  destinations: ExplorerDestinationSummary[];
  title: string;
  description: string;
  hrefBase: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="theme-panel rounded-[32px] p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.08]">
          <BedDouble className="h-5 w-5 text-[#ff5630]" />
        </div>
        <h2 className="theme-heading mt-4 text-2xl font-semibold">{title}</h2>
        <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">{description}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`${hrefBase}?destination=${encodeURIComponent(destination.id)}`}
              className="theme-panel-soft rounded-[22px] p-4 transition hover:-translate-y-0.5"
            >
              <div className="theme-heading text-lg font-semibold">{destination.name}</div>
              <div className="theme-muted mt-2 text-sm">
                {destination.stays_count || 0} stays available
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
            <div className="h-4 w-2/3 rounded-full bg-white/[0.08]" />
            <div className="h-3 w-full rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelState({ title, body }: { title: string; body: string }) {
  return (
    <div className="theme-panel rounded-[36px] p-12 text-center space-y-4">
      <p className="theme-heading text-lg font-semibold">{title}</p>
      <p className="theme-muted text-sm max-w-sm mx-auto">{body}</p>
    </div>
  );
}

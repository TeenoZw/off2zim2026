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
import { MapPin, Search, Star, UtensilsCrossed } from "lucide-react";

interface DestinationContextResponse {
  destination: ExplorerDestinationSummary;
  scoped: {
    restaurants: Array<{
      id: string;
      name: string;
      description?: string | null;
      cuisine: string;
      location: string;
      priceRange: string;
      rating?: number | null;
      images: string[];
    }>;
  };
}

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams?.get("destination");
  const [destinations, setDestinations] = useState<ExplorerDestinationSummary[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<ExplorerDestinationSummary | null>(null);
  const [restaurants, setRestaurants] = useState<DestinationContextResponse["scoped"]["restaurants"]>([]);
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
      setRestaurants([]);
      return;
    }

    setLoading(true);
    apiFetch<DestinationContextResponse>(`/api/destinations/${destinationId}/context`)
      .then((payload) => {
        setSelectedDestination(payload.destination);
        setRestaurants(payload.scoped.restaurants);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load restaurants."))
      .finally(() => setLoading(false));
  }, [destinationId]);

  const filteredRestaurants = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return restaurants;

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.description, restaurant.cuisine, restaurant.location, restaurant.priceRange]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [restaurants, searchTerm]);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Dining
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Find restaurants inside the destination you chose
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Choose your destination first, then browse the restaurants and dining options that fit that stop on your trip.
              </p>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{
                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip
          activeLabel="Restaurants"
          destinationId={selectedDestination?.id ?? destinationId}
          destinationName={selectedDestination?.name}
        />
      </section>

      {!destinationId ? (
        <DestinationChooser destinations={destinations} />
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
                    placeholder={`Search dining in ${selectedDestination?.name || "this destination"}`}
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

          <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            {error ? (
              <PanelState title="Could not load restaurants" body={error} />
            ) : loading ? (
              <LoadingGrid />
            ) : filteredRestaurants.length === 0 ? (
              <PanelState
                title={`No restaurants linked to ${selectedDestination?.name || "this destination"} yet`}
                body="Destination-linked dining will appear here as new restaurants are added."
              />
            ) : (
              <>
                <SectionHeader
                  eyebrow={selectedDestination?.name || "Destination-selected"}
                  title={`Dining in ${selectedDestination?.name || "this destination"}`}
                />
                <div className="grid gap-5 lg:grid-cols-3">
                  {filteredRestaurants.map((restaurant) => (
                    <article key={restaurant.id} className="theme-card overflow-hidden">
                      <div
                        className="min-h-[220px] bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48)), url('${restaurant.images[0] || "/images/background.png"}')`,
                        }}
                      />
                      <div className="p-5">
                        <div className="theme-label text-xs uppercase tracking-[0.24em]">{restaurant.cuisine}</div>
                        <h2 className="theme-heading mt-2 text-xl font-semibold">{restaurant.name}</h2>
                        {restaurant.description ? (
                          <p className="theme-muted mt-3 text-sm leading-6">{restaurant.description}</p>
                        ) : null}

                        <div className="theme-muted mt-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#ff7352]" />
                            {restaurant.location}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span>{restaurant.priceRange}</span>
                            {restaurant.rating ? (
                              <span className="inline-flex items-center gap-1 text-[#ffc247]">
                                <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                                <span className="theme-heading">{restaurant.rating}</span>
                              </span>
                            ) : null}
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

function DestinationChooser({ destinations }: { destinations: ExplorerDestinationSummary[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="theme-panel rounded-[32px] p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.08]">
          <UtensilsCrossed className="h-5 w-5 text-[#ff5630]" />
        </div>
        <h2 className="theme-heading mt-4 text-2xl font-semibold">Choose a destination to view its restaurants</h2>
        <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">
          Dining is organized by destination so you can see the restaurants that match the place you plan to visit.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/restaurants?destination=${encodeURIComponent(destination.id)}`}
              className="theme-panel-soft rounded-[22px] p-4 transition hover:-translate-y-0.5"
            >
              <div className="theme-heading text-lg font-semibold">{destination.name}</div>
              <div className="theme-muted mt-2 text-sm">
                Open dining for this destination
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
    <div className="grid gap-5 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="theme-panel rounded-[28px] overflow-hidden animate-pulse">
          <div className="h-56 bg-white/[0.06]" />
          <div className="p-6 space-y-3">
            <div className="h-4 w-1/2 rounded-full bg-white/[0.08]" />
            <div className="h-5 w-3/4 rounded-full bg-white/[0.08]" />
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

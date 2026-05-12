"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import { apiFetch } from "@/lib/client-api";
import {
  type ExplorerDestinationSummary,
  withDestinationContext,
} from "@/lib/destination-explorer";
import type { PublicListingRecord } from "@/types/platform";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bus,
  CalendarDays,
  MessageCircle,
  MapPin,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

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
      location?: string | null;
      destinations?: { name?: string | null } | null;
    }>;
    activities: PublicListingRecord[];
    transport: PublicListingRecord[];
    diningListings: PublicListingRecord[];
    events: PublicListingRecord[];
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
    guides: Array<{
      id: string;
      name: string;
      bio: string;
      rating: number;
      reviewCount: number;
      avatarUrl?: string | null;
      specialties: string[];
      languages: string[];
    }>;
    forumQuestions: Array<{
      id: string;
      title: string;
      body: string;
      answerCount: number;
      isPinned: boolean;
      author: { name: string; isGuide: boolean };
    }>;
  };
  counts: {
    stays: number;
    activities: number;
    transport: number;
    diningListings: number;
    events: number;
    restaurants: number;
    guides: number;
    questions: number;
  };
}

const serviceCards = [
  {
    label: "Stays",
    key: "stays",
    href: "/accommodation",
    icon: BedDouble,
    description: "Browse hotels, lodges, camps, and other stays available in this destination.",
  },
  {
    label: "Things To Do",
    key: "activities",
    href: "/activities",
    icon: Sparkles,
    description: "See activities, tours, and experiences available in this destination.",
  },
  {
    label: "Transport",
    key: "transport",
    href: "/transport",
    icon: Bus,
    description: "See taxis, shuttles, game drives, boat cruises, and route support linked to this destination.",
  },
  {
    label: "Restaurants",
    key: "restaurants",
    href: "/restaurants",
    icon: UtensilsCrossed,
    description: "Find restaurants and dining options once this destination is on your plan.",
  },
  {
    label: "Events",
    key: "events",
    href: "/events",
    icon: CalendarDays,
    description: "Browse concerts, festivals, Boma nights, and local happenings connected to this destination.",
  },
  {
    label: "Ask a Local",
    key: "guides",
    href: "/ask-a-local",
    icon: MessageCircle,
    description: "Ask local guides and browse destination-specific questions and answers.",
  },
] as const;

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [context, setContext] = useState<DestinationContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DestinationContextResponse>(`/api/destinations/${slug}/context`)
      .then((payload) => {
        setContext(payload);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load destination.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="theme-page min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-[360px] animate-pulse rounded-[36px] bg-white/[0.06]" />
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="h-72 animate-pulse rounded-[28px] bg-white/[0.06]" />
            <div className="h-72 animate-pulse rounded-[28px] bg-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  if (!context || error) {
    return (
      <div className="theme-page min-h-screen flex items-center justify-center px-4">
        <div className="theme-panel rounded-[32px] p-10 text-center max-w-md">
          <h1 className="theme-heading text-2xl font-semibold">Destination not found</h1>
          <p className="theme-muted mt-2 text-sm">
            {error || "This destination page doesn't exist yet."}
          </p>
          <Link
            href="/travel-guide"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>
        </div>
      </div>
    );
  }

  const { destination, scoped, counts } = context;
  const heroImage =
    destination.image_url || destination.images?.[0] || "/images/victoria-falls.jpg";

  return (
    <div className="theme-page min-h-screen pb-20">
      <div
        className="relative min-h-[460px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.14), rgba(0,0,0,0.74)), url('${heroImage}')`,
        }}
      >
        <div className="mx-auto flex min-h-[460px] max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/travel-guide"
              className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:bg-black/55 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All destinations
            </Link>
            <div className="rounded-full bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/75 backdrop-blur">
              Destination hub
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff5630]/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
              <MapPin className="h-3.5 w-3.5" />
              {destination.location || "Zimbabwe"}
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">{destination.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              {destination.description ||
                "Choose this destination to see the stays, activities, restaurants, and local insight connected to it."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Stays" value={counts.stays} />
              <StatCard label="Things to do" value={counts.activities} />
              <StatCard label="Transport" value={counts.transport} />
              <StatCard label="Dining and events" value={counts.restaurants + counts.diningListings + counts.events} />
              <StatCard label="Local guidance" value={counts.guides + counts.questions} />
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AppServiceStrip
          activeLabel="Destinations"
          destinationId={destination.id}
          destinationName={destination.name}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="theme-panel rounded-[32px] p-6 md:p-8">
            <p className="theme-label text-xs uppercase tracking-[0.24em]">Selected destination</p>
            <h2 className="theme-heading mt-3 text-3xl font-semibold">
              Services now narrow into {destination.name}
            </h2>
            <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
              Start with destinations, events, transport, flights, and the trip planner. Once you choose a destination, Off2Zim shows the stays, restaurants, local advice, and activities available there.
            </p>
          </div>

          <div className="theme-panel rounded-[32px] p-6 md:p-8">
            <p className="theme-label text-xs uppercase tracking-[0.24em]">Keep global tools close</p>
            <div className="mt-4 space-y-3">
              <Link
                href="/events"
                className="theme-button-secondary flex items-center justify-between rounded-[18px] px-4 py-3 text-sm font-semibold"
              >
                Explore all events
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/transport"
                className="theme-button-secondary flex items-center justify-between rounded-[18px] px-4 py-3 text-sm font-semibold"
              >
                View transport options
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/transport/flights"
                className="theme-button-secondary flex items-center justify-between rounded-[18px] px-4 py-3 text-sm font-semibold"
              >
                Browse flights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            const count =
              service.key === "restaurants"
                ? counts.restaurants + counts.diningListings
                : counts[service.key];

            return (
              <Link
                key={service.label}
                href={withDestinationContext(service.href, destination.id)}
                className="theme-panel group rounded-[28px] p-6 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.08]">
                    <Icon className="h-5 w-5 text-[#ff5630]" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-[#ff5630] dark:text-white/32" />
                </div>
                <h3 className="theme-heading mt-5 text-2xl font-semibold">{service.label}</h3>
                <p className="theme-muted mt-3 text-sm leading-6">{service.description}</p>
                <div className="theme-heading mt-5 text-sm font-semibold">
                  {count} linked {service.label.toLowerCase()}
                  
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Featured stays</h2>
              <Link
                href={withDestinationContext("/accommodation", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.stays.slice(0, 3).map((stay) => (
                <div key={stay.id} className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
                  <div className="theme-heading text-base font-semibold">{stay.name}</div>
                  <div className="theme-muted mt-1 text-sm">
                    {stay.location || stay.destinations?.name || destination.name}
                  </div>
                  {stay.description ? (
                    <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">{stay.description}</p>
                  ) : null}
                </div>
              ))}
              {scoped.stays.length === 0 ? (
                <EmptyScopedState label="stays" destinationName={destination.name} />
              ) : null}
            </div>
          </div>

          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Transport here</h2>
              <Link
                href={withDestinationContext("/transport", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.transport.slice(0, 3).map((transport) => (
                <ListingPreview key={transport.id} listing={transport} />
              ))}
              {scoped.transport.length === 0 ? (
                <EmptyScopedState label="transport options" destinationName={destination.name} />
              ) : null}
            </div>
          </div>

          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Dining</h2>
              <Link
                href={withDestinationContext("/restaurants", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.restaurants.slice(0, 2).map((restaurant) => (
                <div key={restaurant.id} className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
                  <div className="theme-heading text-base font-semibold">{restaurant.name}</div>
                  <div className="theme-muted mt-1 text-sm">{restaurant.cuisine} · {restaurant.location}</div>
                  {restaurant.description ? (
                    <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">{restaurant.description}</p>
                  ) : null}
                </div>
              ))}
              {scoped.diningListings.slice(0, Math.max(0, 3 - scoped.restaurants.length)).map((dining) => (
                <ListingPreview key={dining.id} listing={dining} />
              ))}
              {scoped.restaurants.length === 0 && scoped.diningListings.length === 0 ? (
                <EmptyScopedState label="dining options" destinationName={destination.name} />
              ) : null}
            </div>
          </div>

          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Events</h2>
              <Link
                href={withDestinationContext("/events", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.events.slice(0, 3).map((event) => (
                <ListingPreview key={event.id} listing={event} />
              ))}
              {scoped.events.length === 0 ? (
                <EmptyScopedState label="events" destinationName={destination.name} />
              ) : null}
            </div>
          </div>

          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Things to do</h2>
              <Link
                href={withDestinationContext("/activities", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
                  <div className="theme-heading text-base font-semibold">{activity.title}</div>
                  <div className="theme-muted mt-1 text-sm">{activity.location}</div>
                  <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">
                    {activity.shortDescription || activity.description}
                  </p>
                </div>
              ))}
              {scoped.activities.length === 0 ? (
                <EmptyScopedState label="activities" destinationName={destination.name} />
              ) : null}
            </div>
          </div>

          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="theme-heading text-xl font-semibold">Ask a Local</h2>
              <Link
                href={withDestinationContext("/ask-a-local", destination.id)}
                className="text-sm font-medium text-[#ff5630]"
              >
                Open forum
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {scoped.forumQuestions.slice(0, 2).map((question) => (
                <div key={question.id} className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
                  <div className="theme-heading text-base font-semibold">{question.title}</div>
                  <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">{question.body}</p>
                  <div className="theme-subtle mt-3 text-xs">
                    {question.answerCount} answers by travelers and local guides
                  </div>
                </div>
              ))}
              {scoped.guides.slice(0, 1).map((guide) => (
                <div key={guide.id} className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
                  <div className="theme-heading text-base font-semibold">{guide.name}</div>
                  <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">{guide.bio}</p>
                  <div className="theme-subtle mt-3 text-xs">
                    {guide.rating.toFixed(1)} rating · {guide.reviewCount} reviews
                  </div>
                </div>
              ))}
              {scoped.guides.length === 0 && scoped.forumQuestions.length === 0 ? (
                <EmptyScopedState label="local guidance" destinationName={destination.name} />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ListingPreview({ listing }: { listing: PublicListingRecord }) {
  return (
    <div className="rounded-[18px] border border-black/8 p-4 dark:border-white/8">
      <div className="theme-heading text-base font-semibold">{listing.title}</div>
      <div className="theme-muted mt-1 text-sm">{listing.location}</div>
      <p className="theme-muted mt-2 text-sm leading-6 line-clamp-2">
        {listing.shortDescription || listing.description}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/28 px-4 py-4 text-white backdrop-blur">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-white/72">{label}</div>
    </div>
  );
}

function EmptyScopedState({
  label,
  destinationName,
}: {
  label: string;
  destinationName: string;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-black/15 p-4 text-sm theme-muted dark:border-white/12">
      No {label} are linked to {destinationName} yet.
    </div>
  );
}

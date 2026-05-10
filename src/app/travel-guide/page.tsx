"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import FavoriteButton from "@/components/ui/FavoriteButton";
import SectionHeader from "@/components/ui/SectionHeader";
import WeatherBadge from "@/components/ui/WeatherBadge";
import { apiFetch } from "@/lib/client-api";
import {
  type ExplorerDestinationSummary,
  enrichDestination,
} from "@/lib/destination-explorer";
import {
  ArrowRight,
  Banknote,
  CloudRain,
  FileText,
  Info,
  Languages,
  Search,
  SunMedium,
} from "lucide-react";

const travelTips = [
  {
    category: "Currency & Money",
    icon: Banknote,
    tips: [
      "US Dollar is widely accepted and still the easiest currency for travelers.",
      "Carry smaller notes for tips, transfers, and quick local purchases.",
      "Cards work at many larger hotels and restaurants, but not everywhere.",
    ],
  },
  {
    category: "Language & Communication",
    icon: Languages,
    tips: [
      "English is widely used, especially in tourism-facing businesses.",
      "Shona and Ndebele add warmth and local connection when you know a few phrases.",
      "Urban coverage is good, but signal can dip in remote safari and mountain regions.",
    ],
  },
  {
    category: "Health & Safety",
    icon: Info,
    tips: [
      "Malaria precautions matter in some regions, especially near lower-lying safari zones.",
      "Filtered or bottled water is the safer default.",
      "Medical and evacuation cover is worth having for higher-adventure itineraries.",
    ],
  },
  {
    category: "Documentation",
    icon: FileText,
    tips: [
      "A passport with at least 6 months validity is the safest baseline.",
      "Visa requirements vary by nationality, so check before departure.",
      "Driving visitors often need an international permit for smoother rental handoff.",
    ],
  },
];

const seasons = [
  {
    name: "Dry Season",
    months: "May - October",
    description: "Cooler, clearer, and strongest for wildlife visibility and long road days.",
    temperature: "15-25°C",
    icon: SunMedium,
    accent: "bg-[#fef3c7] text-[#b45309] dark:bg-[#332913] dark:text-[#ffd17b]",
  },
  {
    name: "Wet Season",
    months: "November - April",
    description: "Greener, moodier, and dramatic with storms, lush landscapes, and fuller waterfalls.",
    temperature: "20-30°C",
    icon: CloudRain,
    accent: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#13283a] dark:text-[#8dc9ff]",
  },
];

const facts = [
  ["Capital", "Harare"],
  ["Population", "~15 million"],
  ["Time Zone", "CAT (UTC+2)"],
  ["Electricity", "220V, Type G"],
  ["Currency", "USD, ZWL"],
  ["Driving", "Left side"],
  ["Internet Code", ".zw"],
  ["Calling Code", "+263"],
];

type GuideDestinationCard = ExplorerDestinationSummary & {
  meta: string;
  heroImage: string;
};

function toGuideDestination(destination: ExplorerDestinationSummary): GuideDestinationCard {
  const enriched = enrichDestination(destination);

  return {
    ...enriched,
    meta: enriched.category || "Destination guide",
    heroImage: enriched.image_url || enriched.images?.[0] || "/images/victoria-falls.jpg",
  };
}

export default function TravelGuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [destinations, setDestinations] = useState<GuideDestinationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ destinations: ExplorerDestinationSummary[] }>("/api/destinations")
      .then((payload) => {
        setDestinations(payload.destinations.map(toGuideDestination));
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load destinations.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDestinations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return destinations;
    }

    return destinations.filter((destination) =>
      [
        destination.name,
        destination.description,
        destination.region,
        destination.explorerFocus,
        destination.bestTime,
        destination.meta,
        destination.location,
        ...(destination.highlights || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [destinations, searchTerm]);

  const featuredCount = destinations.filter((destination) => destination.featured).length;

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Zimbabwe destination guide
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Start with the destination, then plan everything around it.
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                Explore Zimbabwe by destination first. Once you choose where to go, you can discover the
                stays, experiences, dining, and local insight that make that place worth the trip.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#destinations"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
                >
                  Browse destinations
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/events"
                  className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Explore events
                </Link>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <Search className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by destination, region, season, or travel style"
                    className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-2xl font-bold">{destinations.length || "—"}</div>
                  <div className="theme-subtle mt-1 text-xs">Destinations</div>
                </div>
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-2xl font-bold">
                    {destinations.filter((item) => item.region).length || "—"}
                  </div>
                  <div className="theme-subtle mt-1 text-xs">Regions covered</div>
                </div>
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-2xl font-bold">{featuredCount || "—"}</div>
                  <div className="theme-subtle mt-1 text-xs">Featured routes</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-black/10 bg-black/[0.03] p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-8 lg:border-l lg:border-t-0">
              <div
                className="min-h-[220px] rounded-[28px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/victoria-falls.jpg')",
                }}
              />

              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
                  Seasonality
                </div>
                <div className="mt-4 grid gap-4">
                  {seasons.map((season) => {
                    const Icon = season.icon;

                    return (
                      <div key={season.name} className="theme-panel-soft rounded-[24px] p-5">
                        <div className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${season.accent}`}>
                          <Icon className="mr-1.5 h-4 w-4" />
                          {season.months}
                        </div>
                        <h3 className="theme-heading mt-4 text-xl font-semibold">{season.name}</h3>
                        <p className="theme-muted mt-2 text-sm leading-6">{season.description}</p>
                        <p className="theme-subtle mt-3 text-xs uppercase tracking-[0.24em]">
                          Average temperatures {season.temperature}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
                  Quick facts
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {facts.map(([label, value]) => (
                    <div key={label} className="theme-panel-soft rounded-[20px] p-4">
                      <p className="theme-subtle text-xs uppercase tracking-[0.22em]">{label}</p>
                      <p className="theme-heading mt-2 text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Destinations" />
      </section>

      <section id="destinations" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Choose the place"
          title="Explore Zimbabwe by route, region, mood, and season"
        />

        {error ? (
          <div className="theme-panel rounded-[32px] p-8 text-center">
            <p className="theme-heading text-lg font-semibold">Could not load destinations</p>
            <p className="theme-muted mt-2 text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="theme-card overflow-hidden animate-pulse">
                <div className="h-56 bg-white/[0.06]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-28 rounded-full bg-white/[0.08]" />
                  <div className="h-5 w-3/4 rounded-full bg-white/[0.08]" />
                  <div className="h-3 w-full rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="theme-panel rounded-[32px] p-8 text-center">
            <p className="theme-heading text-lg font-semibold">No destinations matched your search</p>
            <p className="theme-muted mt-2 text-sm">
              Try a destination name, region, season, or travel style.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredDestinations.map((destination) => (
              <article key={destination.id} className="theme-card overflow-hidden">
                <div
                  className="relative h-56 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.52)), url('${destination.heroImage}')`,
                  }}
                >
                  <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-2 text-sm text-white backdrop-blur">
                    {destination.meta}
                  </div>
                  <FavoriteButton
                    itemId={destination.name}
                    itemType="destination"
                    className="absolute right-4 top-4 rounded-full bg-black/45 p-3 text-white backdrop-blur"
                    iconClassName="h-4 w-4"
                  />
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="text-2xl font-semibold text-white">{destination.name}</h3>
                    <p className="mt-2 text-sm text-white/75">
                      {destination.description || "Open this destination to explore what makes it worth visiting."}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="theme-muted flex items-center justify-between gap-3 text-sm">
                    <span>{destination.bestTime || "Year-round"}</span>
                    <WeatherBadge location={destination.name} compact />
                  </div>
                  <div className="theme-muted mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-black/[0.04] px-3 py-1 dark:bg-white/[0.06]">
                      {destination.region || destination.location || "Zimbabwe"}
                    </span>
                    <span className="rounded-full bg-black/[0.04] px-3 py-1 dark:bg-white/[0.06]">
                      {destination.explorerFocus || destination.meta}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(destination.highlights || []).slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs theme-muted dark:border-white/10"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/travel-guide/${destination.id}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    View destination
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Travel essentials"
          title="What to know before you choose where to go"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {travelTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <div key={tip.category} className="theme-panel rounded-[28px] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.07]">
                  <Icon className="h-5 w-5 text-[#ff5630]" />
                </div>
                <h3 className="theme-heading mt-4 text-lg font-semibold">{tip.category}</h3>
                <ul className="theme-muted mt-3 space-y-3 text-sm leading-6">
                  {tip.tips.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

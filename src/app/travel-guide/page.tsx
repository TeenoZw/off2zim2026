"use client";

import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import FavoriteButton from "@/components/ui/FavoriteButton";
import SectionHeader from "@/components/ui/SectionHeader";
import WeatherBadge from "@/components/ui/WeatherBadge";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Camera,
  Clock3,
  CloudRain,
  FileText,
  Globe2,
  Info,
  Languages,
  MapPin,
  Search,
  SunMedium,
} from "lucide-react";

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const destinations = [
  {
    id: 1,
    name: "Victoria Falls",
    description: "Wonder-led adventure, helicopter views, sunset cruises, and iconic stays.",
    bestTime: "May - October",
    climate: "Subtropical",
    highlights: ["Devil's Pool", "Bridge Bungee", "Helicopter Flights", "Sunset Cruises"],
    image: "/images/victoria-falls.jpg",
    meta: "Adventure capital",
  },
  {
    id: 2,
    name: "Hwange National Park",
    description: "Zimbabwe's flagship wildlife circuit with elephants, camps, and long safari days.",
    bestTime: "April - October",
    climate: "Semi-arid",
    highlights: ["Elephant Herds", "Big Five", "Game Drives", "Bird Watching"],
    image: "/images/hwange.jpg",
    meta: "Safari classic",
  },
  {
    id: 3,
    name: "Great Zimbabwe",
    description: "Heritage-rich ruins, cultural context, and slower storytelling travel.",
    bestTime: "April - September",
    climate: "Temperate",
    highlights: ["Stone Ruins", "Cultural Heritage", "Museums", "Local Crafts"],
    image: "/images/great-zimbabwe.jpg",
    meta: "Culture & history",
  },
  {
    id: 4,
    name: "Eastern Highlands",
    description: "Cooler air, mountain roads, mist, waterfalls, and scenic boutique escapes.",
    bestTime: "March - November",
    climate: "Temperate",
    highlights: ["Mountain Hiking", "Waterfalls", "Tea Estates", "Cool Weather"],
    image: "/images/destinations/eastern-highlands.jpg",
    meta: "Scenic escape",
  },
];

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

export default function TravelGuidePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDestinations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return destinations;
    }

    return destinations.filter((destination) =>
      [
        destination.name,
        destination.description,
        destination.bestTime,
        destination.climate,
        destination.meta,
        ...destination.highlights,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Destinations
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Zimbabwe travel guide
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                Explore destinations, plan routes, and move straight into your itinerary.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/trip-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
                >
                  Start planning
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/community-guides"
                  className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  <Globe2 className="h-4 w-4" />
                  Ask a local
                </Link>
              </div>
            </div>

            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/victoria-falls.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Destinations" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[32px] p-4 md:p-5">
          <div className="relative mx-auto max-w-3xl">
            <Search className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search destinations, activities, weather, or planning tips..."
              className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Top destinations"
          title="Browse Zimbabwe by mood, season, and story"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredDestinations.map((destination) => (
            <article key={destination.id} className="theme-card overflow-hidden">
              <div
                className="relative h-56 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.52)), url('${destination.image}')`,
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
                  <p className="mt-2 text-sm text-white/75">{destination.description}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="theme-muted flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#7ddf8c]" />
                    {destination.bestTime}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <SunMedium className="h-4 w-4 text-[#ffc247]" />
                    {destination.climate}
                  </span>
                </div>

                <div className="mt-4 inline-flex rounded-full bg-black/[0.04] px-3 py-2 text-sm dark:bg-white/[0.06]">
                  <WeatherBadge location={destination.name} compact />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {destination.highlights.slice(0, 3).map((highlight) => (
                    <span key={highlight} className="theme-chip rounded-full px-3 py-2 text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/travel-guide/${toSlug(destination.name)}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#ff5630]"
                >
                  Explore {destination.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="theme-panel mt-5 rounded-[30px] p-6 text-sm text-center">
            No destinations match that search.
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Climate & timing
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Match your route to the season
            </h2>
            <div className="mt-6 space-y-4">
              {seasons.map((season) => {
                const Icon = season.icon;
                return (
                  <div key={season.name} className="theme-card-soft p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${season.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="theme-heading text-xl font-semibold">{season.name}</h3>
                        <p className="mt-1 text-sm font-medium text-[#ff5630]">{season.months}</p>
                        <p className="theme-muted mt-3 text-sm leading-6">{season.description}</p>
                        <div className="theme-chip mt-4 inline-flex rounded-full px-3 py-2 text-xs">
                          Typical range: {season.temperature}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">Essential tips</p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Practical guidance before you book
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {travelTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.category} className="theme-card-soft p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]">
                        <Icon className="h-5 w-5 text-[#ff7352]" />
                      </div>
                      <h3 className="theme-heading text-lg font-semibold">{tip.category}</h3>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {tip.tips.map((entry) => (
                        <li key={entry} className="theme-muted flex items-start gap-3 text-sm leading-6">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ff5630]" />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[36px] p-6 md:p-8">
          <div className="mb-6">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">Quick facts</p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Fast reference for planning and logistics
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="theme-card-soft rounded-[24px] p-5 text-center">
                <div className="text-sm font-medium text-[#ff5630]">{label}</div>
                <div className="theme-heading mt-2 text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#ff5630]/20 bg-[linear-gradient(135deg,rgba(255,86,48,0.16),rgba(17,17,17,0.95))] p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <Camera className="h-4 w-4 text-[#ffc247]" />
              Destination-ready planning
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
              Move from destination research into a real itinerary
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Browse the destination mood here, then use trip planner and community
              guides to turn inspiration into a route that actually works.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/trip-planner"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
              >
                Plan your route
              </Link>
              <Link
                href="/community-guides"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white"
              >
                <MapPin className="h-4 w-4" />
                Talk to local guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

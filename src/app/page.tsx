import Link from "next/link";
import FavoriteButton from "@/components/ui/FavoriteButton";
import WeatherBadge from "@/components/ui/WeatherBadge";
import {
  ArrowRight,
  BadgeCheck,
  Bus,
  CalendarDays,
  Compass,
  Plane,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Ticket,
  Star,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

const heroDestination = {
  title: "Explore Zimbabwe with local confidence",
  eyebrow: "Explore | Experience | Enjoy",
  description:
    "Find stays, experiences, transport, and local guidance in one place.",
  image: "/images/slide1.jpg",
  location: "Eastern Highlands",
};

const destinations = [
  {
    name: "Harare",
    image: "/images/jacaranda.JPG",
    detail: "City stays, dining, business travel",
    meta: "19 stays • 22 activities",
  },
  {
    name: "Victoria Falls",
    image: "/images/victoria-falls.jpg",
    detail: "Adventure, premium lodges, iconic tours",
    meta: "16 stays • 21 activities",
  },
  {
    name: "Kariba",
    image: "/images/kariba.jpg",
    detail: "Houseboats, fishing, lake sunsets",
    meta: "8 stays • 10 experiences",
  },
  {
    name: "Hwange",
    image: "/images/hwange.jpg",
    detail: "Safari camps and wildlife journeys",
    meta: "14 stays • 9 safaris",
  },
];

const marketplaceLanes = [
  {
    title: "Stays",
    description: "Hotels, safari lodges, boutique stays, and houseboats.",
    icon: ShoppingBag,
    href: "/accommodation",
    accent: "from-[#7ddf8c]/20 to-transparent",
  },
  {
    title: "Experiences",
    description: "Adventure, culture, dining, events, and story-led activities.",
    icon: Compass,
    href: "/activities",
    accent: "from-[#ff5a36]/20 to-transparent",
  },
  {
    title: "Trip Planner",
    description: "Build itineraries, organize logistics, and keep your budget visible.",
    icon: CalendarDays,
    href: "/trip-planner",
    accent: "from-[#5aa7ff]/20 to-transparent",
  },
  {
    title: "Ask a Local",
    description: "Connect with trusted community guides for deeper local insight.",
    icon: MessageCircle,
    href: "/community-guides",
    accent: "from-[#ffc247]/20 to-transparent",
  },
];

const trustPoints = [
  {
    title: "Verified local suppliers",
    body: "Book with trusted providers across Zimbabwe.",
    icon: BadgeCheck,
  },
  {
    title: "Clear planning flow",
    body: "Move from discovery to itinerary without losing context.",
    icon: ShieldCheck,
  },
  {
    title: "Local guidance when it matters",
    body: "Get help from people who know the destination well.",
    icon: MessageCircle,
  },
];

const stories = [
  {
    title: "Featured destinations",
    copy: "Start with places worth the trip.",
    image: "/images/vicfalls.jpg",
  },
  {
    title: "Book with confidence",
    copy: "Compare trusted options and move quickly.",
    image: "/images/palm-river-hotel-604329-original.jpg",
  },
  {
    title: "Local guidance matters",
    copy: "Ask better questions before you book.",
    image: "/images/great-zimbabwe.jpg",
  },
];

const reviews = [
  {
    name: "Sarah Johnson",
    route: "Victoria Falls",
    quote:
      "Everything felt more trustworthy than piecing bookings together over calls and messages.",
  },
  {
    name: "Michael Chen",
    route: "Lake Kariba",
    quote:
      "The destination-first layout makes it easy to move from inspiration to a trip that feels real and well put together.",
  },
  {
    name: "Maria Santos",
    route: "Great Zimbabwe",
    quote:
      "The mix of storytelling, practical detail, and local guidance feels like a real travel companion.",
  },
];

const offerGrid = [
  {
    title: "Stays",
    description: "Hotels, lodges, camps, and houseboats.",
    href: "/accommodation",
    icon: ShoppingBag,
  },
  {
    title: "Experiences",
    description: "Tours, activities, culture, and adventure.",
    href: "/activities",
    icon: Compass,
  },
  {
    title: "Restaurants",
    description: "Dining that fits the route and the moment.",
    href: "/restaurants",
    icon: UtensilsCrossed,
  },
  {
    title: "Events & ticketing",
    description: "Local events and bookable moments worth adding.",
    href: "/events",
    icon: Ticket,
  },
  {
    title: "Flights",
    description: "Air connections for tighter schedules and longer routes.",
    href: "/transport/flights",
    icon: Plane,
  },
  {
    title: "Ground transport",
    description: "Bus, taxi, and route support across the trip.",
    href: "/transport",
    icon: Bus,
  },
  {
    title: "Marketplace",
    description: "Browse provider-led offers in one place.",
    href: "/marketplace",
    icon: BadgeCheck,
  },
  {
    title: "Ask a Local",
    description: "Trusted guidance before you commit to the plan.",
    href: "/community-guides",
    icon: MessageCircle,
  },
];

export default function HomePage() {
  return (
    <div className="theme-page relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,106,61,0.22),transparent_58%)]" />
      <div className="absolute inset-x-0 top-40 h-[28rem] bg-[radial-gradient(circle_at_center,rgba(75,120,255,0.16),transparent_60%)]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="theme-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff5630]" />
              {heroDestination.eyebrow}
            </div>

            <div className="space-y-4">
              <h1 className="theme-heading max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                {heroDestination.title}
              </h1>
              <p className="theme-muted max-w-2xl text-base md:text-xl">
                {heroDestination.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trip-planner"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c4d]"
              >
                Start planning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/accommodation"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Browse stays
              </Link>
              <Link
                href="/register"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Create account
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="theme-panel-soft rounded-full px-4 py-2 backdrop-blur">
                Verified stays and experiences
              </div>
              <div className="theme-panel-soft rounded-full px-4 py-2 backdrop-blur">
                Trip planner built in
              </div>
              <div className="theme-panel-soft rounded-full px-4 py-2 backdrop-blur">
                Local guidance on demand
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative min-h-[27rem] overflow-hidden rounded-[36px] border border-black/10 bg-white p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-[#141414] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.68)), url('${heroDestination.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a]/85 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <MapPin className="h-4 w-4 text-[#ff5630]" />
                  {heroDestination.location}
                </div>
                <div className="flex gap-2">
                  <FavoriteButton
                    itemId={heroDestination.location}
                    itemType="destination"
                    className="rounded-full bg-[#1a1a1a]/85 p-3 text-white/80 backdrop-blur transition hover:text-white"
                    iconClassName="h-5 w-5"
                  />
                </div>
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-[30px] border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Featured right now
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">
                      Eastern Highlands Escape
                    </h2>
                  </div>
                  <div className="rounded-full bg-[#ff5630]/15 px-3 py-1 text-sm text-[#ffb49f]">
                    Story-led pick
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-[22px] bg-white/8 p-3">
                    <div className="text-white/55">Mood</div>
                    <div className="mt-1 font-semibold text-white">Scenic</div>
                  </div>
                  <div className="rounded-[22px] bg-white/8 p-3">
                    <div className="text-white/55">Weather</div>
                    <div className="mt-1 font-semibold text-white">
                      <WeatherBadge
                        location={heroDestination.location}
                        className="text-white"
                        showCondition={false}
                        compact
                      />
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-white/8 p-3">
                    <div className="text-white/55">From</div>
                    <div className="mt-1 font-semibold text-white">$40</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[36px] p-5 backdrop-blur md:p-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="theme-subtle text-sm uppercase tracking-[0.28em]">
                Start here
              </p>
              <h2 className="theme-heading mt-2 text-3xl font-semibold">
                Travel your way
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {marketplaceLanes.map((lane) => {
              const Icon = lane.icon;

              return (
                <Link
                  key={lane.title}
                  href={lane.href}
                  className={`theme-panel-soft group rounded-[30px] bg-gradient-to-br ${lane.accent} p-5 transition hover:-translate-y-1`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] text-slate-900 dark:bg-white/8 dark:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="theme-heading mt-5 text-xl font-semibold">
                    {lane.title}
                  </h3>
                  <p className="theme-muted mt-2 text-sm leading-6">
                    {lane.description}
                  </p>
                  <span className="theme-muted mt-5 inline-flex items-center gap-2 text-sm font-medium transition group-hover:text-slate-950 dark:group-hover:text-white">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[36px] p-6 md:p-8">
          <div className="mb-6">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Everything in one place
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Book the full Zimbabwe trip
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {offerGrid.map((offer) => {
              const Icon = offer.icon;

              return (
                <Link
                  key={offer.title}
                  href={offer.href}
                  className="theme-card-soft rounded-[28px] p-5 transition hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.07]">
                    <Icon className="h-5 w-5 text-[#ff7352]" />
                  </div>
                  <h3 className="theme-heading mt-4 text-lg font-semibold">
                    {offer.title}
                  </h3>
                  <p className="theme-muted mt-2 text-sm leading-6">
                    {offer.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Popular destinations
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Popular destinations
            </h2>
          </div>
          <Link
            href="/travel-guide"
            className="theme-muted hidden text-sm hover:text-slate-950 dark:hover:text-white md:inline-flex"
          >
            View travel guide
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {destinations.map((destination) => (
            <article
              key={destination.name}
              className="theme-card group overflow-hidden rounded-[30px]"
            >
              <div
                className="relative h-72 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.7)), url('${destination.image}')`,
                }}
              >
                <div className="absolute right-4 top-4 rounded-full bg-[#121212]/85 p-3 backdrop-blur">
                  <FavoriteButton
                    itemId={destination.name}
                    itemType="destination"
                    className="text-white/85"
                    iconClassName="h-5 w-5"
                  />
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {destination.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    {destination.detail}
                  </p>
                  <div className="mt-4 inline-flex items-center rounded-full bg-black/45 px-3 py-2 text-sm text-white/80 backdrop-blur">
                    <MapPin className="mr-2 h-4 w-4 text-[#ff5630]" />
                    {destination.meta}
                  </div>
                  <div className="mt-3 inline-flex items-center rounded-full bg-black/45 px-3 py-2 text-sm text-white/80 backdrop-blur">
                    <WeatherBadge location={destination.name} className="text-white" compact />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="theme-panel-strong rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Why travelers choose Off2Zim
            </p>
            <div className="mt-6 space-y-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div key={point.title} className="theme-card-soft p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/8">
                        <Icon className="h-5 w-5 text-[#ff8a63]" />
                      </div>
                      <div>
                        <h3 className="theme-heading text-lg font-semibold">
                          {point.title}
                        </h3>
                        <p className="theme-muted mt-2 text-sm leading-6">
                          {point.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:items-start">
            {stories.map((story) => (
              <article
                key={story.title}
                className="theme-card overflow-hidden"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.28)), url('${story.image}')`,
                  }}
                />
                <div className="p-4">
                  <h3 className="theme-heading text-lg font-semibold">
                    {story.title}
                  </h3>
                  <p className="theme-muted mt-2 text-sm leading-6">
                    {story.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="theme-panel rounded-[36px] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="theme-label text-sm uppercase tracking-[0.28em]">
                Social proof
              </p>
              <h2 className="theme-heading mt-2 text-3xl font-semibold">
                Reviews that reinforce trust
              </h2>
            </div>
            <div className="theme-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
              <Star className="h-4 w-4 text-[#ffc247]" />
              4.8 average booking confidence
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="theme-card-soft p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="theme-heading font-semibold">{review.name}</h3>
                    <p className="theme-subtle text-sm">{review.route}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#ffc247]">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <p className="theme-muted mt-4 text-sm leading-6">
                  “{review.quote}”
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[30px] border border-black/10 bg-black/[0.03] p-6 dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center">
            <div>
              <h3 className="theme-heading text-2xl font-semibold">
                Ready to shape your trip?
              </h3>
              <p className="theme-muted mt-2 text-sm">
                Start with destinations, add stays and experiences, then build your itinerary.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trip-planner"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c4d]"
              >
                Open trip planner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/marketplace"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Browse marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

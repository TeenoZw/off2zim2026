import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Compass,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

const heroDestination = {
  title: "Explore Zimbabwe with local confidence",
  eyebrow: "Explore | Experience | Enjoy",
  description:
    "Off2Zim brings together trusted stays, memorable experiences, useful transport, and authentic local insight in one destination-first platform built for Zimbabwe.",
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
    body: "The PRD centers trust. Off2Zim is a marketplace layer connecting explorers to legitimate Zimbabwean providers.",
    icon: BadgeCheck,
  },
  {
    title: "Low-friction booking flow",
    body: "Move smoothly from inspiration to action with clear pricing, easier comparison, and straightforward booking journeys.",
    icon: ShieldCheck,
  },
  {
    title: "Built for repeat travel",
    body: "Favorites, reviews, messages, and itinerary tools make it easier to return, rebook, and keep exploring Zimbabwe.",
    icon: Users,
  },
];

const stories = [
  {
    title: "Featured destinations",
    copy: "Browse standout destinations through rich imagery, quick-glance highlights, and a feed designed for travel inspiration.",
    image: "/images/vicfalls.jpg",
  },
  {
    title: "Book with confidence",
    copy: "Clear pricing, stronger trust signals, and cleaner decisions help travelers move from interest to action with confidence.",
    image: "/images/palm-river-hotel-604329-original.jpg",
  },
  {
    title: "Local guidance matters",
    copy: "Local insight makes Off2Zim more than a marketplace by helping travelers make better, more informed choices.",
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
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/accommodation"
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Browse stays
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="theme-panel-soft rounded-[28px] p-4 backdrop-blur">
                <div className="text-2xl font-bold">Verified</div>
                <div className="theme-muted text-sm">supplier-first marketplace</div>
              </div>
              <div className="theme-panel-soft rounded-[28px] p-4 backdrop-blur">
                <div className="text-2xl font-bold">Multi-role</div>
                <div className="theme-muted text-sm">explorers, guides, providers</div>
              </div>
              <div className="theme-panel-soft rounded-[28px] p-4 backdrop-blur">
                <div className="text-2xl font-bold">Mobile-first</div>
                <div className="theme-muted text-sm">crafted for modern Zimbabwe travel</div>
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
                  <button
                    type="button"
                    className="rounded-full bg-[#1a1a1a]/85 p-3 text-white/80 backdrop-blur transition hover:text-white"
                    aria-label="Save destination"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
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
                    <div className="text-white/55">Best for</div>
                    <div className="mt-1 font-semibold text-white">Weekenders</div>
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
                Discovery lanes
              </p>
              <h2 className="theme-heading mt-2 text-3xl font-semibold">
                Explore the platform the way travelers actually think
              </h2>
            </div>
            <p className="theme-muted max-w-xl text-sm">
              Off2Zim works best when exploration, trust, and action sit side by
              side. These lanes make the product value clear at a glance.
            </p>
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
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Popular destinations
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Story-rich cards inspired by the mobile app
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
                  <Heart className="h-5 w-5 text-[#ff5b65]" />
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
              Why this works
            </p>
            <h2 className="theme-heading mt-3 text-3xl font-semibold">
              A marketplace, not a travel agency
            </h2>
            <p className="theme-muted mt-4 max-w-2xl text-base leading-7">
              The product requirements are clear: Off2Zim should act as a
              curated digital gateway into Zimbabwe. That means stronger supplier
              trust, destination-led browsing, and a smoother bridge between
              inspiration and transaction.
            </p>

            <div className="mt-8 space-y-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.title}
                    className="theme-card-soft p-5"
                  >
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="theme-panel-strong rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Supply side
            </p>
            <h2 className="theme-heading mt-3 text-3xl font-semibold">
              Built to onboard providers, not just showcase them
            </h2>
            <p className="theme-muted mt-4">
              One business can manage many services. That’s a strong product
              advantage, and it deserves a more confident public-facing pitch.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="theme-card-soft rounded-[26px] p-4">
                <div className="theme-subtle text-sm">Supplier workflow</div>
                <div className="theme-heading mt-2 font-semibold">
                  Verify company, publish listings, manage availability
                </div>
              </div>
              <div className="theme-card-soft rounded-[26px] p-4">
                <div className="theme-subtle text-sm">Commercial model</div>
                <div className="theme-heading mt-2 font-semibold">
                  Commission, subscriptions, featured placements
                </div>
              </div>
            </div>

            <Link
              href="/provider-dashboard"
              className="theme-button-secondary mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              View supplier tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[36px] border border-[#ff5630]/20 bg-[linear-gradient(135deg,rgba(255,86,48,0.18),rgba(19,19,19,0.95))] p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-white/55">
              Community & planning
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Local advice should feel like part of the product
            </h2>
            <p className="mt-4 text-white/75">
              Community Guides, saved favorites, messages, and itinerary tools
              are differentiators. The homepage now signals those clearly.
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-[26px] bg-black/25 p-4">
                <div className="text-sm text-white/55">Trip Planner</div>
                <div className="mt-1 font-semibold text-white">
                  Organize bookings, dates, and budgets in one place
                </div>
              </div>
              <div className="rounded-[26px] bg-black/25 p-4">
                <div className="text-sm text-white/55">Ask a Local</div>
                <div className="mt-1 font-semibold text-white">
                  Turn browsing into confidence with contextual human insight
                </div>
              </div>
            </div>
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
        </div>
      </section>
    </div>
  );
}

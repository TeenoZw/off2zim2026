import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CalendarDays,
  Compass,
  MessageCircle,
  Plane,
  ShieldCheck,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import WeatherBadge from "@/components/ui/WeatherBadge";
import { getSurfaceHref, getSurfaceHome, resolveAppSurface } from "@/lib/app-surface";

const hero = {
  eyebrow: "Explore | Experience | Enjoy",
  title: "Off2Zim brings Zimbabwe together in one beautifully simple travel platform.",
  body: "Discover destinations, plan the route, ask locals, and move through the trip with more clarity.",
  image: "/images/slide1.jpg",
  location: "Eastern Highlands",
};

const platformMoments = [
  {
    title: "Travel guide",
    body: "A destination-first way to understand where to go before you commit to a route.",
    href: "/travel-guide",
    icon: Compass,
  },
  {
    title: "Trip planner",
    body: "Build a day-by-day itinerary with transport, timing, and cost visibility.",
    href: "/trip-planner",
    icon: CalendarDays,
  },
  {
    title: "Ask a Local",
    body: "Get practical local guidance when you need sharper context than search results.",
    href: "/community-guides",
    icon: MessageCircle,
  },
  {
    title: "Travel enquiries",
    body: "Send enquiries when you want help shaping a route, stay, transfer, or experience.",
    href: "/contact",
    icon: ShieldCheck,
  },
];

const serviceAtlas = [
  { label: "Destinations", detail: "Cities, parks, heritage sites, lakes, and scenic routes.", icon: Compass },
  { label: "Transport", detail: "Flights, transfers, buses, and movement planning.", icon: Bus },
  { label: "Events", detail: "Tickets, festivals, and moments worth building around.", icon: Ticket },
  { label: "Dining", detail: "Restaurants and local food experiences for the route.", icon: UtensilsCrossed },
  { label: "Flights", detail: "Air travel options for tighter timelines and longer journeys.", icon: Plane },
  { label: "Guides", detail: "Community insight and guide-led context where it matters.", icon: MessageCircle },
];

const destinationFrames = [
  {
    title: "Victoria Falls",
    body: "Iconic adventure, river energy, and one of the strongest first impressions in the region.",
    image: "/images/victoria-falls.jpg",
  },
  {
    title: "Harare",
    body: "Urban stays, business rhythm, dining, and the practical start point for many trips.",
    image: "/images/jacaranda.JPG",
  },
  {
    title: "Kariba",
    body: "Houseboats, lake air, fishing, and a slower route built around water and sunsets.",
    image: "/images/kariba.jpg",
  },
];

const trustPoints = [
  "Destination-led discovery instead of scattered searching",
  "Planner and guide tools built into the same platform",
  "One account for travelers, a separate path for providers",
];

const quickRoutes = [
  { label: "Travel Guide", href: "/travel-guide" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Guides", href: "/community-guides" },
  { label: "Events", href: "/events" },
  { label: "Enquiries", href: "/contact" },
];

export default async function HomePage() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const surfaceHeader = headerStore.get("x-off2zim-surface");
  const surface = surfaceHeader
    ? resolveAppSurface(surfaceHeader)
    : resolveAppSurface(host, "/");

  if (surface !== "public") {
    redirect(getSurfaceHome(surface));
  }

  return (
    <div className="theme-page relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(255,106,61,0.22),transparent_58%)]" />
      <div className="absolute inset-x-0 top-48 h-[32rem] bg-[radial-gradient(circle_at_center,rgba(75,120,255,0.14),transparent_62%)]" />

      <section className="relative px-0 pb-12 pt-0">
        <div
          className="relative min-h-[calc(100svh-5rem)] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(4,4,4,0.78) 0%, rgba(4,4,4,0.48) 42%, rgba(4,4,4,0.62) 100%), url('${hero.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="max-w-3xl pt-6 lg:pt-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/82 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ff5630]" />
                {hero.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 md:text-xl">
                {hero.body}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={getSurfaceHref("explorer", "/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c4d]"
                >
                  Client login
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={getSurfaceHref("provider", "/register")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  Service provider registration
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/28"
                >
                  Make an enquiry
                </Link>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr] lg:max-w-5xl">
              <div className="rounded-[30px] border border-white/12 bg-black/36 p-5 text-white backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.28em] text-white/52">
                  Featured atmosphere
                </div>
                <div className="mt-2 text-2xl font-semibold">Eastern Highlands</div>
                <div className="mt-3 max-w-xl text-sm leading-6 text-white/72">
                  Forest roads, mountain air, tea country, waterfalls, and a calm route for travelers who want scenery before noise.
                </div>
              </div>
              <div className="rounded-[30px] border border-white/12 bg-black/36 p-5 text-white backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.28em] text-white/52">
                  Conditions
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  <WeatherBadge location={hero.location} className="text-white" compact />
                </div>
                <div className="mt-3 text-sm leading-6 text-white/72">
                  Live weather helps travelers read the destination before they move.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-3">
            {quickRoutes.map((route) => (
              <Link
                key={route.label}
                href={route.href}
                className="theme-chip inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What the platform does"
          title="Off2Zim helps travelers understand the trip before the trip starts"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {platformMoments.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="theme-panel group rounded-[32px] p-6 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/8">
                    <Icon className="h-5 w-5 text-[#ff5630]" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-[#ff5630] dark:text-white/32" />
                </div>
                <h3 className="theme-heading mt-5 text-2xl font-semibold">{item.title}</h3>
                <p className="theme-muted mt-3 max-w-xl text-sm leading-7">{item.body}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[36px] p-6 md:p-8">
          <SectionHeader
            eyebrow="Across the journey"
            title="A broader travel surface, not just one booking step"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceAtlas.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="theme-panel-soft rounded-[28px] p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.07]">
                    <Icon className="h-5 w-5 text-[#ff5630]" />
                  </div>
                  <h3 className="theme-heading mt-4 text-lg font-semibold">{item.label}</h3>
                  <p className="theme-muted mt-2 text-sm leading-6">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Zimbabwe at a glance"
          title="The platform should feel like the destination before it feels like a transaction"
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {destinationFrames.map((destination, index) => (
            <article
              key={destination.title}
              className={`theme-card overflow-hidden rounded-[34px] ${index === 0 ? "lg:row-span-2" : ""}`}
            >
              <div
                className={`${index === 0 ? "h-[30rem]" : "h-64"} bg-cover bg-center`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.62)), url('${destination.image}')`,
                }}
              />
              <div className="p-5">
                <h3 className="theme-heading text-2xl font-semibold">{destination.title}</h3>
                <p className="theme-muted mt-3 text-sm leading-7">{destination.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="theme-panel-strong rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">Built with clarity</p>
            <div className="mt-5 space-y-4">
              {trustPoints.map((point) => (
                <div key={point} className="theme-panel-soft rounded-[24px] px-4 py-4 text-sm leading-6">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <SectionHeader
              eyebrow="Start with the right door"
              title="Choose the next step that matches why you came to Off2Zim"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href={getSurfaceHref("explorer", "/login")}
                className="theme-panel-soft rounded-[28px] p-5 transition hover:-translate-y-0.5"
              >
                <h3 className="theme-heading text-xl font-semibold">Client login</h3>
                <p className="theme-muted mt-2 text-sm leading-6">
                  Return to saved trips, planner activity, and account tools.
                </p>
              </Link>

              <Link
                href="/trip-planner"
                className="theme-panel-soft rounded-[28px] p-5 transition hover:-translate-y-0.5"
              >
                <h3 className="theme-heading text-xl font-semibold">Trip planner</h3>
                <p className="theme-muted mt-2 text-sm leading-6">
                  Build routes, organize days, and shape the travel story.
                </p>
              </Link>

              <Link
                href="/community-guides"
                className="theme-panel-soft rounded-[28px] p-5 transition hover:-translate-y-0.5"
              >
                <h3 className="theme-heading text-xl font-semibold">Guides</h3>
                <p className="theme-muted mt-2 text-sm leading-6">
                  Ask locals and explore guide-led context before committing.
                </p>
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c4d]"
              >
                Make an enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={getSurfaceHref("provider", "/register")}
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Service provider registration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

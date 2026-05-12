import Image from "next/image";
import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import { getSubtypesForGroup } from "@/lib/taxonomy";
import {
  ArrowRight,
  Bus,
  CarFront,
  Plane,
  Route,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

const transportTypes = [
  {
    id: "bus",
    name: "Bus transport",
    description: "Intercity movement, route planning, and practical budget-friendly travel.",
    icon: Bus,
    href: "/transport/bus",
    image: "/images/slide1.jpg",
    features: ["Intercity routes", "Regional movement", "Budget planning"],
  },
  {
    id: "car-rental",
    name: "Car rental",
    description: "Self-drive flexibility for travelers building multi-stop Zimbabwe routes.",
    icon: CarFront,
    href: "/transport/car-rental",
    image: "/images/destinations/eastern-highlands.jpg",
    features: ["SUV and 4x4", "Self-drive", "Flexible pickup"],
  },
  {
    id: "flights",
    name: "Flights",
    description: "Domestic hops and time-saving connections between major destinations.",
    icon: Plane,
    href: "/transport/flights",
    image: "/images/victoria-falls.jpg",
    features: ["Domestic links", "Scenic air movement", "Faster route shaping"],
  },
  {
    id: "taxi",
    name: "Taxi services",
    description: "Airport transfers, city movement, and last-mile itinerary support.",
    icon: Route,
    href: "/transport/taxi",
    image: "/images/jacaranda.JPG",
    features: ["Airport pickup", "City rides", "Last-mile support"],
  },
];
const transportSubtypes = getSubtypesForGroup("transport");

export default function TransportPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Transport
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Plan transport across Zimbabwe with clear, practical options
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Compare routes, save time, and choose the transport that fits your itinerary.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="theme-card-soft rounded-[24px] p-4">
                  <ShieldCheck className="h-6 w-6 text-[#8cf0a1]" />
                  <div className="theme-heading mt-3 text-base font-semibold">Trusted providers</div>
                  <div className="theme-muted mt-1 text-sm">Verified operators for safer, more reliable travel.</div>
                </div>
                <div className="theme-card-soft rounded-[24px] p-4">
                  <TimerReset className="h-6 w-6 text-[#5aa7ff]" />
                  <div className="theme-heading mt-3 text-base font-semibold">Time visibility</div>
                  <div className="theme-muted mt-1 text-sm">See which options save time and which ones take longer.</div>
                </div>
                <div className="theme-card-soft rounded-[24px] p-4">
                  <Route className="h-6 w-6 text-[#ffca74]" />
                  <div className="theme-heading mt-3 text-base font-semibold">Trip-linked planning</div>
                  <div className="theme-muted mt-1 text-sm">Choose transport that fits the pace and timing of your trip.</div>
                </div>
              </div>
            </div>

            <div
              className="min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.48)), url('/images/destinations/eastern-highlands.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Transport" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Modes"
          title="Choose the transport option that fits your route"
        />
        <div className="mb-6 flex flex-wrap gap-2">
          {transportSubtypes.map((subtype) => (
            <Link
              key={subtype.id}
              href={`/marketplace?serviceGroup=transport&subtype=${encodeURIComponent(subtype.id)}`}
              className="theme-chip rounded-full px-3 py-2 text-xs font-semibold"
              title={subtype.travelerHint}
            >
              {subtype.label}
            </Link>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {transportTypes.map((transport) => {
            const Icon = transport.icon;
            return (
              <Link key={transport.id} href={transport.href} className="theme-card overflow-hidden transition hover:-translate-y-0.5">
                <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-[220px]">
                    <Image src={transport.image} alt={transport.name} fill className="object-cover" />
                  </div>
                  <div className="p-6 md:p-7">
                    <Icon className="h-7 w-7 text-[#ff7352]" />
                    <h2 className="theme-heading mt-4 text-2xl font-semibold">
                      {transport.name}
                    </h2>
                    <p className="theme-muted mt-3 text-sm leading-6">
                      {transport.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {transport.features.map((feature) => (
                        <span key={feature} className="theme-chip rounded-full px-3 py-1.5 text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ff5630]">
                      View transport options
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

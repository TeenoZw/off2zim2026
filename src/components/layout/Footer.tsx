import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, MessageCircle } from "lucide-react";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Destinations", href: "/travel-guide" },
      { label: "Accommodation", href: "/accommodation" },
      { label: "Activities", href: "/activities" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Trip Planner", href: "/trip-planner" },
      { label: "Bookings", href: "/checkout" },
      { label: "Ask a Local", href: "/community-guides" },
      { label: "Travel Guide", href: "/travel-guide" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "Provider Dashboard", href: "/provider-dashboard" },
      { label: "Register", href: "/register" },
      { label: "Login", href: "/login" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070707] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#121212] p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">
              Off2Zim
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-white">
              Explore, experience, and enjoy Zimbabwe through one trusted
              destination marketplace.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
              Built around trusted suppliers, strong visual storytelling,
              mobile-first browsing, smoother booking journeys, and richer local
              context.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trip-planner"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6f4d]"
              >
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/provider-dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Partner with Off2Zim
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <BadgeCheck className="h-4 w-4 text-[#7ddf8c]" />
                  Verified suppliers
                </div>
              </div>
              <div className="rounded-[24px] bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CalendarDays className="h-4 w-4 text-[#5aa7ff]" />
                  Better trip organization
                </div>
              </div>
              <div className="rounded-[24px] bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <MessageCircle className="h-4 w-4 text-[#ffc247]" />
                  Local guidance
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[32px] border border-white/10 bg-[#121212] p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-2xl bg-[#2a1614] p-3">
                  <MapPin className="h-4 w-4 text-[#ff7352]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Based in Zimbabwe
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    4 Fairmile Close, Ruwa, Harare, Zimbabwe
                    <br />
                    info@off2zim.co.zw
                    <br />
                    +263 772 316 693
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
              {footerColumns.map((column) => (
                <div
                  key={column.title}
                  className="rounded-[32px] border border-white/10 bg-[#121212] p-6"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {column.title}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Off2Zim. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import {
  Bus,
  CalendarDays,
  Compass,
  MessageCircle,
  Plane,
  ShoppingBag,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

const items = [
  { label: "Destinations", href: "/travel-guide", icon: Compass },
  { label: "Stays", href: "/accommodation", icon: ShoppingBag },
  { label: "Things To Do", href: "/activities", icon: Compass },
  { label: "Restaurants", href: "/restaurants", icon: UtensilsCrossed },
  { label: "Events", href: "/events", icon: Ticket },
  { label: "Transport", href: "/transport", icon: Bus },
  { label: "Flights", href: "/transport/flights", icon: Plane },
  { label: "Trip Planner", href: "/trip-planner", icon: CalendarDays },
  { label: "Ask a Local", href: "/community-guides", icon: MessageCircle },
];

interface AppServiceStripProps {
  activeLabel?: string;
}

export default function AppServiceStrip({
  activeLabel,
}: AppServiceStripProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeLabel;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-[#ff5630] bg-[#ff5630] text-white"
                  : "theme-chip hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

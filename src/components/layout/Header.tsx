"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Compass,
  MapPinned,
  Menu,
  ShoppingBag,
  User,
} from "lucide-react";
import { MobileMenu } from "../ui/MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import CartComponent from "@/components/payment/CartComponent";
import { getAccountRoute } from "@/lib/auth-routing";
import { getSurfaceHref } from "@/lib/app-surface";
import ThemeToggle from "./ThemeToggle";
import SiteLogo from "./SiteLogo";

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{ label: string; href: string; description: string }>;
};

const navGroups: NavGroup[] = [
  {
    label: "Explore",
    icon: Compass,
    items: [
      {
        label: "Destinations",
        href: "/travel-guide",
        description: "Cities, parks, and places worth the trip.",
      },
      {
        label: "Stays",
        href: "/accommodation",
        description: "Hotels, lodges, camps, and guest houses.",
      },
      {
        label: "Experiences",
        href: "/activities",
        description: "Things to do across Zimbabwe.",
      },
      {
        label: "Restaurants",
        href: "/restaurants",
        description: "Dining worth adding to the itinerary.",
      },
      {
        label: "Ask a Local",
        href: "/community-guides",
        description: "Local guidance when you want sharper context.",
      },
    ],
  },
  {
    label: "Plan",
    icon: MapPinned,
    items: [
      {
        label: "Trip Planner",
        href: "/trip-planner",
        description: "Build and organize your itinerary in one studio.",
      },
      {
        label: "Transport",
        href: "/transport",
        description: "Cars, buses, taxis, and route planning.",
      },
      {
        label: "Flights",
        href: "/transport/flights",
        description: "Flight routing and air travel options.",
      },
      {
        label: "Events",
        href: "/events",
        description: "Tickets, festivals, and live dates.",
      },
    ],
  },
];

function DesktopDropdown({
  group,
  isOpen,
  onToggle,
  onClose,
}: {
  group: NavGroup;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const Icon = group.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black/68 transition hover:bg-black/[0.045] hover:text-black dark:text-white/72 dark:hover:bg-white/8 dark:hover:text-white"
        aria-expanded={isOpen}
      >
        <Icon className="h-4 w-4 text-[#ff7352]" />
        <span>{group.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.9rem)] z-50 w-[22rem] rounded-[28px] border border-black/10 bg-white/96 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111111]/96 dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="mb-2 px-3 pt-2">
            <div className="text-xs uppercase tracking-[0.24em] text-black/35 dark:text-white/35">
              {group.label}
            </div>
          </div>
          <div className="grid gap-1">
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="rounded-[22px] px-3 py-3 transition hover:bg-black/[0.045] dark:hover:bg-white/6"
              >
                <div className="text-sm font-semibold text-black dark:text-white">
                  {item.label}
                </div>
                <div className="mt-1 text-sm leading-5 text-black/56 dark:text-white/54">
                  {item.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const accountRoute = getAccountRoute(user);

  const userInitials = useMemo(() => {
    if (!user) return "";
    return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-[120] border-b border-black/10 bg-white/88 backdrop-blur-xl dark:border-white/10 dark:bg-[#070707]/88">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsMobileMenuOpen(true);
              }}
              className="relative z-[130] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#2a1614] text-[#ff7352] transition hover:bg-[#351b18] md:hidden"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="inline-flex items-center">
              <SiteLogo
                width={128}
                height={40}
                className="h-9 w-auto sm:h-10"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {navGroups.map((group) => (
              <DesktopDropdown
                key={group.label}
                group={group}
                isOpen={openGroup === group.label}
                onToggle={() =>
                  setOpenGroup((current) =>
                    current === group.label ? null : group.label,
                  )
                }
                onClose={() => setOpenGroup(null)}
              />
            ))}

            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black/68 transition hover:bg-black/[0.045] hover:text-black dark:text-white/72 dark:hover:bg-white/8 dark:hover:text-white"
            >
              Marketplace
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {!user ? (
              <>
                <Link
                  href={getSurfaceHref("explorer", "/login")}
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black/72 transition hover:bg-black/[0.045] hover:text-black dark:text-white/78 dark:hover:bg-white/8 dark:hover:text-white md:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  href={getSurfaceHref("explorer", "/register")}
                  className="hidden items-center gap-2 rounded-full bg-[#ff5630] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff6f4d] md:inline-flex"
                >
                  Create account
                </Link>
              </>
            ) : null}

            <ThemeToggle />

            <div className="hidden md:block">
              <CartComponent />
            </div>

            <Link
              href={user ? accountRoute : getSurfaceHref("explorer", "/login")}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 px-3 text-black/80 transition hover:bg-white dark:border-white/10 dark:bg-[#161616] dark:text-white/85 dark:hover:bg-[#1d1d1d] md:px-4"
              aria-label={user ? "Open workspace" : "Sign in"}
            >
              {user ? (
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f3f87] text-xs font-semibold text-white">
                    {userInitials}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user.firstName}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden text-sm font-medium md:inline">
                    Account
                  </span>
                </span>
              )}
            </Link>

            <Link
              href="/checkout"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff5630] text-white transition hover:bg-[#ff6f4d] md:hidden"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

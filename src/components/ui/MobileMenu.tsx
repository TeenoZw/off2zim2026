"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Compass,
  MapPinned,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { getSurfaceHref } from "@/lib/app-surface";
import SiteLogo from "../layout/SiteLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    label: "Explore",
    icon: Compass,
    links: [
      { label: "Destinations", href: "/travel-guide" },
      { label: "Stays", href: "/accommodation" },
      { label: "Experiences", href: "/activities" },
      { label: "Restaurants", href: "/restaurants" },
      { label: "Ask a Local", href: "/community-guides" },
    ],
  },
  {
    label: "Plan",
    icon: MapPinned,
    links: [
      { label: "Trip Planner", href: "/trip-planner" },
      { label: "Transport", href: "/transport" },
      { label: "Flights", href: "/transport/flights" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    label: "More",
    icon: Store,
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Featured", href: "/featured-section" },
      { label: "Provider access", href: getSurfaceHref("provider", "/login") },
    ],
  },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState("Explore");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setOpenSection("Explore");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[190] bg-black/70 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <div
        className="fixed inset-y-0 left-0 z-[200] flex w-full max-w-[25rem] flex-col bg-[#090909] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 pb-4 pt-5">
          <SiteLogo width={122} height={38} className="h-9 w-auto" priority />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2a1614] text-[#ff7352]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
          <div className="border-b border-white/10 pb-5">
            <div className="text-xs uppercase tracking-[0.28em] text-white/42">
              Explore | Experience | Enjoy
            </div>
            <div className="mt-3 text-2xl font-semibold leading-tight">
              Everything you need for the trip, grouped properly.
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isSectionOpen = openSection === section.label;

              return (
                <div
                  key={section.label}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSection((current) =>
                        current === section.label ? "" : section.label,
                      )
                    }
                    className="flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={isSectionOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a1614] text-[#ff7352]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-base font-semibold text-white">
                        {section.label}
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/45 transition ${
                        isSectionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isSectionOpen ? (
                    <div className="grid gap-1 pb-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onClose}
                          className="rounded-[18px] px-3 py-3 text-sm font-medium text-white/84 transition hover:bg-white/6 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href={getSurfaceHref("explorer", "/login")}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white/90"
            >
              Sign in
            </Link>
            <Link
              href={getSurfaceHref("explorer", "/register")}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#ff5630] px-4 py-3 text-sm font-semibold text-white"
            >
              Create account
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/62">
            <CalendarDays className="h-4 w-4 text-[#ff7352]" />
            Book, plan, and move from one place.
          </div>

          <Link
            href="/checkout"
            onClick={onClose}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/84"
          >
            <ShoppingBag className="h-4 w-4 text-[#ff7352]" />
            View basket
          </Link>
        </div>
      </div>
    </>
  );
}

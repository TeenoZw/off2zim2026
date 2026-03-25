"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Compass, MessageCircle, ShieldCheck, X } from "lucide-react";
import SiteLogo from "../layout/SiteLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/travel-guide" },
  { label: "Stays", href: "/accommodation" },
  { label: "Experiences", href: "/activities" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Ask a Local", href: "/community-guides" },
  { label: "Provider Dashboard", href: "/provider-dashboard" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <div className="fixed left-0 top-0 z-50 h-full w-[88vw] max-w-sm border-r border-white/10 bg-[#111111] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:hidden">
        <div className="flex items-center justify-between">
          <SiteLogo width={120} height={38} className="h-9 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2a1614] text-[#ff7352]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-[#1a1a1a] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">
            Off2Zim
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Explore Zimbabwe</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Explore, experience, and enjoy Zimbabwe through trusted stays,
            experiences, planning tools, and local guidance.
          </p>
        </div>

        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
              <span className="text-white/35">/</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-3">
          <div className="rounded-[24px] bg-[#161616] p-4">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <Compass className="h-4 w-4 text-[#ff7352]" />
              Explore with confidence
            </div>
          </div>
          <div className="rounded-[24px] bg-[#161616] p-4">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <ShieldCheck className="h-4 w-4 text-[#7ddf8c]" />
              Verified provider trust
            </div>
          </div>
          <div className="rounded-[24px] bg-[#161616] p-4">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <CalendarDays className="h-4 w-4 text-[#5aa7ff]" />
              Plan with less friction
            </div>
          </div>
          <div className="rounded-[24px] bg-[#161616] p-4">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <MessageCircle className="h-4 w-4 text-[#ffc247]" />
              Local guidance on demand
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

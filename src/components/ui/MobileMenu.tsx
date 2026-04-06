"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
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
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[190] bg-black/72 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <div
        className="fixed inset-y-0 left-0 z-[200] flex w-full max-w-[26rem] flex-col border-r border-white/10 bg-[#0b0b0b] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:hidden"
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
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">
              Explore | Experience | Enjoy
            </p>
            <h2 className="mt-3 text-[1.9rem] font-semibold leading-tight">
              Move through Off2Zim without friction
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/62">
              Trusted stays, destination planning, and local guidance in one
              fluid mobile shell.
            </p>
          </div>

          <nav className="mt-5 space-y-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-base font-medium text-white/84 transition hover:text-white"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 text-white/32" />
              </Link>
            ))}
          </nav>

          <div className="mt-6 grid gap-3">
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white/90"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#ff5630] px-4 py-3 text-sm font-semibold text-white"
            >
              Create account
            </Link>
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3 text-sm text-white/72">
              <Compass className="h-4 w-4 text-[#ff7352]" />
              Explore with confidence
            </div>
            <div className="flex items-center gap-3 text-sm text-white/72">
              <ShieldCheck className="h-4 w-4 text-[#7ddf8c]" />
              Verified providers and clearer trust
            </div>
            <div className="flex items-center gap-3 text-sm text-white/72">
              <CalendarDays className="h-4 w-4 text-[#5aa7ff]" />
              Planning that feels lighter on mobile
            </div>
            <div className="flex items-center gap-3 text-sm text-white/72">
              <MessageCircle className="h-4 w-4 text-[#ffc247]" />
              Local guidance when you need it
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

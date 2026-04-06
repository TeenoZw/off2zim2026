"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu, ShoppingBag, User } from "lucide-react";
import { MobileMenu } from "../ui/MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import CartComponent from "@/components/payment/CartComponent";
import ThemeToggle from "./ThemeToggle";
import SiteLogo from "./SiteLogo";

const navItems = [
  { label: "Destinations", href: "/travel-guide" },
  { label: "Stays", href: "/accommodation" },
  { label: "Things To Do", href: "/activities" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Ask a Local", href: "/community-guides" },
];

export default function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[120] border-b border-black/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070707]/85">
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

            <SiteLogo
              width={128}
              height={40}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-black/65 transition hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/featured-section"
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 md:inline-flex"
            >
              <CalendarDays className="h-4 w-4 text-[#ff7352]" />
              Featured
            </Link>

            <ThemeToggle />

            <div className="hidden md:block">
              <CartComponent />
            </div>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 px-3 text-black/80 transition hover:bg-white dark:border-white/10 dark:bg-[#161616] dark:text-white/85 dark:hover:bg-[#1d1d1d]"
              aria-label={user ? "Open dashboard" : "Sign in"}
            >
              {user ? (
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f3f87] text-xs font-semibold text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user.firstName}
                  </span>
                </span>
              ) : (
                <User className="h-5 w-5" />
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

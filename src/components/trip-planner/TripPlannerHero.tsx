"use client";

import { useCallback } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function TripPlannerHero() {
  const handleStartItinerary = useCallback(() => {
    const target = document.getElementById("planner-explore");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
    }, 250);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
      <div className="theme-panel-strong overflow-hidden rounded-[34px] md:rounded-[38px]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="order-1 p-5 md:p-8 lg:p-10">
            <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
              Trip Planner
            </div>
            <h1 className="theme-heading mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Shape a Zimbabwe itinerary with clarity, confidence, and style
            </h1>
            <p className="theme-muted mt-4 max-w-2xl text-sm leading-6 md:text-lg md:leading-7">
              Search stays, experiences, and transport, then organize dates,
              budget, and logistics in one polished workspace designed for real
              trips.
            </p>

            <div className="theme-panel mt-6 rounded-[28px] p-4 md:mt-8 md:rounded-[30px]">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
                <div className="relative">
                  <MapPinIcon className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm"
                  />
                </div>
                <div className="relative">
                  <CalendarIcon className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input type="date" className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm" />
                </div>
                <div className="relative">
                  <CalendarIcon className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input type="date" className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm" />
                </div>
                <div className="relative">
                  <UsersIcon className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <select className="theme-input w-full rounded-2xl py-3 pl-12 pr-4 text-sm">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/trip-planner/search"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search stays, experiences, and transport
                </Link>
                <button className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                  <ShareIcon className="h-5 w-5" />
                  View sample itinerary
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
              <button
                onClick={handleStartItinerary}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
              >
                <PlusIcon className="h-5 w-5" />
                Start your itinerary
              </button>
              <button className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                <CurrencyDollarIcon className="h-5 w-5" />
                Preview budget tools
              </button>
            </div>
          </div>

          <div
            className="order-2 min-h-[240px] bg-cover bg-center lg:min-h-[320px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/destinations/eastern-highlands.jpg')",
            }}
          >
            <div className="flex h-full items-end p-4 md:p-6 lg:hidden">
              <div className="grid w-full grid-cols-3 gap-3 rounded-[24px] border border-white/15 bg-black/45 p-3 backdrop-blur">
                <div className="rounded-[18px] bg-white/10 p-3 text-white">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                    Mood
                  </div>
                  <div className="mt-1 text-sm font-semibold">Scenic</div>
                </div>
                <div className="rounded-[18px] bg-white/10 p-3 text-white">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                    Focus
                  </div>
                  <div className="mt-1 text-sm font-semibold">Multi-stop</div>
                </div>
                <div className="rounded-[18px] bg-white/10 p-3 text-white">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                    Start
                  </div>
                  <div className="mt-1 text-sm font-semibold">$40</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="theme-card-soft rounded-[26px] p-4 md:p-5">
          <CalendarIcon className="h-7 w-7 text-[#ff7352]" />
          <h3 className="theme-heading mt-4 text-lg font-semibold">Visual timeline</h3>
          <p className="theme-muted mt-2 text-sm">Organize days, dates, and trip flow in a way that stays easy to follow.</p>
        </div>
        <div className="theme-card-soft rounded-[26px] p-4 md:p-5">
          <CurrencyDollarIcon className="h-7 w-7 text-[#7ddf8c]" />
          <h3 className="theme-heading mt-4 text-lg font-semibold">Budget tracker</h3>
          <p className="theme-muted mt-2 text-sm">See costs update as your itinerary grows so spending stays visible.</p>
        </div>
        <div className="theme-card-soft rounded-[26px] p-4 md:p-5">
          <MapPinIcon className="h-7 w-7 text-[#5aa7ff]" />
          <h3 className="theme-heading mt-4 text-lg font-semibold">Logistics view</h3>
          <p className="theme-muted mt-2 text-sm">Catch timing gaps, overlaps, and routing issues before they become problems.</p>
        </div>
        <div className="theme-card-soft rounded-[26px] p-4 md:p-5">
          <ShareIcon className="h-7 w-7 text-[#ffc247]" />
          <h3 className="theme-heading mt-4 text-lg font-semibold">Shareable plans</h3>
          <p className="theme-muted mt-2 text-sm">Export or share an itinerary without leaving the planner flow.</p>
        </div>
      </div>
    </section>
  );
}

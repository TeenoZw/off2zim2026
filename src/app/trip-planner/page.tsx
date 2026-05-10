import React from "react";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import TripPlannerBuilder from "../../components/trip-planner/TripPlannerBuilder";

export const metadata = {
  title: "Planner Studio - Off2Zim | Build Your Zimbabwe Itinerary",
  description:
    "Use the Off2Zim planner to build, organize, and export a Zimbabwe itinerary in one place.",
};

export default function TripPlannerPage() {
  return (
    <div className="theme-page">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Trip planner
              </div>
              <h1 className="theme-heading mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
                Build your Zimbabwe itinerary, day by day
              </h1>
              <p className="theme-muted mt-4 max-w-xl text-sm leading-7 md:text-base">
                Add stays, activities, transport, and dining into one timeline. Reorder your plans, track your budget, book in one checkout, or export a PDF to share.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-lg font-bold">All in one</div>
                  <div className="theme-subtle text-xs mt-0.5">Stays, activities & transport</div>
                </div>
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-lg font-bold">Live budget</div>
                  <div className="theme-subtle text-xs mt-0.5">Track spend as you plan</div>
                </div>
                <div className="theme-panel-soft rounded-[20px] px-4 py-3">
                  <div className="theme-heading text-lg font-bold">One checkout</div>
                  <div className="theme-subtle text-xs mt-0.5">Book the whole itinerary</div>
                </div>
              </div>
            </div>
            <div
              className="min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url('/images/hwange-bush-camp-548548-original.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-2 pt-0 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Trip Planner" />
      </section>
      <TripPlannerBuilder />
    </div>
  );
}

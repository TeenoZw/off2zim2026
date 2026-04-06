import React from "react";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import TripPlannerBuilder from "../../components/trip-planner/TripPlannerBuilder";

export const metadata = {
  title: "Planner Studio - Off2Zim | Build Your Zimbabwe Itinerary",
  description:
    "Use the Off2Zim planner studio to build, organize, and export a polished Zimbabwe itinerary in one focused workspace.",
};

export default function TripPlannerPage() {
  return (
    <div className="theme-page">
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Trip Planner" />
      </section>
      <TripPlannerBuilder />
    </div>
  );
}

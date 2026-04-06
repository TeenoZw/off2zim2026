import React from "react";
import TripPlannerBuilder from "../../components/trip-planner/TripPlannerBuilder";

export const metadata = {
  title: "Planner Studio - Off2Zim | Build Your Zimbabwe Itinerary",
  description:
    "Use the Off2Zim planner studio to build, organize, and export a polished Zimbabwe itinerary in one focused workspace.",
};

export default function TripPlannerPage() {
  return (
    <div className="theme-page">
      <TripPlannerBuilder />
    </div>
  );
}

import React from "react";
import TripPlannerHero from "../../components/trip-planner/TripPlannerHero";
import TripPlannerBuilder from "../../components/trip-planner/TripPlannerBuilder";
import TripPlannerFeatures from "../../components/trip-planner/TripPlannerFeatures";

export const metadata = {
  title: "Trip Planner - Off2Zim | Build Your Zimbabwe Itinerary",
  description:
    "Build a polished Zimbabwe itinerary with timeline planning, budget tracking, and smarter trip organization in one place.",
};

export default function TripPlannerPage() {
  return (
    <div className="theme-page">
      <TripPlannerHero />
      <TripPlannerBuilder />
      <TripPlannerFeatures />
    </div>
  );
}

import React from "react";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import TripPlannerBuilder from "../../components/trip-planner/TripPlannerBuilder";
import type { TripPlannerRouteSelections } from "@/components/trip-planner/TripPlannerBuilder";

export const metadata = {
  title: "Planner Studio - Off2Zim | Build Your Zimbabwe Itinerary",
  description:
    "Use the Off2Zim planner to build, organize, and export a Zimbabwe itinerary in one place.",
};

type TripPlannerSearchParams = Record<string, string | string[] | undefined>;

function getSearchParam(
  searchParams: TripPlannerSearchParams | undefined,
  key: string
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function getRouteSelections(
  searchParams: TripPlannerSearchParams | undefined
): TripPlannerRouteSelections {
  const startDate =
    getSearchParam(searchParams, "startDate") ||
    getSearchParam(searchParams, "departDate") ||
    getSearchParam(searchParams, "pickupDate") ||
    getSearchParam(searchParams, "checkIn") ||
    undefined;
  const endDate =
    getSearchParam(searchParams, "endDate") ||
    getSearchParam(searchParams, "returnDate") ||
    getSearchParam(searchParams, "dropoffDate") ||
    getSearchParam(searchParams, "checkOut") ||
    undefined;
  const travelersValue =
    getSearchParam(searchParams, "travelers") ||
    getSearchParam(searchParams, "passengers") ||
    getSearchParam(searchParams, "guests");
  const budgetValue =
    getSearchParam(searchParams, "budget") ||
    getSearchParam(searchParams, "totalBudget");
  const titleValue = getSearchParam(searchParams, "title");
  const searchValue =
    getSearchParam(searchParams, "search") ||
    getSearchParam(searchParams, "destination");
  const travelers = travelersValue ? Number(travelersValue) : undefined;
  const totalBudget = budgetValue ? Number(budgetValue) : undefined;

  return {
    isShared: Boolean(getSearchParam(searchParams, "shared")),
    meta: {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      ...(travelers && travelers > 0 ? { travelers } : {}),
      ...(titleValue?.trim()
        ? { title: titleValue.trim() }
        : searchValue?.trim()
          ? { title: `${searchValue.trim()} itinerary` }
          : {}),
    },
    totalBudget:
      totalBudget !== undefined && Number.isFinite(totalBudget) && totalBudget >= 0
        ? totalBudget
        : undefined,
  };
}

export default function TripPlannerPage({
  searchParams,
}: {
  searchParams?: TripPlannerSearchParams;
}) {
  const routeSelections = getRouteSelections(searchParams);

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
      <TripPlannerBuilder routeSelections={routeSelections} />
    </div>
  );
}

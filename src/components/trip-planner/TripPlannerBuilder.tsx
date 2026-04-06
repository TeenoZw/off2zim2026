"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, LayoutGrid, PanelRightOpen, Plus } from "lucide-react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import {
  getBudgetBreakdown,
  getExpandedTripMeta,
  getItemDateLabel,
  getItemRangeLabel,
  itemTouchesDate,
  getPlannerDays,
  getTripTotals,
  PlannerSectionId,
} from "@/lib/trip-planner/planner";
import PlannerAddDrawer from "./planner/PlannerAddDrawer";
import PlannerDayBoard from "./planner/PlannerDayBoard";
import PlannerOverviewSection from "./planner/PlannerOverviewSection";

interface NoticeState {
  tone: "success" | "error";
  message: string;
}

export default function TripPlannerBuilder() {
  const {
    items,
    meta,
    totalBudget,
    isHydrated,
    removeItem,
    clearItems,
    reorderItems,
    setTotalBudget,
    addCatalogItem,
    updateMeta,
    loadSharedPlan,
  } = useTripPlanner();
  const [activeSection, setActiveSection] = useState<PlannerSectionId>("overview");
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerDate, setDrawerDate] = useState<string | undefined>(meta.startDate);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const days = useMemo(() => getPlannerDays(items, meta), [items, meta]);
  const totals = useMemo(() => getTripTotals(items, totalBudget), [items, totalBudget]);
  const budgetBreakdown = useMemo(() => getBudgetBreakdown(items), [items]);

  useEffect(() => {
    if (!days.length) {
      setActiveDay(null);
      return;
    }

    if (!activeDay || !days.some((day) => day.key === activeDay)) {
      setActiveDay(days[0].key);
    }
  }, [activeDay, days]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!isHydrated) return;
    const sharedData = new URLSearchParams(window.location.search).get("shared");
    if (!sharedData) return;

    try {
      const parsed = JSON.parse(atob(sharedData));
      loadSharedPlan({
        items: Array.isArray(parsed.items) ? parsed.items : [],
        totalBudget:
          typeof parsed.totalBudget === "number" ? parsed.totalBudget : 2000,
        meta:
          parsed.meta && typeof parsed.meta === "object"
            ? parsed.meta
            : {
                title: "Shared Zimbabwe Journey",
                travelers: 2,
              },
      });
      setNotice({
        tone: "success",
        message: "Shared itinerary loaded into your planner.",
      });
    } catch {
      setNotice({
        tone: "error",
        message: "That shared itinerary link could not be loaded.",
      });
    }
  }, [isHydrated, loadSharedPlan]);

  const openAddDrawer = (date?: string) => {
    setDrawerDate(date || activeDay || meta.startDate);
    setIsDrawerOpen(true);
  };

  const handleExport = async () => {
    if (!exportRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: "#f6efe8",
        useCORS: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = margin;

      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight + margin;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save("off2zim-itinerary.pdf");
      setNotice({
        tone: "success",
        message: "Branded itinerary PDF exported.",
      });
    } catch {
      setNotice({
        tone: "error",
        message: "The PDF export could not be generated right now.",
      });
    }
  };

  const handleShare = async () => {
    const payload = btoa(
      JSON.stringify({
        items,
        totalBudget,
        meta,
      })
    );
    const url = `${window.location.origin}/trip-planner?shared=${payload}`;
    const canUseNativeShare = typeof navigator.share === "function";

    try {
      if (canUseNativeShare) {
        await navigator.share({
          title: meta.title || "Off2Zim itinerary",
          text: "Explore my Off2Zim itinerary.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }

      setNotice({
        tone: "success",
        message: canUseNativeShare
          ? "Itinerary share sheet opened."
          : "Share link copied to clipboard.",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setNotice({
        tone: "error",
        message: "Sharing did not complete. Please try again.",
      });
    }
  };

  const handleReset = () => {
    clearItems();
    setNotice({
      tone: "success",
      message: "Planner cleared. Your trip details were kept so you can start again quickly.",
    });
  };

  const handleDeleteDay = (dayKey: string) => {
    const remainingItems = items.filter((item) => !itemTouchesDate(item, dayKey));
    reorderItems(remainingItems);
    updateMeta({
      excludedDates: Array.from(new Set([...(meta.excludedDates || []), dayKey])),
    });
    setNotice({
      tone: "success",
      message: "That day was removed from the board.",
    });
  };

  return (
    <section
      id="planner-explore"
      tabIndex={-1}
      className="section-sm scroll-mt-24 pt-6 focus:outline-none md:pt-8"
      aria-label="Itinerary builder explore section"
    >
      <div className="container">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="theme-label text-xs uppercase tracking-[0.26em]">
              Planner studio
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold md:text-4xl">
              Your itinerary workspace
            </h2>
            <p className="theme-muted mt-3 max-w-2xl text-sm leading-6 md:text-base">
              Build the route, shape each day, manage costs, and export the trip
              from one focused planning studio.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                activeSection === "overview"
                  ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                  : "theme-button-secondary"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveSection("board")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                activeSection === "board"
                  ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                  : "theme-button-secondary"
              }`}
            >
              <PanelRightOpen className="h-4 w-4" />
              Day board
            </button>
            <button
              onClick={() => openAddDrawer()}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ff5630]/20 transition hover:bg-[#e44c28]"
            >
              <Plus className="h-4 w-4" />
              Add item
            </button>
          </div>
        </div>

        {notice ? (
          <div
            className={`mb-5 flex items-center gap-3 rounded-[24px] border px-4 py-3 text-sm ${
              notice.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {notice.message}
          </div>
        ) : null}

        <div className="space-y-5 md:space-y-6">
          {activeSection === "overview" ? (
            <PlannerOverviewSection
              items={items}
              meta={meta}
              totalBudget={totalBudget}
              onMetaChange={updateMeta}
              onBudgetChange={setTotalBudget}
              onContinueToBoard={() => setActiveSection("board")}
              onOpenAddDrawer={openAddDrawer}
            />
          ) : (
            <PlannerDayBoard
              items={items}
              meta={meta}
              totalBudget={totalBudget}
              activeDay={activeDay}
              onActiveDayChange={setActiveDay}
              onOpenAddDrawer={openAddDrawer}
              onRemoveItem={removeItem}
              onDeleteDay={handleDeleteDay}
              onShare={handleShare}
              onExport={handleExport}
              onReset={handleReset}
            />
          )}
        </div>

        <PlannerAddDrawer
          isOpen={isDrawerOpen}
          defaultDate={drawerDate}
          onClose={() => setIsDrawerOpen(false)}
          onAddItem={(item, overrides) => {
            const added = addCatalogItem(item, overrides);
            updateMeta(getExpandedTripMeta(meta, added));
            setActiveSection("board");
            setActiveDay(overrides?.date || added.date);
            setNotice({
              tone: "success",
              message: `${added.title} was added to the itinerary.`,
            });
            return added;
          }}
        />

        <div className="pointer-events-none fixed left-[-9999px] top-0 opacity-0">
          <div
            ref={exportRef}
            className="w-[900px] bg-[#f6efe8] px-10 py-10 text-slate-950"
          >
            <div className="rounded-[32px] bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#26140f] px-8 py-8 text-white">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-[420px]">
                  <img
                    src="/logos/logo-darkmode.png"
                    alt="Off2Zim"
                    className="h-20 w-auto object-contain"
                  />
                  <p className="mt-6 text-xs uppercase tracking-[0.32em] text-white/65">
                    Explore | Experience | Enjoy
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold leading-tight">
                    {meta.title || "Off2Zim Itinerary"}
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    A branded trip summary with your route, daily plan, and
                    budget overview for smoother travel coordination.
                  </p>
                </div>

                <div className="grid min-w-[250px] gap-3">
                  <div className="rounded-[24px] bg-white/10 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/55">
                      Travel window
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {meta.startDate || "TBD"} to {meta.endDate || "TBD"}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-white/10 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/55">
                      Travelers
                    </div>
                    <div className="mt-2 text-lg font-semibold">{meta.travelers}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 grid-cols-4">
              <div className="rounded-[28px] bg-white px-5 py-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Budget
                </div>
                <div className="mt-2 text-3xl font-semibold">${totalBudget}</div>
              </div>
              <div className="rounded-[28px] bg-white px-5 py-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Planned spend
                </div>
                <div className="mt-2 text-3xl font-semibold">${totals.totalCost}</div>
              </div>
              <div className="rounded-[28px] bg-white px-5 py-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Remaining
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {totals.remainingBudget < 0 ? "-" : ""}${Math.abs(totals.remainingBudget)}
                </div>
              </div>
              <div className="rounded-[28px] bg-white px-5 py-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Destinations
                </div>
                <div className="mt-2 text-3xl font-semibold">{totals.destinations}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] bg-white px-6 py-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Day-by-day itinerary
                </div>
                <div className="mt-4 space-y-4">
                  {days.map((day, index) => (
                    <section key={day.key} className="rounded-[24px] bg-[#f7f2ee] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            Day {index + 1}
                          </div>
                          <div className="mt-1 text-xl font-semibold">{day.label}</div>
                        </div>
                        <div className="text-sm text-slate-500">
                          {day.items.length} item{day.items.length === 1 ? "" : "s"}
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {day.items.length ? (
                          day.items.map((item) => (
                            <div
                              key={`${day.key}-${item.id}`}
                              className="rounded-[20px] bg-white px-4 py-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    {item.category}
                                  </div>
                                  <div className="mt-1 text-lg font-semibold">
                                    {item.title}
                                  </div>
                                </div>
                                <div className="text-right text-sm font-semibold">
                                  ${item.cost}
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-slate-600">
                                <div>{item.location}</div>
                                <div>{getItemDateLabel(item)}</div>
                                <div>
                                  {item.type === "accommodation"
                                    ? getItemRangeLabel(item, day.key)
                                    : `${item.startTime} - ${item.endTime}`}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[20px] bg-white px-4 py-4 text-sm text-slate-500">
                            No items planned for this day.
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] bg-white px-6 py-6 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Budget breakdown
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Stays</span>
                      <span className="font-semibold">${budgetBreakdown.accommodation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Experiences</span>
                      <span className="font-semibold">${budgetBreakdown.activity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Transport</span>
                      <span className="font-semibold">${budgetBreakdown.transport}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Dining</span>
                      <span className="font-semibold">${budgetBreakdown.dining}</span>
                    </div>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#f2ded6]">
                    <div
                      className="h-full rounded-full bg-[#ff5630]"
                      style={{ width: `${Math.min(totals.budgetPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {Math.round(totals.budgetPercentage)}% of the budget is currently allocated.
                  </div>
                </div>

                <div className="rounded-[28px] bg-white px-6 py-6 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Planner notes
                  </div>
                  <div className="mt-3 text-sm leading-7 text-slate-700">
                    {meta.notes || "No planning notes added yet."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

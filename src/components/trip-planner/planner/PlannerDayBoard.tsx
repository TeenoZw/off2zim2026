"use client";

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DaySegment,
  getBudgetBreakdown,
  getItemDateLabel,
  getItemTimeLabel,
  getItemRangeLabel,
  getPlannerDays,
  getSectionCounts,
  getSegmentForTime,
  getStatusTone,
  getTripTotals,
} from "@/lib/trip-planner/planner";
import {
  PlannerScheduleDefaults,
  TripPlannerItem,
  TripPlannerMeta,
} from "@/types/trip-planner";

const segments: Array<{ key: DaySegment; label: string; range: string }> = [
  { key: "morning", label: "Morning", range: "06:00 - 11:59" },
  { key: "afternoon", label: "Afternoon", range: "12:00 - 16:59" },
  { key: "evening", label: "Evening", range: "17:00 onwards" },
];

const segmentDefaults: Record<
  DaySegment,
  Required<Pick<PlannerScheduleDefaults, "startTime" | "endTime">>
> = {
  morning: { startTime: "09:00", endTime: "11:00" },
  afternoon: { startTime: "13:00", endTime: "16:00" },
  evening: { startTime: "18:00", endTime: "20:00" },
};

interface PlannerDayBoardProps {
  items: TripPlannerItem[];
  meta: TripPlannerMeta;
  totalBudget: number;
  activeDay: string | null;
  onActiveDayChange: (dayKey: string) => void;
  onOpenAddDrawer: (date?: string, defaults?: PlannerScheduleDefaults) => void;
  onRemoveItem: (itemId: string) => void;
  onDeleteDay: (dayKey: string) => void;
  onShare: () => void;
  onExport: () => void;
  onReset: () => void;
}

export default function PlannerDayBoard({
  items,
  meta,
  totalBudget,
  activeDay,
  onActiveDayChange,
  onOpenAddDrawer,
  onRemoveItem,
  onDeleteDay,
  onShare,
  onExport,
  onReset,
}: PlannerDayBoardProps) {
  const days = getPlannerDays(items, meta);
  const safeDayKey =
    activeDay && days.some((day) => day.key === activeDay)
      ? activeDay
      : days[0]?.key || null;
  const selectedDay = days.find((day) => day.key === safeDayKey) || null;
  const totals = getTripTotals(items, totalBudget);
  const counts = getSectionCounts(items);
  const budgetBreakdown = getBudgetBreakdown(items);
  const openSegmentDrawer = (date: string, segment: DaySegment) => {
    onOpenAddDrawer(date, {
      date,
      ...segmentDefaults[segment],
    });
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="theme-panel rounded-[30px] p-4 shadow-xl md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="theme-label text-xs uppercase tracking-[0.24em]">
              Days
            </p>
            <h3 className="theme-heading mt-2 text-xl font-semibold">
              Day-by-day board
            </h3>
          </div>
          <button
            onClick={() => onOpenAddDrawer(selectedDay?.key)}
            className="rounded-full bg-[#ff5630] p-2 text-white"
            aria-label="Add new planner item"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {days.length === 0 ? (
            <div className="theme-card-soft rounded-[24px] p-4 text-sm">
              Add start and end dates in the overview to generate your daily
              planning board.
            </div>
          ) : (
            days.map((day, index) => (
              <div
                key={day.key}
                className={`rounded-[24px] border p-3 transition ${
                  safeDayKey === day.key
                    ? "border-[#ff5630] bg-[#fff1eb] dark:border-[#ff7352] dark:bg-[#241511]"
                    : "border-black/10 bg-black/[0.02] hover:border-black/20 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onActiveDayChange(day.key)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="theme-subtle text-xs uppercase tracking-[0.22em]">
                      Day {index + 1}
                    </div>
                    <div className="theme-heading mt-2 font-semibold">
                      {day.shortLabel}
                    </div>
                    <div className="theme-muted mt-2 text-sm">
                      {day.items.length} item{day.items.length === 1 ? "" : "s"}
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteDay(day.key)}
                    className="theme-button-secondary rounded-full p-2"
                    aria-label={`Delete day ${index + 1}`}
                    title="Delete this day board"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <div className="theme-panel rounded-[30px] p-4 shadow-xl md:p-6">
        {selectedDay ? (
          <>
            <div className="flex flex-col gap-3 border-b border-black/10 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="theme-label text-xs uppercase tracking-[0.24em]">
                  Organize
                </p>
                <h3 className="theme-heading mt-2 text-2xl font-semibold">
                  {selectedDay.label}
                </h3>
                <p className="theme-muted mt-2 text-sm">
                  Arrange the day by time block, fill open moments, and keep the
                  experience balanced.
                </p>
              </div>
              <button
                onClick={() => onOpenAddDrawer(selectedDay.key)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add to this day
              </button>
              <button
                onClick={() => onDeleteDay(selectedDay.key)}
                className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              >
                <Trash2 className="h-4 w-4" />
                Delete day
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {segments.map((segment) => {
                const segmentItems = selectedDay.items.filter(
                  (item) => getSegmentForTime(item.startTime) === segment.key
                );

                return (
                  <div
                    key={segment.key}
                    className="theme-card-soft rounded-[26px] p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="theme-heading font-semibold">
                          {segment.label}
                        </h4>
                        <p className="theme-muted mt-1 text-xs">{segment.range}</p>
                      </div>
                      <button
                        onClick={() => openSegmentDrawer(selectedDay.key, segment.key)}
                        className="theme-button-secondary rounded-full p-2"
                        aria-label={`Add item to ${segment.label.toLowerCase()}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {segmentItems.length === 0 ? (
                      <button
                        onClick={() => openSegmentDrawer(selectedDay.key, segment.key)}
                        className="mt-4 flex w-full items-center justify-between rounded-[22px] border border-dashed border-black/15 bg-white/50 px-4 py-4 text-left text-sm transition hover:border-[#ff5630] hover:text-[#ff5630] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-[#ff7352]"
                      >
                        <span className="theme-muted">
                          Nothing planned here yet
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {segmentItems.map((item) => (
                          <article
                            key={item.id}
                            className="rounded-[22px] border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-[#111111]"
                          >
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-20 w-20 rounded-[18px] object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div
                                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(item.type)}`}
                                    >
                                      {item.category}
                                    </div>
                                    <h5 className="theme-heading mt-3 font-semibold">
                                      {item.title}
                                    </h5>
                                  </div>
                                  <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="theme-button-secondary rounded-full p-2"
                                    aria-label={`Remove ${item.title}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="theme-muted mt-3 flex flex-wrap gap-3 text-sm">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock3 className="h-4 w-4" />
                                    {getItemTimeLabel(item, selectedDay.key)}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {item.location}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    {getItemDateLabel(item)}
                                  </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-sm">
                                  <span className="theme-muted font-medium">
                                    {getItemRangeLabel(item, selectedDay.key)}
                                  </span>
                                  <span className="theme-heading font-semibold">
                                    ${item.cost}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1eb] dark:bg-[#241511]">
              <CalendarDays className="h-10 w-10 text-[#ff5630]" />
            </div>
            <h3 className="theme-heading mt-6 text-xl font-semibold">
              Your board will appear here
            </h3>
            <p className="theme-muted mx-auto mt-3 max-w-md text-sm leading-6">
              Set start and end dates in the overview, then add your first stay,
              experience, or transfer.
            </p>
          </div>
        )}
      </div>

      <aside className="theme-panel rounded-[30px] p-5 shadow-xl">
        <p className="theme-label text-xs uppercase tracking-[0.24em]">
          Confirm
        </p>
        <h3 className="theme-heading mt-2 text-xl font-semibold">
          Route summary
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="theme-card-soft rounded-[24px] p-4">
            <div className="theme-muted text-sm">Planned spend</div>
            <div className="theme-heading mt-2 text-2xl font-semibold">
              ${totals.totalCost}
            </div>
          </div>
          <div className="theme-card-soft rounded-[24px] p-4">
            <div className="theme-muted text-sm">Remaining budget</div>
            <div className="theme-heading mt-2 text-2xl font-semibold">
              {totals.remainingBudget < 0 ? "-" : ""}${Math.abs(totals.remainingBudget)}
            </div>
          </div>
          <div className="theme-card-soft rounded-[24px] p-4">
            <div className="theme-muted text-sm">Destinations</div>
            <div className="theme-heading mt-2 text-2xl font-semibold">
              {totals.destinations}
            </div>
          </div>
          <div className="theme-card-soft rounded-[24px] p-4">
            <div className="theme-muted text-sm">Experiences</div>
            <div className="theme-heading mt-2 text-2xl font-semibold">
              {counts.activities}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={onShare}
            className="theme-button-secondary flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
          >
            <Copy className="h-4 w-4" />
            Share itinerary
          </button>
          <button
            onClick={onExport}
            className="theme-button-secondary flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            Export summary
          </button>
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black"
          >
            <Trash2 className="h-4 w-4" />
            Clear planner
          </button>
        </div>

        <div className="theme-card-soft mt-5 rounded-[24px] p-4">
          <div className="theme-heading font-semibold">Route pulse</div>
          <ul className="theme-muted mt-3 space-y-2 text-sm">
            <li>{counts.stays} stay selections ready for review</li>
            <li>{counts.transport} transport items linked to the route</li>
            <li>{counts.dining} dining moments added to the itinerary</li>
            <li>{days.length} active day{days.length === 1 ? "" : "s"} in the board</li>
          </ul>
        </div>

        <div className="theme-card-soft mt-5 rounded-[24px] p-4">
          <div className="theme-heading font-semibold">Budget breakdown</div>
          <ul className="theme-muted mt-3 space-y-2 text-sm">
            <li>Stays: ${budgetBreakdown.accommodation}</li>
            <li>Experiences: ${budgetBreakdown.activity}</li>
            <li>Transport: ${budgetBreakdown.transport}</li>
            <li>Dining: ${budgetBreakdown.dining}</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

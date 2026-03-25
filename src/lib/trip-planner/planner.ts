import { PlannerItemType, TripPlannerItem, TripPlannerMeta } from "@/types/trip-planner";

export type PlannerSectionId = "overview" | "board";
export type DaySegment = "morning" | "afternoon" | "evening";

export interface PlannerDay {
  key: string;
  label: string;
  shortLabel: string;
  items: TripPlannerItem[];
}

function parseDateInput(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function addDays(value: string, count: number) {
  const date = parseDateInput(value);
  date.setDate(date.getDate() + count);
  return date.toISOString().slice(0, 10);
}

export function enumerateDates(start: string, end: string) {
  const dates: string[] = [];
  const cursor = parseDateInput(start);
  const finalDate = parseDateInput(end);

  while (cursor <= finalDate) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function getSegmentForTime(time: string): DaySegment {
  const hour = Number(time.split(":")[0] || 0);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function getItemRange(item: TripPlannerItem) {
  return {
    start: item.date,
    end: item.endDate || item.date,
  };
}

export function itemTouchesDate(item: TripPlannerItem, dateKey: string) {
  const range = getItemRange(item);
  return dateKey >= range.start && dateKey <= range.end;
}

export function getPlannerDays(
  items: TripPlannerItem[],
  meta: TripPlannerMeta
): PlannerDay[] {
  const grouped = new Map<string, TripPlannerItem[]>();

  items
    .slice()
    .sort((a, b) => {
      const startCompare = a.date.localeCompare(b.date);
      if (startCompare !== 0) return startCompare;
      return a.startTime.localeCompare(b.startTime);
    })
    .forEach((item) => {
      const range = getItemRange(item);
      enumerateDates(range.start, range.end).forEach((dateKey) => {
        const current = grouped.get(dateKey) || [];
        current.push(item);
        grouped.set(dateKey, current);
      });
    });

  const firstGroupedDay = grouped.keys().next().value;
  const lastGroupedDay = Array.from(grouped.keys()).at(-1);
  const start =
    meta.startDate && firstGroupedDay
      ? meta.startDate < firstGroupedDay
        ? meta.startDate
        : firstGroupedDay
      : meta.startDate || firstGroupedDay;
  const end =
    meta.endDate && lastGroupedDay
      ? meta.endDate > lastGroupedDay
        ? meta.endDate
        : lastGroupedDay
      : meta.endDate || lastGroupedDay;

  if (!start || !end) return [];

  const days: PlannerDay[] = [];
  const excludedDates = new Set(meta.excludedDates || []);
  const cursor = parseDateInput(start);
  const endDate = parseDateInput(end);

  while (cursor <= endDate) {
    const key = cursor.toISOString().slice(0, 10);
    if (!excludedDates.has(key)) {
      days.push({
        key,
        label: cursor.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        shortLabel: cursor.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        items: (grouped.get(key) || []).slice().sort((a, b) => {
          if (a.type === "accommodation" && b.type !== "accommodation") return -1;
          if (a.type !== "accommodation" && b.type === "accommodation") return 1;
          return a.startTime.localeCompare(b.startTime);
        }),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function getExpandedTripMeta(
  meta: TripPlannerMeta,
  item: TripPlannerItem
): Partial<TripPlannerMeta> {
  const nextStart =
    !meta.startDate || item.date < meta.startDate ? item.date : meta.startDate;
  const itemEnd = item.endDate || item.date;
  const nextEnd =
    !meta.endDate || itemEnd > meta.endDate ? itemEnd : meta.endDate;

  return {
    startDate: nextStart,
    endDate: nextEnd,
    excludedDates: (meta.excludedDates || []).filter((date) => date !== item.date),
  };
}

export function getTripTotals(items: TripPlannerItem[], totalBudget: number) {
  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = totalBudget - totalCost;
  const destinations = new Set(items.map((item) => item.location)).size;
  const categories = new Set(items.map((item) => item.type)).size;

  return {
    totalCost,
    remainingBudget,
    destinations,
    categories,
    budgetPercentage: totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0,
  };
}

export function getStatusTone(type: PlannerItemType) {
  switch (type) {
    case "accommodation":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200";
    case "activity":
      return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200";
    case "transport":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200";
    case "dining":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200";
    default:
      return "border-black/10 bg-black/[0.04] text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white/70";
  }
}

export function getSectionCounts(items: TripPlannerItem[]) {
  return {
    stays: items.filter((item) => item.type === "accommodation").length,
    activities: items.filter((item) => item.type === "activity").length,
    transport: items.filter((item) => item.type === "transport").length,
    dining: items.filter((item) => item.type === "dining").length,
  };
}

export function getBudgetBreakdown(items: TripPlannerItem[]) {
  return items.reduce(
    (accumulator, item) => {
      accumulator[item.type] += item.cost;
      return accumulator;
    },
    {
      accommodation: 0,
      activity: 0,
      transport: 0,
      dining: 0,
    }
  );
}

export function getItemDateLabel(item: TripPlannerItem) {
  if (!item.endDate || item.endDate === item.date) {
    return item.date;
  }

  return `${item.date} to ${item.endDate}`;
}

export function getItemProgressLabel(item: TripPlannerItem, dayKey?: string) {
  if (!item.endDate || item.endDate === item.date) {
    return null;
  }

  const span = enumerateDates(item.date, item.endDate);
  const totalDays = span.length;

  if (!dayKey) {
    return `Day 1 of ${totalDays}`;
  }

  const dayIndex = span.indexOf(dayKey);
  if (dayIndex === -1) {
    return `Day 1 of ${totalDays}`;
  }

  return `Day ${dayIndex + 1} of ${totalDays}`;
}

export function getItemRangeLabel(item: TripPlannerItem, dayKey?: string) {
  const progressLabel = getItemProgressLabel(item, dayKey);
  if (progressLabel) {
    return progressLabel;
  }

  return item.duration;
}

export function getItemTimeLabel(item: TripPlannerItem, dayKey?: string) {
  const progressLabel = getItemProgressLabel(item, dayKey);

  if (!progressLabel) {
    if (item.type === "accommodation") {
      return `${item.startTime} check-in`;
    }
    return `${item.startTime} - ${item.endTime}`;
  }

  if (!item.endDate || !dayKey) {
    return `${item.startTime} check-in`;
  }

  if (dayKey === item.date) {
    return `${item.startTime} check-in`;
  }

  if (dayKey === item.endDate) {
    return `${item.endTime} check-out`;
  }

  return "Continuing stay";
}

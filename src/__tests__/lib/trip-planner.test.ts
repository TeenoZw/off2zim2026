import { detectLogisticsGaps } from "@/lib/trip-planner/planner";
import type { TripPlannerItem, TripPlannerMeta } from "@/types/trip-planner";

const baseMeta: TripPlannerMeta = {
  title: "Test Trip",
  travelers: 2,
  startDate: "2026-06-01",
  endDate: "2026-06-05",
};

function makeItem(
  overrides: Partial<TripPlannerItem> & Pick<TripPlannerItem, "id" | "date" | "type">
): TripPlannerItem {
  return {
    title: "Test item",
    location: "Harare",
    startTime: "09:00",
    endTime: "10:00",
    duration: "60",
    cost: 0,
    description: "",
    rating: 0,
    image: "",
    category: "activity",
    ...overrides,
  };
}

describe("detectLogisticsGaps", () => {
  it("returns empty array when no items", () => {
    const gaps = detectLogisticsGaps([], baseMeta);
    expect(gaps).toHaveLength(0);
  });

  it("returns empty array for a single day with no location change", () => {
    const items: TripPlannerItem[] = [
      makeItem({ id: "1", date: "2026-06-01", type: "activity", location: "Harare" }),
    ];
    const gaps = detectLogisticsGaps(items, baseMeta);
    expect(gaps).toHaveLength(0);
  });

  it("detects a location gap when two consecutive days have different locations with no transport", () => {
    const items: TripPlannerItem[] = [
      makeItem({ id: "1", date: "2026-06-01", type: "activity", location: "Harare" }),
      makeItem({ id: "2", date: "2026-06-02", type: "activity", location: "Victoria Falls" }),
    ];
    const gaps = detectLogisticsGaps(items, baseMeta);
    const locationGap = gaps.find((g) => g.message.toLowerCase().includes("transport"));
    expect(locationGap).toBeDefined();
    expect(locationGap?.severity).toBe("warning");
  });

  it("does NOT flag a location change if transport is present on either day", () => {
    const items: TripPlannerItem[] = [
      makeItem({ id: "1", date: "2026-06-01", type: "activity", location: "Harare" }),
      makeItem({ id: "t", date: "2026-06-01", type: "transport", location: "Harare" }),
      makeItem({ id: "2", date: "2026-06-02", type: "activity", location: "Victoria Falls" }),
    ];
    const gaps = detectLogisticsGaps(items, baseMeta);
    const locationGap = gaps.find((g) => g.message.toLowerCase().includes("transport"));
    expect(locationGap).toBeUndefined();
  });

  it("warns about missing overnight accommodation on non-last night", () => {
    const meta: TripPlannerMeta = { ...baseMeta, endDate: "2026-06-03" };
    const items: TripPlannerItem[] = [
      makeItem({ id: "1", date: "2026-06-01", type: "activity" }),
    ];
    const gaps = detectLogisticsGaps(items, meta);
    const accomGap = gaps.find((g) => g.message.toLowerCase().includes("accommodation"));
    expect(accomGap).toBeDefined();
  });
});

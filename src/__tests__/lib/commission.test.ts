import {
  calculateCommission,
  shopCommissionRate,
  COMMISSION_RATES,
  SHOP_CATEGORY_RATES,
} from "@/lib/commission";

describe("shopCommissionRate", () => {
  it("returns category-specific rate for known category", () => {
    expect(shopCommissionRate("food")).toBe(SHOP_CATEGORY_RATES.food);
    expect(shopCommissionRate("crafts")).toBe(SHOP_CATEGORY_RATES.crafts);
    expect(shopCommissionRate("electronics")).toBe(SHOP_CATEGORY_RATES.electronics);
  });

  it("returns default shop_order rate for unknown category", () => {
    expect(shopCommissionRate("unknown_category")).toBe(COMMISSION_RATES.shop_order);
    expect(shopCommissionRate(null)).toBe(COMMISSION_RATES.shop_order);
    expect(shopCommissionRate(undefined)).toBe(COMMISSION_RATES.shop_order);
  });
});

describe("calculateCommission", () => {
  it("calculates booking commission correctly", () => {
    const result = calculateCommission(100, "booking");
    expect(result.commissionRate).toBe(COMMISSION_RATES.booking);
    expect(result.commissionAmount).toBeCloseTo(100 * COMMISSION_RATES.booking);
    expect(result.netAmount).toBeCloseTo(100 - 100 * COMMISSION_RATES.booking);
    expect(result.grossAmount).toBe(100);
  });

  it("calculates guide_booking commission at 25%", () => {
    const result = calculateCommission(200, "guide_booking");
    expect(result.commissionRate).toBe(0.25);
    expect(result.commissionAmount).toBeCloseTo(50);
    expect(result.netAmount).toBeCloseTo(150);
  });

  it("uses category override for shop_order", () => {
    const foodRate = SHOP_CATEGORY_RATES.food ?? COMMISSION_RATES.shop_order;
    const result = calculateCommission(100, "shop_order", "food");
    expect(result.commissionRate).toBe(foodRate);
  });

  it("uses default shop_order rate when category is undefined", () => {
    const result = calculateCommission(100, "shop_order");
    expect(result.commissionRate).toBe(COMMISSION_RATES.shop_order);
  });

  it("rounds commission amounts to 2 decimal places", () => {
    const result = calculateCommission(33.33, "booking");
    const decimals = result.commissionAmount.toString().split(".")[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });

  it("net + commission equals gross", () => {
    const result = calculateCommission(150.75, "guide_booking");
    expect(result.commissionAmount + result.netAmount).toBeCloseTo(result.grossAmount);
  });
});

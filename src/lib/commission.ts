import { prisma } from "@/lib/prisma";

// ─── Base commission rates ────────────────────────────────────────────────────
// Informed by Zimbabwe market context: tight provider margins, EcoCash/Paynow
// gateway fees already eat 2–3.5%, tourist-facing categories can sustain more.

export const COMMISSION_RATES = {
  booking: 0.12,        // 12% — experiences/accommodation/transport; justified by full discovery funnel
  guide_booking: 0.25,  // 25% — Guide+ expert marketplace (industry standard: Upwork 20%, Fiverr 20%)
  shop_order: 0.10,     // 10% default; overridden per product category via SHOP_CATEGORY_RATES below
} as const;

// ─── Marketplace category-based commission overrides ─────────────────────────
// Category strings must match ProviderListing.category values used by vendors.
// Lower rates for thin-margin local goods; higher for tourist-facing crafts/art.
export const SHOP_CATEGORY_RATES: Record<string, number> = {
  // Tourist-facing / high-margin
  "crafts":         0.12,  // Handmade crafts, curios, souvenirs
  "jewelry":        0.12,  // Jewellery and accessories
  "art":            0.10,  // Paintings, sculptures
  "clothing":       0.12,  // Fashion, textiles, traditional wear

  // Mid-margin
  "electronics":    0.08,  // Competitive with Jumia Africa
  "homeware":       0.10,  // Décor, furniture
  "beauty":         0.10,  // Cosmetics, wellness products
  "books":          0.08,  // Books, stationery

  // Thin-margin / perishables
  "food":           0.06,  // Packaged food, groceries — spoilage risk
  "fresh_produce":  0.05,  // Fresh fruit/veg — very thin margin
  "beverages":      0.07,  // Drinks, wines, spirits

  // Services sold as products
  "experiences":    0.12,  // Activity vouchers / day passes sold in shop
};

/**
 * Resolve the effective commission rate for a shop order.
 * Falls back to the default shop_order rate if category is unknown.
 */
export function shopCommissionRate(category?: string | null): number {
  if (!category) return COMMISSION_RATES.shop_order;
  const normalised = category.toLowerCase().replace(/[\s-]+/g, "_");
  return SHOP_CATEGORY_RATES[normalised] ?? COMMISSION_RATES.shop_order;
}

export type CommissionTransactionType = keyof typeof COMMISSION_RATES;

export interface CommissionResult {
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
}

/**
 * Calculate commission amounts without writing to the database.
 * Pass `category` for shop_order transactions to apply the category-specific rate.
 */
export function calculateCommission(
  grossAmount: number,
  type: CommissionTransactionType,
  category?: string | null
): CommissionResult {
  const commissionRate =
    type === "shop_order"
      ? shopCommissionRate(category)
      : COMMISSION_RATES[type];
  const commissionAmount = parseFloat((grossAmount * commissionRate).toFixed(2));
  const netAmount = parseFloat((grossAmount - commissionAmount).toFixed(2));
  return { grossAmount, commissionRate, commissionAmount, netAmount };
}

/**
 * Record a commission transaction in the database.
 * Call this inside a prisma.$transaction when the parent transaction is created.
 */
export async function recordCommission(
  tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  params: {
    transactionType: CommissionTransactionType;
    transactionId: string;
    grossAmount: number;
    currency?: string;
    category?: string | null;  // used for shop_order category-based rate
  }
) {
  const { grossAmount, commissionRate, commissionAmount, netAmount } = calculateCommission(
    params.grossAmount,
    params.transactionType,
    params.category
  );

  return tx.platformCommission.create({
    data: {
      transactionType: params.transactionType,
      transactionId: params.transactionId,
      grossAmount,
      commissionRate,
      commissionAmount,
      netAmount,
      currency: params.currency ?? "USD",
      status: "held",
    },
  });
}

/**
 * Release commission (mark as released) when a transaction is completed.
 * Fire-and-forget safe — won't throw if not found.
 */
export async function releaseCommission(
  transactionType: CommissionTransactionType,
  transactionId: string
) {
  try {
    await prisma.platformCommission.updateMany({
      where: { transactionType, transactionId, status: "held" },
      data: { status: "released" },
    });
  } catch {
    // Non-critical — log and continue
    console.error(`Failed to release commission for ${transactionType}:${transactionId}`);
  }
}

/**
 * Refund commission (mark as refunded) when a transaction is disputed/cancelled.
 */
export async function refundCommission(
  transactionType: CommissionTransactionType,
  transactionId: string
) {
  try {
    await prisma.platformCommission.updateMany({
      where: { transactionType, transactionId, status: { in: ["held", "released"] } },
      data: { status: "refunded" },
    });
  } catch {
    console.error(`Failed to refund commission for ${transactionType}:${transactionId}`);
  }
}

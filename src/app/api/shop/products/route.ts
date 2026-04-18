import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "24", 10), 60);
    const cursor = searchParams.get("cursor") ?? undefined;

    const products = await prisma.shoppingProduct.findMany({
      where: {
        isActive: true,
        listing: {
          status: "active",
          visibility: "public",
          ...(category ? { category } : {}),
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            slug: true,
            title: true,
            shortDescription: true,
            description: true,
            category: true,
            location: true,
            basePrice: true,
            currency: true,
            images: true,
            tags: true,
            company: {
              select: { id: true, companyName: true, tradingName: true, isVerified: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const nextCursor =
      products.length === limit ? products[products.length - 1]?.id : null;

    return NextResponse.json({
      products: products.map(serializeProduct),
      nextCursor,
    });
  } catch (error) {
    console.error("Shop products error:", error);
    return apiError("Unable to load products.", 500);
  }
}

export function serializeProduct(product: {
  id: string;
  stockQuantity: number;
  pickupLeadTimeHours: number;
  operatingHours: string;
  offersShipping: boolean;
  shippingFee: number | null;
  deliveryEstimateDays: number | null;
  variants: string;
  listing: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string | null;
    description: string;
    category: string;
    location: string;
    basePrice: number | null;
    currency: string;
    images: string | null;
    tags: string | null;
    company: { id: string; companyName: string; tradingName: string | null; isVerified: boolean };
  };
}) {
  return {
    id: product.id,
    listingId: product.listing.id,
    slug: product.listing.slug,
    title: product.listing.title,
    shortDescription: product.listing.shortDescription,
    description: product.listing.description,
    category: product.listing.category,
    location: product.listing.location,
    price: product.listing.basePrice ?? 0,
    currency: product.listing.currency,
    images: safeJsonParse<string[]>(product.listing.images, []),
    tags: safeJsonParse<string[]>(product.listing.tags, []),
    stockQuantity: product.stockQuantity,
    pickupLeadTimeHours: product.pickupLeadTimeHours,
    operatingHours: safeJsonParse<Record<string, string>>(product.operatingHours, {}),
    offersShipping: product.offersShipping,
    shippingFee: product.shippingFee,
    deliveryEstimateDays: product.deliveryEstimateDays,
    variants: safeJsonParse<{ name: string; options: string[] }[]>(product.variants, []),
    vendor: {
      id: product.listing.company.id,
      companyName: product.listing.company.tradingName || product.listing.company.companyName,
      isVerified: product.listing.company.isVerified,
    },
  };
}

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

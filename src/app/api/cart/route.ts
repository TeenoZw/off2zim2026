import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user } = await requireSessionUser();

    const cart = await prisma.shoppingCart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                listing: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    basePrice: true,
                    currency: true,
                    images: true,
                    company: {
                      select: { id: true, companyName: true, tradingName: true },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: { id: null, items: [], subtotal: 0, shippingTotal: 0 } });
    }

    return NextResponse.json({ cart: serializeCart(cart) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to load cart.", 500);
  }
}

export function serializeCart(cart: {
  id: string;
  items: {
    id: string;
    quantity: number;
    deliveryMethod: string;
    pickupDate: Date | null;
    shippingAddress: string | null;
    variantKey: string | null;
    product: {
      id: string;
      stockQuantity: number;
      offersShipping: boolean;
      shippingFee: number | null;
      pickupLeadTimeHours: number;
      listing: {
        id: string;
        slug: string;
        title: string;
        basePrice: number | null;
        currency: string;
        images: string | null;
        company: { id: string; companyName: string; tradingName: string | null };
      };
    };
  }[];
}) {
  const items = cart.items.map((item) => {
    const images = safeJsonParse<string[]>(item.product.listing.images, []);
    const lineTotal = (item.product.listing.basePrice ?? 0) * item.quantity;
    const shippingFee =
      item.deliveryMethod === "shipping" ? (item.product.shippingFee ?? 0) : 0;
    return {
      id: item.id,
      productId: item.product.id,
      slug: item.product.listing.slug,
      title: item.product.listing.title,
      price: item.product.listing.basePrice ?? 0,
      currency: item.product.listing.currency,
      imageUrl: images[0] ?? null,
      quantity: item.quantity,
      deliveryMethod: item.deliveryMethod,
      pickupDate: item.pickupDate?.toISOString() ?? null,
      shippingAddress: item.shippingAddress ? safeJsonParse(item.shippingAddress, null) : null,
      variantKey: item.variantKey,
      lineTotal,
      shippingFee,
      offersShipping: item.product.offersShipping,
      stockQuantity: item.product.stockQuantity,
      pickupLeadTimeHours: item.product.pickupLeadTimeHours,
      vendor: {
        id: item.product.listing.company.id,
        name: item.product.listing.company.tradingName || item.product.listing.company.companyName,
      },
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingTotal = items.reduce((sum, i) => sum + i.shippingFee, 0);

  return { id: cart.id, items, subtotal, shippingTotal, total: subtotal + shippingTotal };
}

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

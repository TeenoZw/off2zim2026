import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user } = await requireSessionUser();

    const orders = await prisma.shoppingOrder.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                listing: {
                  select: { id: true, slug: true, title: true, images: true },
                },
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingTotal: order.shippingTotal,
        currency: order.currency,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => {
          const images = safeJsonParse<string[]>(item.product.listing.images, []);
          return {
            id: item.id,
            productId: item.productId,
            slug: item.product.listing.slug,
            title: item.product.listing.title,
            imageUrl: images[0] ?? null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            deliveryMethod: item.deliveryMethod,
            pickupDate: item.pickupDate?.toISOString() ?? null,
            shippingFee: item.shippingFee,
            status: item.status,
            pickupPin: item.deliveryMethod === "pickup" ? item.pickupPin : null,
          };
        }),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to load orders.", 500);
  }
}

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

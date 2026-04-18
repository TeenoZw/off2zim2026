import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeCart } from "@/app/api/cart/route";

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  deliveryMethod: z.enum(["pickup", "shipping"]).default("pickup"),
  pickupDate: z.string().datetime().optional(),
  shippingAddress: z
    .object({
      fullName: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      country: z.string().default("ZW"),
    })
    .optional(),
  variantKey: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = addItemSchema.parse(await request.json());

    const product = await prisma.shoppingProduct.findUnique({
      where: { id: payload.productId, isActive: true },
      select: { id: true, stockQuantity: true, offersShipping: true },
    });

    if (!product) return apiError("Product not found.", 404);
    if (product.stockQuantity < payload.quantity) {
      return apiError("Not enough stock available.", 400);
    }
    if (payload.deliveryMethod === "shipping" && !product.offersShipping) {
      return apiError("This product does not offer shipping.", 400);
    }

    // Upsert cart
    const cart = await prisma.shoppingCart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    // Upsert item — same product + variantKey = update quantity
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: payload.productId,
        variantKey: payload.variantKey ?? null,
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + payload.quantity,
          deliveryMethod: payload.deliveryMethod,
          pickupDate: payload.pickupDate ? new Date(payload.pickupDate) : existing.pickupDate,
          shippingAddress: payload.shippingAddress
            ? JSON.stringify(payload.shippingAddress)
            : existing.shippingAddress,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: payload.productId,
          quantity: payload.quantity,
          deliveryMethod: payload.deliveryMethod,
          pickupDate: payload.pickupDate ? new Date(payload.pickupDate) : null,
          shippingAddress: payload.shippingAddress
            ? JSON.stringify(payload.shippingAddress)
            : null,
          variantKey: payload.variantKey ?? null,
        },
      });
    }

    const updatedCart = await getFullCart(cart.id);
    return NextResponse.json({ cart: serializeCart(updatedCart) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid item data.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Add to cart error:", error);
    return apiError("Unable to add item to cart.", 500);
  }
}

async function getFullCart(cartId: string) {
  return prisma.shoppingCart.findUniqueOrThrow({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: {
              listing: {
                select: {
                  id: true, slug: true, title: true, basePrice: true,
                  currency: true, images: true,
                  company: { select: { id: true, companyName: true, tradingName: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

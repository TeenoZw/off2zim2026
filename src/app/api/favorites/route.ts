import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import {
  getUserFavorites as getLegacyUserFavorites,
  saveUserFavorites as saveLegacyUserFavorites,
} from "@/lib/mobile-backend";

export const dynamic = "force-dynamic";
const favoriteSchema = z.object({
  itemId: z.string().min(1),
  itemType: z.string().min(1).default("unknown"),
});

async function loadFavorites(userId: string) {
  const prismaFavorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      itemId: true,
      itemType: true,
    },
  });

  if (prismaFavorites.length > 0) {
    return prismaFavorites;
  }

  const legacyFavorites = await getLegacyUserFavorites(userId);
  if (legacyFavorites.length > 0) {
    await prisma.favorite.createMany({
      data: legacyFavorites.map((favorite) => ({
        userId,
        itemId: favorite.itemId,
        itemType: favorite.itemType,
      })),
      skipDuplicates: true,
    });
    await saveLegacyUserFavorites(userId, []);
  }

  return legacyFavorites;
}

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    const favorites = await loadFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch {
    return apiError("Unauthorized", 401);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = favoriteSchema.parse(await request.json());
    await prisma.favorite.upsert({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType: payload.itemType,
          itemId: payload.itemId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        itemType: payload.itemType,
        itemId: payload.itemId,
      },
    });

    const favorites = await loadFavorites(user.id);

    return NextResponse.json({ favorites });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid favorite payload", 422);
    }

    console.error("Favorites route error:", error);
    return apiError("Unable to save favorite right now.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = z
      .object({
        itemId: z.string().min(1),
        itemType: z.string().optional(),
      })
      .parse(await request.json());

    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        itemId: payload.itemId,
        ...(payload.itemType ? { itemType: payload.itemType } : {}),
      },
    });

    const favorites = await loadFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid favorite payload", 422);
    }

    console.error("Favorites delete route error:", error);
    return apiError("Unable to remove favorite right now.", 500);
  }
}

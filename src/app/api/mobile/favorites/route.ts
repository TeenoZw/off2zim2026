import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '@/lib/http';
import { requireSessionUser } from '@/lib/auth';
import { getUserFavorites, saveUserFavorites } from '@/lib/mobile-backend';

export const dynamic = "force-dynamic";
const favoriteSchema = z.object({
  itemId: z.string().min(1),
  itemType: z.string().min(1).default('unknown'),
});

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    const favorites = await getUserFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch {
    return apiError('Unauthorized', 401);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = favoriteSchema.parse(await request.json());
    const favorites = await getUserFavorites(user.id);

    if (!favorites.some(item => item.itemId === payload.itemId)) {
      favorites.push(payload);
      await saveUserFavorites(user.id, favorites);
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || 'Invalid favorite payload', 422);
    }

    return apiError('Unable to save favorite right now.', 500);
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

    const favorites = await getUserFavorites(user.id);
    const nextFavorites = favorites.filter(item => {
      if (item.itemId !== payload.itemId) {
        return true;
      }

      if (payload.itemType && item.itemType !== payload.itemType) {
        return true;
      }

      return false;
    });

    await saveUserFavorites(user.id, nextFavorites);
    return NextResponse.json({ favorites: nextFavorites });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || 'Invalid favorite payload', 422);
    }

    return apiError('Unable to remove favorite right now.', 500);
  }
}

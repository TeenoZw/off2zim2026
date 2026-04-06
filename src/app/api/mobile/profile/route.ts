import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { requireSessionUser } from '@/lib/auth';
import {
  buildMobileProfile,
  parseUserPreferences,
  serializeUserPreferences,
} from '@/lib/mobile-backend';

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  full_name: z.string().optional(),
  business_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().optional(),
  user_type: z.string().optional(),
  title: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  id_type: z.string().nullable().optional(),
  identity_number: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const { user } = await requireSessionUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        nationality: true,
        image: true,
        role: true,
        explorerScore: true,
        preferences: true,
      },
    });

    if (!dbUser) {
      return apiError('User not found.', 404);
    }

    return NextResponse.json({ profile: buildMobileProfile(dbUser) });
  } catch {
    return apiError('Unauthorized', 401);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = profileSchema.parse(await request.json());
    const current = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        preferences: true,
      },
    });

    if (!current) {
      return apiError('User not found.', 404);
    }

    const preferences = parseUserPreferences(current.preferences);
    const mobileProfile = {
      ...(typeof preferences.mobileProfile === 'object' && preferences.mobileProfile
        ? preferences.mobileProfile
        : {}),
      ...Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      ),
    };

    const names =
      typeof payload.full_name === 'string'
        ? payload.full_name.trim().split(/\s+/).filter(Boolean)
        : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: payload.email,
        phone: payload.phone ?? undefined,
        nationality: payload.nationality ?? undefined,
        image: payload.avatar_url ?? undefined,
        firstName: names ? names[0] || null : undefined,
        lastName: names ? names.slice(1).join(' ') || null : undefined,
        name: payload.full_name ?? undefined,
        preferences: serializeUserPreferences({
          ...preferences,
          mobileProfile,
        }),
      },
    });

    const updated = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        nationality: true,
        image: true,
        role: true,
        explorerScore: true,
        preferences: true,
      },
    });

    if (!updated) {
      return apiError('User not found.', 404);
    }

    return NextResponse.json({ profile: buildMobileProfile(updated) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || 'Invalid profile payload', 422);
    }

    console.error('Mobile profile update error:', error);
    return apiError('Unable to update profile right now.', 500);
  }
}

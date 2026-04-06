import { NextResponse } from 'next/server';
import { getMobileDestinations } from '@/lib/mobile-backend';
import { apiError } from '@/lib/http';

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const destinations = await getMobileDestinations();
    return NextResponse.json({ destinations });
  } catch (error) {
    console.error('Mobile destinations error:', error);
    return apiError('Unable to load destinations right now.', 500);
  }
}

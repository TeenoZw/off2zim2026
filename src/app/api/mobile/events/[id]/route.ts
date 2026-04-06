import { NextResponse } from 'next/server';
import { getMobileEvents } from '@/lib/mobile-backend';
import { apiError } from '@/lib/http';

export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const events = await getMobileEvents();
    const event = events.find(item => item.id === params.id);

    if (!event) {
      return apiError('Event not found.', 404);
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Mobile event detail error:', error);
    return apiError('Unable to load the event right now.', 500);
  }
}

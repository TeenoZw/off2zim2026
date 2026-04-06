import { NextResponse } from "next/server";
import { getMobileEvents } from "@/lib/mobile-backend";
import { apiError } from "@/lib/http";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const events = await getMobileEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events route error:", error);
    return apiError("Unable to load events right now.", 500);
  }
}

import { NextResponse } from "next/server";
import { getMobileStays } from "@/lib/mobile-backend";
import { apiError } from "@/lib/http";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const stays = await getMobileStays();
    return NextResponse.json({ stays });
  } catch (error) {
    console.error("Stays route error:", error);
    return apiError("Unable to load stays right now.", 500);
  }
}

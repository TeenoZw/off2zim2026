import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser, serializeUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { user } = await requireSessionUser();
    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    return apiError("Unauthorized", 401);
  }
}

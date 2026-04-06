import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { deleteSession, requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export async function POST() {
  try {
    const { sessionToken } = await requireSessionUser();
    await deleteSession(sessionToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError("Unauthorized", 401);
  }
}

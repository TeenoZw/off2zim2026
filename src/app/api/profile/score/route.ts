import { NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Returns the raw explorerScore JSON string so the badge component can parse it. */
export async function GET() {
  try {
    const { user } = await requireSessionUser();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { explorerScore: true },
    });

    if (!dbUser) return apiError("User not found.", 404);

    return NextResponse.json({ user: { explorerScore: dbUser.explorerScore } });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to fetch score.", 500);
  }
}

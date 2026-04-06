import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { consumePasswordResetToken } from "@/lib/auth-tokens";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const confirmSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const payload = confirmSchema.parse(await request.json());
    const consumed = await consumePasswordResetToken(payload.token);

    if (!consumed) {
      return apiError("This password reset link is invalid or has expired.", 400);
    }

    await prisma.user.update({
      where: { id: consumed.userId },
      data: {
        passwordHash: hashPassword(payload.password),
      },
    });

    await prisma.session.deleteMany({
      where: { userId: consumed.userId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid reset request", 422);
    }

    console.error("Password-reset confirm route error:", error);
    return apiError("Unable to reset password right now.", 500);
  }
}

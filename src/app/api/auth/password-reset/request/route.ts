import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { createPasswordResetToken } from "@/lib/auth-tokens";
import { sendPasswordResetEmail } from "@/lib/auth-email";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = requestSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ ok: true, delivered: true });
    }

    const tokenRecord = await createPasswordResetToken(user.id);
    const delivery = await sendPasswordResetEmail(user.email, tokenRecord.token);

    return NextResponse.json({
      ok: true,
      delivered: delivery.delivered,
      ...(delivery.delivered ? {} : { resetUrl: delivery.fallbackUrl }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid email address", 422);
    }

    console.error("Password-reset request route error:", error);
    return apiError("Unable to start password reset right now.", 500);
  }
}

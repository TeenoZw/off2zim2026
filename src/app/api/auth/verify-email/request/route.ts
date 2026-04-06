import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { createEmailVerificationToken } from "@/lib/auth-tokens";
import { sendEmailVerificationEmail } from "@/lib/auth-email";

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

    if (!user) {
      return NextResponse.json({ ok: true, delivered: true });
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, delivered: true });
    }

    const tokenRecord = await createEmailVerificationToken(user.id);
    const delivery = await sendEmailVerificationEmail(user.email, tokenRecord.token);

    return NextResponse.json({
      ok: true,
      delivered: delivery.delivered,
      ...(delivery.delivered ? {} : { verificationUrl: delivery.fallbackUrl }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message || "Invalid email address", 422);
    }

    console.error("Verify-email request route error:", error);
    return apiError("Unable to send verification right now.", 500);
  }
}

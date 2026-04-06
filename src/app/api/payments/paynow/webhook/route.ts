import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYMENTS_DISABLED_MESSAGE =
  "Paynow webhooks are inactive while Off2Zim completes payment provider setup.";

export async function POST() {
  return NextResponse.json(
    {
      error: PAYMENTS_DISABLED_MESSAGE,
      paymentsEnabled: false,
    },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json({
    message: PAYMENTS_DISABLED_MESSAGE,
    paymentsEnabled: false,
  });
}

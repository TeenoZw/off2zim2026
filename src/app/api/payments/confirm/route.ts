import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYMENTS_DISABLED_MESSAGE =
  "Online payments are temporarily unavailable while Off2Zim completes payment provider setup.";

export async function POST() {
  return NextResponse.json(
    {
      error: PAYMENTS_DISABLED_MESSAGE,
      paymentsEnabled: false,
      mode: "booking_request",
    },
    { status: 503 }
  );
}

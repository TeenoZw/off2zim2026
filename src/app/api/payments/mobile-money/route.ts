import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYMENTS_DISABLED_MESSAGE =
  "Mobile money payments are temporarily unavailable while Off2Zim completes payment provider setup.";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  return NextResponse.json({
    transactionId,
    status: "unavailable",
    message: PAYMENTS_DISABLED_MESSAGE,
    paymentsEnabled: false,
  });
}

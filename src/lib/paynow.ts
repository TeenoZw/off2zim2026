import { Paynow } from "paynow";

/**
 * Returns a configured Paynow client.
 * Reads PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY from env at call-time
 * so the module can be imported safely in both server and test contexts.
 */
export function getPaynowClient(): Paynow {
  const id = process.env.PAYNOW_INTEGRATION_ID;
  const key = process.env.PAYNOW_INTEGRATION_KEY;

  if (!id || !key) {
    throw new Error(
      "Paynow credentials are not configured. " +
        "Set PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY in your environment."
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return new Paynow(
    id,
    key,
    `${appUrl}/bookings`,               // returnUrl — user lands here after payment
    `${appUrl}/api/payments/paynow/webhook` // resultUrl — server-side callback
  );
}

/** Mobile money methods supported by Paynow Zimbabwe */
export type MobileMethod = "ecocash" | "onemoney" | "telecash";

export const MOBILE_METHODS: MobileMethod[] = ["ecocash", "onemoney", "telecash"];

export function isMobileMethod(method: string): method is MobileMethod {
  return MOBILE_METHODS.includes(method as MobileMethod);
}

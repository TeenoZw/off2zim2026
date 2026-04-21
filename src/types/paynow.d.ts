declare module "paynow" {
  export interface PaynowOptions {
    integrationId: string;
    integrationKey: string;
    resultUrl: string;
    returnUrl: string;
  }

  export interface PaymentRequest {
    reference: string;
    amount: number;
    description: string;
    additionalInfo?: string;
  }

  /** Returned by processPayment() — mirrors the SDK's InitResponse class */
  export interface InitResponse {
    /** true when Paynow accepted the payment request */
    success: boolean;
    /** Lowercase status string, e.g. "ok" or "error" */
    status: string;
    /** true when a browser redirect URL is available (web payments) */
    hasRedirect: boolean;
    /** Redirect URL for hosted Paynow page (web flow) */
    redirectUrl?: string;
    /** URL to poll for transaction status updates */
    pollUrl?: string;
    /** Paynow-supplied instructions (mobile flow) */
    instructions?: string;
    /** Error message when success === false */
    error?: string;
  }

  /** Returned by pollTransaction() and parseStatusUpdate() */
  export interface StatusResponse {
    reference: string;
    paynowReference: string;
    amount: number;
    status:
      | "Paid"
      | "Cancelled"
      | "Pending"
      | "Failed"
      | "Sent"
      | "Awaiting Delivery"
      | "Delivered"
      | "Disputed";
    pollUrl: string;
    hash: string;
    error?: string;
  }

  export class Paynow {
    constructor(
      integrationId: string,
      integrationKey: string,
      returnUrl?: string,
      resultUrl?: string
    );

    createPayment(reference: string, authEmail?: string): Payment;

    /**
     * Initiate a payment. Pass an empty string for method to use the hosted
     * redirect page; pass "ecocash" / "onemoney" / "telecash" for mobile money.
     */
    processPayment(payment: Payment, method: string): Promise<InitResponse>;

    /** Poll a previously initiated transaction for its current status */
    pollTransaction(pollUrl: string): Promise<StatusResponse>;

    /**
     * Parse and verify the URL-encoded status update POSTed by Paynow to the
     * result URL. Throws if the hash is invalid.
     */
    parseStatusUpdate(queryString: string): StatusResponse;
  }

  export class Payment {
    constructor(reference: string, authEmail?: string);

    add(title: string, amount: number): Payment;
    setReturnUrl(returnUrl: string): Payment;
    setResultUrl(resultUrl: string): Payment;
    setAdditionalInfo(info: string): Payment;
  }
}

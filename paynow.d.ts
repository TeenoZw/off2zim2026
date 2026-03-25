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

  export interface PaymentResponse {
    success: boolean;
    reference: string;
    paynowReference: string;
    redirectUrl?: string;
    error?: string;
    status: string;
    amount: number;
    hash: string;
    pollUrl: string;
    instructions: string;
  }

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
    paid: boolean;
    pollUrl: string;
    hash: string;
  }

  export class Paynow {
    resultUrl: string;
    returnUrl: string;

    constructor(
      integrationId: string,
      integrationKey: string,
      returnUrl?: string,
      resultUrl?: string
    );

    createPayment(reference: string, authEmail?: string): Payment;
    processPayment(payment: Payment, method: string): Promise<PaymentResponse>;
    pollTransaction(pollUrl: string): Promise<StatusResponse>;
    send(payment: Payment): Promise<PaymentResponse>;
    sendMobile(
      payment: Payment,
      phone: string,
      method: string
    ): Promise<PaymentResponse>;
    verifyWebhook(data: any): boolean;
  }

  export class Payment {
    constructor(reference: string, authEmail?: string);

    add(title: string, amount: number): Payment;
    setReturnUrl(returnUrl: string): Payment;
    setResultUrl(resultUrl: string): Payment;
    setAdditionalInfo(info: string): Payment;
  }
}

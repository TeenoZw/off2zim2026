"use client";

import React, { useState } from "react";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentIntent } from "@/types/payment";
import { CreditCard, Loader2, Lock } from "lucide-react";

interface PaymentFormProps {
  paymentIntent: PaymentIntent;
  onSuccess: (confirmationNumber: string) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  paymentIntent,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent: confirmedIntent } =
        await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setIsLoading(false);
        return;
      }

      if (confirmedIntent?.status === "succeeded") {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: confirmedIntent.id }),
        });

        if (response.ok) {
          const confirmation = await response.json();
          onSuccess(confirmation.confirmationNumber);
        } else {
          setError("Failed to process booking confirmation");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementChange = (event: any) => {
    setIsComplete(event.complete);
    setError(event.error ? event.error.message : null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="theme-panel rounded-[24px] p-5">
        <div className="theme-heading mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#ff7352]" />
          <h3 className="text-sm font-semibold">Payment information</h3>
        </div>
        <PaymentElement
          onChange={handleElementChange}
          options={{
            layout: "tabs",
            defaultValues: { billingDetails: { address: { country: "ZW" } } },
          }}
        />
      </div>

      <div className="theme-panel rounded-[24px] p-5">
        <h3 className="theme-heading mb-4 text-sm font-semibold">Billing address</h3>
        <AddressElement
          options={{
            mode: "billing",
            defaultValues: { address: { country: "ZW" } },
          }}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="theme-card-soft p-4 text-sm">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Your payment information is encrypted and securely processed.
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="theme-button-secondary flex-1 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isLoading || !isComplete}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay ${paymentIntent.amount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

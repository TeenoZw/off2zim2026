"use client";

import React, { useState } from "react";
import { PaymentIntent } from "@/types/payment";
import { AlertCircle, CheckCircle, Loader2, Smartphone } from "lucide-react";
import { getAuthHeaders } from "@/lib/client-api";

interface MobileMoneyFormProps {
  paymentIntent: PaymentIntent;
  onSuccess: (confirmationNumber: string) => void;
  onCancel: () => void;
}

export default function MobileMoneyForm({
  paymentIntent,
  onSuccess,
  onCancel,
}: MobileMoneyFormProps) {
  const [selectedProvider, setSelectedProvider] = useState<
    "ecocash" | "onemoney" | "telecash" | null
  >(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "details" | "confirm" | "processing">("select");

  const mobileProviders = [
    {
      id: "ecocash" as const,
      name: "EcoCash",
      logo: "EC",
      description: "Popular local wallet",
      prefixes: ["077", "078"],
    },
    {
      id: "onemoney" as const,
      name: "OneMoney",
      logo: "OM",
      description: "Fast mobile payments",
      prefixes: ["071", "073"],
    },
    {
      id: "telecash" as const,
      name: "TeleCash",
      logo: "TC",
      description: "Alternative mobile wallet",
      prefixes: ["076"],
    },
  ];

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const validatePhoneNumber = (phone: string, provider: string) => {
    const digits = phone.replace(/\D/g, "");
    const providerData = mobileProviders.find((p) => p.id === provider);
    if (digits.length !== 9 || !providerData) return false;
    return providerData.prefixes.some((prefix) => digits.startsWith(prefix));
  };

  const handleProviderSelect = (providerId: "ecocash" | "onemoney" | "telecash") => {
    setSelectedProvider(providerId);
    setStep("details");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !phoneNumber) return;

    if (!validatePhoneNumber(phoneNumber, selectedProvider)) {
      setError("Invalid phone number for selected provider");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep("processing");

    try {
      const response = await fetch("/api/payments/mobile-money", {
        method: "POST",
        headers: getAuthHeaders(undefined, true),
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          provider: selectedProvider,
          phoneNumber: phoneNumber.replace(/\D/g, ""),
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Payment failed");

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setStep("confirm");

      setTimeout(() => {
        onSuccess(result.confirmationNumber || `MM${Date.now()}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsLoading(false);
      setStep("details");
    }
  };

  if (step === "processing") {
    return (
      <div className="theme-panel rounded-[24px] p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7352]" />
        <h3 className="theme-heading mt-4 text-lg font-semibold">Waiting for mobile confirmation</h3>
        <p className="theme-muted mt-2 text-sm">
          Approve the prompt on your phone to continue.
        </p>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="rounded-[24px] border border-[#7ddf8c]/20 bg-[#ecf8ef] p-8 text-center dark:bg-[#122116]">
        <CheckCircle className="mx-auto h-8 w-8 text-[#7ddf8c]" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Payment received</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/55">
          Your booking confirmation is being prepared.
        </p>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="space-y-3">
        <h3 className="theme-heading text-sm font-semibold">Select mobile money provider</h3>
        {mobileProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleProviderSelect(provider.id)}
            className="theme-panel flex w-full items-center gap-4 rounded-[24px] p-4 text-left transition hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05] text-sm font-semibold text-slate-900 dark:bg-white/[0.06] dark:text-white">
              {provider.logo}
            </div>
            <div className="flex-1">
              <div className="theme-heading font-semibold">{provider.name}</div>
              <div className="theme-muted text-sm">{provider.description}</div>
            </div>
            <Smartphone className="h-4 w-4 text-[#ff7352]" />
          </button>
        ))}
      </div>
    );
  }

  const provider = mobileProviders.find((p) => p.id === selectedProvider);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep("select")}
          className="theme-muted text-sm hover:text-slate-950 dark:hover:text-white"
        >
          Back
        </button>
        <h3 className="theme-heading text-sm font-semibold">Pay with {provider?.name}</h3>
      </div>

      <div className="theme-panel rounded-[24px] p-5">
        <label className="theme-heading block text-sm font-medium">Phone number</label>
        <div className="relative mt-3">
          <span className="theme-subtle absolute left-4 top-1/2 -translate-y-1/2">
            +263
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              if (formatted.replace(/\D/g, "").length <= 9) setPhoneNumber(formatted);
            }}
            placeholder="077 123 456"
            className="theme-input w-full rounded-2xl py-3 pl-16 pr-4 text-sm"
            required
          />
        </div>
        <p className="theme-subtle mt-2 text-xs">
          Supported prefixes: {provider?.prefixes.join(", ")}
        </p>
      </div>

      <div className="theme-card-soft rounded-[24px] p-4">
        <div className="theme-muted flex justify-between text-sm">
          <span>Amount to pay</span>
          <span className="theme-heading font-semibold">
            ${paymentIntent.amount / 100} {paymentIntent.currency.toUpperCase()}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="theme-button-secondary flex-1 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            isLoading ||
            !phoneNumber ||
            !validatePhoneNumber(phoneNumber, selectedProvider || "")
          }
          className="flex-1 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>
      </div>
    </form>
  );
}

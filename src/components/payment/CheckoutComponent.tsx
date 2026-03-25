"use client";

import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BookingItem, PaymentIntent } from "@/types/payment";
import PaymentForm from "./PaymentForm";
import MobileMoneyForm from "./MobileMoneyForm";
import BookingSummary from "./BookingSummary";
import { Building, CreditCard, Smartphone } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutComponentProps {
  items: BookingItem[];
  onSuccess: (confirmationNumber: string) => void;
  onCancel: () => void;
}

export default function CheckoutComponent({
  items,
  onSuccess,
  onCancel,
}: CheckoutComponentProps) {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"card" | "mobile" | "checkout">("card");

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error("Failed to create payment intent");

      const intent = await response.json();
      setPaymentIntent(intent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const stripeOptions = {
    clientSecret: paymentIntent?.clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#ff5630",
        colorBackground: "#121212",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "Century Gothic, Arial, sans-serif",
        borderRadius: "14px",
      },
    },
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:order-2">
          <div className="theme-panel sticky top-24 rounded-[36px] p-6">
            <h2 className="theme-heading text-2xl font-semibold">Booking summary</h2>
            <p className="theme-muted mt-2 text-sm">
              Review your items before confirming payment.
            </p>
            <div className="mt-6">
              <BookingSummary items={items} />
            </div>
          </div>
        </div>

        <div className="lg:order-1">
          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <h2 className="theme-heading text-3xl font-semibold">Complete your booking</h2>
            <p className="theme-muted mt-2 text-sm">
              Choose the payment method that feels right for your traveler.
            </p>

            <div className="theme-card-soft mt-6 grid grid-cols-3 gap-2 rounded-[24px] p-2">
              <TabButton
                active={activeTab === "card"}
                icon={<CreditCard className="h-4 w-4" />}
                label="Card"
                onClick={() => setActiveTab("card")}
              />
              <TabButton
                active={activeTab === "mobile"}
                icon={<Smartphone className="h-4 w-4" />}
                label="Mobile Money"
                onClick={() => setActiveTab("mobile")}
              />
              <TabButton
                active={activeTab === "checkout"}
                icon={<Building className="h-4 w-4" />}
                label="Stripe Checkout"
                onClick={() => setActiveTab("checkout")}
              />
            </div>

            <div className="theme-card-soft mt-6 rounded-[28px] p-5">
              {activeTab === "card" && (
                <>
                  {!paymentIntent ? (
                    <div className="py-8 text-center">
                      <button
                        onClick={createPaymentIntent}
                        disabled={isLoading}
                        className="rounded-full bg-[#ff5630] px-8 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {isLoading ? "Setting up payment..." : "Pay with card"}
                      </button>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <PaymentForm
                        paymentIntent={paymentIntent}
                        onSuccess={onSuccess}
                        onCancel={onCancel}
                      />
                    </Elements>
                  )}
                </>
              )}

              {activeTab === "mobile" && (
                <>
                  {!paymentIntent ? (
                    <div className="py-8 text-center">
                      <button
                        onClick={createPaymentIntent}
                        disabled={isLoading}
                        className="rounded-full bg-[#ff5630] px-8 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {isLoading ? "Setting up payment..." : "Pay with mobile money"}
                      </button>
                    </div>
                  ) : (
                    <MobileMoneyForm
                      paymentIntent={paymentIntent}
                      onSuccess={onSuccess}
                      onCancel={onCancel}
                    />
                  )}
                </>
              )}

              {activeTab === "checkout" && (
                <div className="py-8 text-center">
                  <button
                    onClick={handleCheckoutSession}
                    disabled={isLoading}
                    className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-8 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <Building className="h-4 w-4" />
                    {isLoading ? "Redirecting..." : "Continue to Stripe Checkout"}
                  </button>
                  <p className="theme-subtle mt-3 text-sm">
                    Secure hosted checkout for fast confirmation.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10">
              <span className="theme-muted text-sm">Current total</span>
              <span className="theme-heading text-2xl font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-white text-black shadow-sm dark:bg-white dark:text-black"
          : "bg-transparent text-slate-600 hover:bg-black/[0.05] hover:text-slate-950 dark:text-white/65 dark:hover:bg-white/[0.05] dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

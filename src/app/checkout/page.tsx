"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutComponent from "@/components/payment/CheckoutComponent";
import { BookingItem } from "@/types/payment";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const itemsParam = searchParams.get("items");

    if (itemsParam) {
      try {
        const decodedItems = JSON.parse(decodeURIComponent(itemsParam));
        setItems(decodedItems);
      } catch (error) {
        const savedItems = localStorage.getItem("checkout_items");
        if (savedItems) setItems(JSON.parse(savedItems));
      }
    } else {
      const savedItems = localStorage.getItem("checkout_items");
      if (savedItems) setItems(JSON.parse(savedItems));
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleSuccess = (confirmationNumber: string) => {
    localStorage.removeItem("checkout_items");
    router.push(`/booking/success?confirmation=${confirmationNumber}`);
  };

  const handleCancel = () => router.back();

  if (isLoading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff5630]" />
          <p className="mt-4 text-white/65">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center px-4">
        <div className="theme-panel w-full max-w-xl rounded-[36px] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.05]">
            <ShoppingBag className="theme-subtle h-9 w-9" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Your checkout is empty</h1>
          <p className="theme-muted mt-3 text-sm leading-7">
            Add a stay, activity, or itinerary item first, then come back to complete
            payment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/accommodation"
              className="rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
            >
              Browse stays
            </Link>
            <Link
              href="/activities"
              className="theme-button-secondary rounded-full px-6 py-3 text-sm font-semibold"
            >
              Explore activities
            </Link>
            <Link
              href="/"
              className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[36px] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <button
                onClick={handleCancel}
                className="theme-muted inline-flex items-center gap-2 text-sm transition hover:text-slate-950 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h1 className="theme-heading mt-3 text-4xl font-semibold">Checkout</h1>
              <p className="theme-muted mt-2 text-sm">
                Complete your Off2Zim booking with card, mobile money, or Stripe
                Checkout.
              </p>
            </div>
            <div className="theme-panel-soft rounded-[24px] px-5 py-4 text-sm">
              {items.length} booking item{items.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <CheckoutComponent
        items={items}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="theme-page flex min-h-screen items-center justify-center">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

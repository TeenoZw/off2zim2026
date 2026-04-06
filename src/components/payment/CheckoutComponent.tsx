"use client";

import React from "react";
import Link from "next/link";
import { BookingItem } from "@/types/payment";
import BookingSummary from "./BookingSummary";
import { ArrowRight, CalendarClock, Mail, ShieldAlert } from "lucide-react";

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
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRequestBooking = () => {
    const confirmationNumber = `REQ-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem(
      "off2zim_booking_request",
      JSON.stringify({
        confirmationNumber,
        createdAt: new Date().toISOString(),
        items,
        total,
        mode: "booking_request",
      })
    );
    onSuccess(confirmationNumber);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:order-2">
          <div className="theme-panel sticky top-24 rounded-[36px] p-6">
            <h2 className="theme-heading text-2xl font-semibold">Booking summary</h2>
            <p className="theme-muted mt-2 text-sm">
              Review your trip items while payments are being finalized for launch.
            </p>
            <div className="mt-6">
              <BookingSummary items={items} />
            </div>
          </div>
        </div>

        <div className="lg:order-1">
          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <div className="rounded-[28px] border border-amber-500/25 bg-amber-500/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <h2 className="theme-heading text-xl font-semibold">
                    Online payments are temporarily unavailable
                  </h2>
                  <p className="theme-muted mt-2 text-sm leading-6">
                    Off2Zim is completing payment provider setup. For now, you can
                    review the booking, submit a booking request, and finalize
                    payment manually with the provider.
                  </p>
                </div>
              </div>
            </div>

            <div className="theme-card-soft mt-6 rounded-[28px] p-6">
              <h3 className="theme-heading text-lg font-semibold">
                What happens next
              </h3>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarClock className="mt-1 h-5 w-5 text-[#ff7352]" />
                  <div>
                    <div className="theme-heading text-sm font-semibold">
                      We hold your trip details together
                    </div>
                    <div className="theme-muted mt-1 text-sm leading-6">
                      Your selected stays, activities, and trip items remain grouped
                      as one Off2Zim booking request.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-[#5aa7ff]" />
                  <div>
                    <div className="theme-heading text-sm font-semibold">
                      You receive a request reference
                    </div>
                    <div className="theme-muted mt-1 text-sm leading-6">
                      Use the request reference when following up with the provider
                      or the Off2Zim team.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-5 w-5 text-[#7ddf8c]" />
                  <div>
                    <div className="theme-heading text-sm font-semibold">
                      Manual payment can be completed next
                    </div>
                    <div className="theme-muted mt-1 text-sm leading-6">
                  Once payment rails are live again, this flow will return to
                      direct online checkout.
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div className="theme-card-soft mt-6 rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <span className="theme-muted text-sm">Current total</span>
                <span className="theme-heading text-2xl font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onCancel}
                  className="theme-button-secondary flex-1 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Go back
                </button>
                <button
                  onClick={handleRequestBooking}
                  className="flex-1 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
                >
                  Submit booking request
                </button>
              </div>
              <div className="mt-4 text-center text-xs text-slate-500 dark:text-white/45">
                Need help now?{" "}
                <Link href="/contact" className="text-[#ff7352] hover:underline">
                  Contact Off2Zim support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

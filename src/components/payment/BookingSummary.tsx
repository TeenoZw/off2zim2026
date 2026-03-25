"use client";

import React from "react";
import { BookingItem } from "@/types/payment";
import { Calendar, Clock3, MapPin, Package, ShieldCheck, Users } from "lucide-react";

interface BookingSummaryProps {
  items: BookingItem[];
}

export default function BookingSummary({ items }: BookingSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const iconFor = (type: string) => {
    if (type === "accommodation") return <MapPin className="h-4 w-4 text-[#5aa7ff]" />;
    if (type === "activity") return <Package className="h-4 w-4 text-[#ff7352]" />;
    if (type === "transport") return <Clock3 className="h-4 w-4 text-[#ffc247]" />;
    return <Package className="h-4 w-4 text-white/50" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={`${item.id}-${index}`} className="theme-card-soft p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]">
              {iconFor(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="theme-heading text-sm font-semibold">{item.name}</h4>
                  {item.description && (
                    <p className="theme-muted mt-1 text-xs leading-5">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="theme-heading text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="theme-subtle text-xs">Qty: {item.quantity}</div>
                </div>
              </div>

              <div className="theme-subtle mt-3 space-y-1.5 text-xs">
                {item.checkIn && item.checkOut && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
                  </div>
                )}
                {item.guests && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    {item.guests} guests
                  </div>
                )}
                {item.provider && <div>by {item.provider.name}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="theme-card-soft p-5">
        <div className="space-y-3 text-sm">
          <div className="theme-muted flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="theme-muted flex justify-between">
            <span>VAT (15%)</span>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div className="theme-muted flex justify-between">
            <span>Service fee</span>
            <span>$0.00</span>
          </div>
          <div className="border-t border-black/10 pt-3 dark:border-white/10">
            <div className="theme-heading flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#7ddf8c]/20 bg-[#ecf8ef] p-4 dark:bg-[#122116]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-[#7ddf8c]" />
          <div>
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Booking protection included</h5>
            <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-white/60">
              Secure payment, clear confirmation, and a cleaner handoff into your
              Off2Zim itinerary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

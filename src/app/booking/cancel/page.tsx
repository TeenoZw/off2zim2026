"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";

export default function BookingCancelPage() {
  return (
    <div className="theme-page min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="theme-panel rounded-[32px] p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff5630]/15">
            <XCircle className="h-8 w-8 text-[#ff5630]" />
          </div>

          {/* Heading */}
          <h1 className="theme-heading text-2xl font-semibold">Booking Cancelled</h1>
          <p className="theme-muted mt-2 text-sm leading-6">
            Your payment was cancelled and no charges were made to your account.
          </p>

          {/* What happened */}
          <div className="mt-6 rounded-[18px] border border-[#ff5630]/20 bg-[#ff5630]/[0.06] px-5 py-4 text-left">
            <h3 className="text-sm font-semibold text-[#ff8a78] mb-2">What happened?</h3>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5630]/60" />
                Payment was cancelled during checkout
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5630]/60" />
                No charges were made to your payment method
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5630]/60" />
                Your booking was not confirmed
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Link
              href="/marketplace"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Booking Again
            </Link>

            <Link
              href="/"
              className="theme-button-secondary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <Link
              href="/support"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium theme-muted hover:bg-white/[0.05] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Link>
          </div>

          {/* Help text */}
          <div className="mt-6 text-sm theme-subtle space-y-1">
            <p>Our team is available 24/7 to assist you.</p>
            <p>
              Email:{" "}
              <a href="mailto:support@off2zim.com" className="text-[#ff7352] hover:underline">
                support@off2zim.com
              </a>
            </p>
          </div>

          {/* Popular alternatives */}
          <div className="mt-8 border-t border-white/[0.08] pt-6">
            <h4 className="theme-heading text-sm font-semibold mb-3">Explore Instead</h4>
            <div className="space-y-2">
              <Link href="/marketplace"    className="block text-sm text-[#ff7352] hover:underline">Browse the marketplace</Link>
              <Link href="/trip-planner"   className="block text-sm text-[#ff7352] hover:underline">Plan your perfect trip</Link>
              <Link href="/community-guides" className="block text-sm text-[#ff7352] hover:underline">Ask a local guide</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

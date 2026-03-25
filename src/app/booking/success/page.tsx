"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookingConfirmation } from "@/types/payment";
import { Calendar, CheckCircle, Download, Mail, MapPin, Phone } from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmationFromQuery = searchParams.get("confirmation");

  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId || confirmationFromQuery) {
      const mockBooking: BookingConfirmation = {
        id: `booking_${Date.now()}`,
        paymentIntentId: sessionId || "",
        userId: "current_user",
        items: [
          {
            id: "hotel_1",
            type: "accommodation",
            name: "Palm River Hotel",
            description: "Luxury accommodation near Victoria Falls",
            price: 250,
            currency: "USD",
            quantity: 2,
            checkIn: "2026-04-15",
            checkOut: "2026-04-18",
            guests: 2,
            provider: {
              id: "provider_1",
              name: "Palm River Hospitality",
              email: "bookings@off2zim.co.zw",
            },
          },
        ],
        totalAmount: 575,
        currency: "USD",
        status: "confirmed",
        paymentStatus: "paid",
        bookingDate: new Date().toISOString(),
        confirmationNumber:
          confirmationFromQuery ||
          "OFF2ZIM-" + Date.now().toString(36).toUpperCase(),
        customerInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+263 77 123 4567",
        },
        createdAt: new Date(),
      };

      setBooking(mockBooking);
      setIsLoading(false);
    } else {
      setError("No booking reference provided");
      setIsLoading(false);
    }
  }, [confirmationFromQuery, sessionId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff5630]" />
          <p className="mt-4 text-white/60">Loading your confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <div className="w-full max-w-lg rounded-[36px] border border-white/10 bg-[#111111] p-8 text-center">
          <h1 className="text-3xl font-semibold">Unable to load booking</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">
            {error || "We couldn't find your confirmation details."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] py-10 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[40px] border border-white/10 bg-[#111111] p-6 md:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#132417]">
              <CheckCircle className="h-10 w-10 text-[#7ddf8c]" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold">Booking confirmed</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Your Zimbabwe trip is now locked in. This screen has been refreshed
              to feel closer to the mobile app: clearer status, stronger hierarchy,
              and more useful next steps.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold">Confirmation details</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Stat label="Confirmation number" value={booking.confirmationNumber} />
                  <Stat
                    label="Booking date"
                    value={new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                  <Stat
                    label="Total paid"
                    value={`$${booking.totalAmount.toFixed(2)} ${booking.currency}`}
                  />
                  <Stat label="Payment status" value={booking.paymentStatus} />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold">Your booking</h2>
                <div className="mt-5 space-y-4">
                  {booking.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] border border-white/10 bg-[#121212] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-white/55">{item.description}</p>
                          )}
                          <div className="mt-3 space-y-2 text-sm text-white/50">
                            {item.checkIn && item.checkOut && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(item.checkIn).toLocaleDateString()} -{" "}
                                {new Date(item.checkOut).toLocaleDateString()}
                              </div>
                            )}
                            {item.provider && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Provided by {item.provider.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-white/40">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold">Quick actions</h2>
                <div className="mt-5 space-y-3">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
                    <Download className="h-4 w-4" />
                    Download itinerary
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">
                    <Mail className="h-4 w-4" />
                    Resend confirmation
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
                  >
                    View all bookings
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold">Contact</h2>
                <div className="mt-5 space-y-3 text-sm text-white/55">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {booking.customerInfo.email}
                  </div>
                  {booking.customerInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {booking.customerInfo.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] border border-[#7ddf8c]/20 bg-[#122116] p-6">
                <h2 className="text-xl font-semibold">What happens next</h2>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <p>Check your email for confirmation and provider details.</p>
                  <p>Save your confirmation number for support requests.</p>
                  <p>Use Trip Planner to organize the rest of your itinerary.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-center">
            <Link
              href="/activities"
              className="rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
            >
              Book more activities
            </Link>
            <Link
              href="/trip-planner"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white"
            >
              Open trip planner
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#121212] p-4">
      <div className="text-sm text-white/45">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
          Loading booking details...
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}

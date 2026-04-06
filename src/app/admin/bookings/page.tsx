"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiFetch } from "@/lib/client-api";
import type { AdminBookingRecord } from "@/types/platform";

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminBookingsContent />
    </ProtectedRoute>
  );
}

function AdminBookingsContent() {
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const payload = await apiFetch<{ bookings: AdminBookingRecord[] }>(
          "/api/admin/bookings"
        );
        setBookings(payload.bookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const normalized = query.toLowerCase();
    return bookings.filter((booking) =>
      [
        booking.confirmationNumber,
        booking.customer.name,
        booking.customer.email,
        booking.provider?.companyName || "",
        booking.listing?.title || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [bookings, query]);

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Platform bookings</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/60">
              Admin oversight for provider bookings, traveler confirmations, payment
              state, and lifecycle interventions.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/providers"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
            >
              Provider reviews
            </Link>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Bookings
            </div>
            <Link
              href="/admin/disputes"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
            >
              Disputes
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-[28px] border border-white/10 bg-[#111111] p-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bookings, providers, or travelers"
            className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-white/35"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              Loading platform bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              No bookings match the current search.
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[28px] border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">{booking.confirmationNumber}</h2>
                      <span className="rounded-full bg-[#13283a] px-3 py-1 text-xs font-medium text-[#8dc9ff]">
                        {booking.status}
                      </span>
                      <span className="rounded-full bg-[#153220] px-3 py-1 text-xs font-medium text-[#8cf0a1]">
                        {booking.paymentStatus}
                      </span>
                      {booking.disputesCount > 0 ? (
                        <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                          {booking.disputesCount} dispute{booking.disputesCount > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 text-lg font-medium">
                      {booking.listing?.title || booking.bookingType}
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-4 text-sm text-white/55">
                      <div>
                        <div className="text-white/35">Traveler</div>
                        <div>{booking.customer.name}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Provider</div>
                        <div>{booking.provider?.companyName || "Off2Zim"}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Created</div>
                        <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Total</div>
                        <div>
                          ${booking.totalAmount.toFixed(2)} {booking.currency}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:w-[320px] xl:grid-cols-1">
                    <a
                      href={`mailto:${booking.customer.email}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white/75"
                    >
                      Email traveler
                    </a>
                    <select
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={async (event) => {
                        setUpdatingId(booking.id);
                        try {
                          const payload = await apiFetch<{ booking: AdminBookingRecord }>(
                            `/api/admin/bookings/${booking.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                status: event.target.value,
                              }),
                            }
                          );
                          setBookings((current) =>
                            current.map((item) =>
                              item.id === payload.booking.id ? payload.booking : item
                            )
                          );
                          setError("");
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "Unable to update booking status."
                          );
                        } finally {
                          setUpdatingId("");
                        }
                      }}
                      className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white"
                    >
                      <option value="REQUESTED">Requested</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

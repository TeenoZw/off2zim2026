"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { actionButtonVariants } from "@/components/admin/ActionButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatGrid from "@/components/admin/AdminStatGrid";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetch } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { AdminBookingRecord } from "@/types/platform";
import { AlertTriangle, Calendar, CircleDollarSign, ListChecks } from "lucide-react";

function bookingTone(status: string) {
  if (status === "COMPLETED") return "success" as const;
  if (status === "CANCELLED") return "danger" as const;
  return "pending" as const;
}

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute requiredRole="admin" surface="admin">
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

  const stats = useMemo(
    () => ({
      total: bookings.length,
      open: bookings.filter((booking) => ["REQUESTED", "PENDING"].includes(booking.status))
        .length,
      disputed: bookings.filter((booking) => booking.disputesCount > 0).length,
      revenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    }),
    [bookings]
  );

  return (
    <AdminShell
      activePath="/admin/bookings"
      title="Bookings"
      description="Monitor traveler bookings, track provider fulfillment, and update booking status."
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <AdminStatGrid>
        <AdminCard label="Total bookings" value={loading ? "—" : stats.total} icon={ListChecks} />
        <AdminCard
          label="Open bookings"
          value={loading ? "—" : stats.open}
          icon={Calendar}
          tone="warning"
        />
        <AdminCard
          label="Bookings with disputes"
          value={loading ? "—" : stats.disputed}
          icon={AlertTriangle}
          tone="danger"
        />
        <AdminCard
          label="Gross booking value"
          value={loading ? "—" : `$${stats.revenue.toFixed(2)}`}
          icon={CircleDollarSign}
          tone="success"
        />
      </AdminStatGrid>

      <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
        <div className="px-6 pt-5">
          <AdminSectionHeader
            title="Booking monitoring"
            description="Search booking records and update lifecycle status."
          />
        </div>
        <div className="px-6 py-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search booking ID, traveler, provider, or listing"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white dark:placeholder:text-white/25"
          />
        </div>
        <div className="px-6 pb-6">
          <AdminTable
            columns={[
              {
                key: "id",
                header: "Booking ID",
                cell: (booking: AdminBookingRecord) => (
                  <div>
                    <div className="font-medium text-slate-950 dark:text-white">
                      {booking.confirmationNumber}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-white/45">
                      {booking.listing?.title || booking.bookingType}
                    </div>
                  </div>
                ),
              },
              {
                key: "user",
                header: "User",
                cell: (booking: AdminBookingRecord) => (
                  <div>
                    <div>{booking.customer.name}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-white/45">
                      {booking.customer.email}
                    </div>
                  </div>
                ),
              },
              {
                key: "provider",
                header: "Provider",
                cell: (booking: AdminBookingRecord) =>
                  booking.provider?.companyName || "Off2Zim",
              },
              {
                key: "date",
                header: "Date",
                cell: (booking: AdminBookingRecord) =>
                  new Date(booking.createdAt).toLocaleDateString(),
              },
              {
                key: "status",
                header: "Status",
                cell: (booking: AdminBookingRecord) => (
                  <div className="flex flex-col gap-2">
                    <StatusBadge tone={bookingTone(booking.status)}>{booking.status}</StatusBadge>
                    <span className="text-xs text-slate-500 dark:text-white/35">
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                cell: (booking: AdminBookingRecord) => (
                  <div className="flex flex-wrap gap-2 lg:min-w-[220px]">
                    <a
                      href={`mailto:${booking.customer.email}`}
                      className={cn(actionButtonVariants({ variant: "secondary", size: "sm" }))}
                    >
                      Contact
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
                      className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white"
                    >
                      <option value="REQUESTED">Requested</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                ),
              },
            ]}
            rows={filteredBookings}
            rowKey={(booking) => booking.id}
            emptyState="No bookings match the current search."
          />
        </div>
      </section>
    </AdminShell>
  );
}

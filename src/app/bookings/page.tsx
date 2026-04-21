"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BlindRatingForm from "@/components/rating/BlindRatingForm";
import { apiFetch } from "@/lib/client-api";
import type { ExplorerBookingRecord } from "@/types/platform";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  COMPLETED:  { label: "Completed",  color: "text-[#4ade80] bg-[#4ade80]/10", icon: CheckCircle2 },
  CONFIRMED:  { label: "Confirmed",  color: "text-[#8dc9ff] bg-[#8dc9ff]/10", icon: Calendar },
  PENDING:    { label: "Pending",    color: "text-[#fbbf24] bg-[#fbbf24]/10", icon: Clock },
  REQUESTED:  { label: "Requested",  color: "text-[#fbbf24] bg-[#fbbf24]/10", icon: Clock },
  CANCELLED:  { label: "Cancelled",  color: "text-white/35 bg-white/8",       icon: XCircle },
  DISPUTED:   { label: "Disputed",   color: "text-[#ff5630] bg-[#ff5630]/10", icon: AlertCircle },
};

const STATUS_FILTERS = ["all", "COMPLETED", "CONFIRMED", "PENDING", "CANCELLED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const CANCELLABLE = new Set(["PENDING", "REQUESTED", "CONFIRMED"]);

function BookingCard({
  booking,
  onCancelled,
}: {
  booking: ExplorerBookingRecord;
  onCancelled: (id: string) => void;
}) {
  const [ratingOpen, setRatingOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const statusMeta = STATUS_STYLES[booking.status] ?? {
    label: booking.status,
    color: "text-white/40 bg-white/8",
    icon: Clock,
  };
  const Icon = statusMeta.icon;
  const isCompleted = booking.status === "COMPLETED";
  const isCancellable = CANCELLABLE.has(booking.status);

  const providerName =
    booking.provider?.companyName ?? "Unknown Provider";

  async function handleCancel() {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(true);
    setCancelError("");
    try {
      await apiFetch(`/api/bookings/${booking.id}/cancel`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      onCancelled(booking.id);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Unable to cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="theme-panel rounded-[20px] overflow-hidden">
      {/* Main row */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.color}`}>
              <Icon className="h-3 w-3" />
              {statusMeta.label}
            </span>
            <span className="text-xs text-white/30 font-mono">
              #{booking.confirmationNumber}
            </span>
          </div>

          <h3 className="mt-2 font-semibold text-white/85">
            {booking.listing?.title ?? `${booking.bookingType} Booking`}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
            {booking.listing?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {booking.listing.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {providerName}
            </span>
            {booking.checkIn && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(booking.checkIn).toLocaleDateString()}
                {booking.checkOut &&
                  ` – ${new Date(booking.checkOut).toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <p className="text-lg font-bold text-white">
            {booking.currency} {booking.totalAmount.toFixed(2)}
          </p>
          <p className="text-xs text-white/30">
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>

          {/* Rate button — only for completed bookings */}
          {isCompleted && (
            <button
              onClick={() => setRatingOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:border-white/25 hover:text-white/85 transition"
            >
              <Star className="h-3.5 w-3.5" />
              Rate
              {ratingOpen ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}

          {/* Cancel button — only for cancellable bookings */}
          {isCancellable && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-1.5 rounded-xl border border-[#ff5630]/20 px-4 py-2 text-xs font-medium text-[#ff5630]/70 hover:border-[#ff5630]/40 hover:text-[#ff5630] transition disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              {cancelling ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {cancelError && (
        <div className="px-5 pb-3">
          <p className="text-xs text-[#ff5630]">{cancelError}</p>
        </div>
      )}

      {/* Blind rating form — expands inline */}
      {isCompleted && ratingOpen && (
        <div className="border-t border-white/8 px-5 pb-5 pt-4">
          <BlindRatingForm
            bookingId={booking.id}
            perspective="explorer"
            targetName={providerName}
          />
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<ExplorerBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    apiFetch<{ bookings: ExplorerBookingRecord[] }>("/api/bookings")
      .then((d) => setBookings(d.bookings))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load bookings.")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  return (
    <ProtectedRoute requiredRole="explorer">
      <div className="theme-page">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <p className="theme-label text-xs uppercase tracking-[0.24em]">Your trips</p>
            <h1 className="theme-heading mt-2 text-3xl font-bold">Bookings</h1>
            <p className="theme-muted mt-2 text-sm leading-6">
              Confirmed stays, activities, dining, and transport — all in one place.
            </p>
          </div>

          {/* Status filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === f
                    ? "bg-[#ff5630] text-white"
                    : "theme-chip hover:bg-white/[0.08]"
                }`}
              >
                {f === "all" ? "All bookings" : (STATUS_STYLES[f]?.label ?? f)}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="theme-panel animate-pulse rounded-[20px] p-5 h-28" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="theme-panel rounded-[28px] p-12 text-center space-y-3">
              <Calendar className="mx-auto h-8 w-8 text-white/20" />
              <p className="font-semibold text-white/50">
                {filter === "all" ? "No bookings yet" : `No ${STATUS_STYLES[filter]?.label.toLowerCase() ?? filter} bookings`}
              </p>
              <p className="text-sm text-white/30 max-w-xs mx-auto">
                {filter === "all"
                  ? "Your confirmed stays, activities, and dining reservations will appear here."
                  : "Try switching to a different filter or check your full booking history."}
              </p>
              {filter === "all" && (
                <a
                  href="/accommodation"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  Browse stays
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancelled={(id) =>
                    setBookings((prev) =>
                      prev.map((b) =>
                        b.id === id ? { ...b, status: "CANCELLED" } : b
                      )
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

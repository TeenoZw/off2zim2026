"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, ShieldCheck, Users } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicListingRecord } from "@/types/platform";

export default function MarketplaceListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<PublicListingRecord | null>(null);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        const payload = await apiFetch<{ listing: PublicListingRecord }>(
          `/api/listings/${params.slug}`
        );
        setListing(payload.listing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listing.");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [params.slug]);

  const requestBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/marketplace/${params.slug}`)}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = await apiFetch<{
        booking: { id: string; status: string; confirmationNumber: string };
      }>(`/api/listings/${params.slug}/book`, {
        method: "POST",
        body: JSON.stringify({
          guests,
          checkIn: checkIn || null,
          checkOut: checkOut || null,
          specialRequests: specialRequests || null,
        }),
      });

      setMessage(
        `Booking ${payload.booking.status.toLowerCase()} with confirmation ${payload.booking.confirmationNumber}.`
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-500">Loading listing...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-500">{error || "Listing not found."}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-orange-200 via-orange-100 to-blue-100 flex items-center justify-center">
              <span className="text-lg font-medium text-slate-700">{listing.category}</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                    {listing.listingType}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-gray-900">{listing.title}</h1>
                </div>
                {listing.provider.hasVerifiedBadge ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    <ShieldCheck className="h-4 w-4" />
                    Verified partner
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </span>
                <span>{listing.provider.companyName}</span>
                <span>{listing.bookingMode === "instant" ? "Instant booking" : "Booking request"}</span>
              </div>

              <p className="mt-6 text-gray-700 leading-7">{listing.description}</p>

              {listing.amenities.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <p className="text-sm text-gray-500">Starting from</p>
            <div className="mt-1 text-4xl font-bold text-gray-900">
              {listing.basePrice ? `$${listing.basePrice}` : "Quote"}
            </div>
            <p className="mt-2 text-sm text-gray-500">{listing.currency}</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} guest{count > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(event) => setCheckIn(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(event) => setCheckOut(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special requests
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(event) => setSpecialRequests(event.target.value)}
                  className="w-full min-h-28 rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Pickup notes, dietary needs, preferred times, or anything the provider should know."
                />
              </div>
            </div>

            <button
              onClick={requestBooking}
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : listing.bookingMode === "instant"
                  ? "Book instantly"
                  : "Send booking request"}
            </button>

            {message ? (
              <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

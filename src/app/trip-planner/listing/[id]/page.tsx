"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { usePayment } from "@/contexts/PaymentContext";
import { apiFetch } from "@/lib/client-api";
import type { PublicListingRecord } from "@/types/platform";
import { publicListingToPlannerCatalogItem } from "@/lib/public-listing-adapter";

export default function TripPlannerListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addCatalogItem } = useTripPlanner();
  const { addToBooking } = usePayment();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [listing, setListing] = useState<PublicListingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        const payload = await apiFetch<{ listing: PublicListingRecord }>(
          `/api/listings/${params.id}`
        );
        setListing(payload.listing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listing.");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [params.id]);

  const plannerItem = useMemo(
    () => (listing ? publicListingToPlannerCatalogItem(listing) : null),
    [listing]
  );

  if (loading) {
    return <div className="theme-page p-8">Loading listing...</div>;
  }

  if (error || !listing || !plannerItem) {
    return <div className="theme-page p-8">{error || "Listing not found."}</div>;
  }

  const images = listing.images.length
    ? listing.images
    : [
        "/images/palm-river-hotel-604329-original.jpg",
        "/images/old-drift.jpg",
        "/images/ivoryLodge.jpg",
      ];

  const amenityLike = plannerItem.amenities || plannerItem.highlights || [];
  const policies = [
    ["Availability", plannerItem.availability],
    ["Recommended date", selectedDate || "Choose your date"],
    ["Pricing model", plannerItem.priceUnit],
    ["Provider", listing.provider.companyName],
  ];

  const handleAddToPlanner = () => {
    addCatalogItem(plannerItem, selectedDate ? { date: selectedDate } : {});
  };

  const handleBookNow = () => {
    addToBooking({
      id: listing.id,
      type:
        plannerItem.type === "activity"
          ? "activity"
          : plannerItem.type === "transport"
            ? "transport"
            : "accommodation",
      name: plannerItem.name,
      description: plannerItem.description,
      price: listing.basePrice || 0,
      currency: listing.currency,
      quantity: 1,
      checkIn: selectedDate || undefined,
      checkOut: selectedDate || undefined,
      guests,
      provider: {
        id: listing.provider.id,
        name: listing.provider.companyName,
        email: "",
      },
      metadata: {
        providerId: listing.provider.id,
        listingId: listing.id,
        slug: listing.slug,
        location: plannerItem.location,
        category: plannerItem.category,
        rating: plannerItem.rating,
      },
    });
    router.push("/checkout");
  };

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/trip-planner/search"
          className="theme-muted inline-flex items-center gap-2 text-sm transition hover:text-slate-950 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to results
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="theme-panel overflow-hidden rounded-[36px]">
            <div className="relative h-[420px]">
              <Image
                src={images[currentImageIndex]}
                alt={plannerItem.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-[#132417] px-4 py-2 text-sm text-[#8cf0a1]">
                {plannerItem.availability}
              </div>
              <div className="absolute right-5 top-5 flex gap-2">
                <button className="rounded-full bg-[#111111]/85 p-3 text-white/80 backdrop-blur">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-[#111111]/85 p-3 text-white/80 backdrop-blur">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-5 left-5 rounded-full bg-black/35 px-4 py-2 text-sm text-white backdrop-blur">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 p-4">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 overflow-hidden rounded-[22px] border ${
                    currentImageIndex === index
                      ? "border-black/40 dark:border-white/40"
                      : "border-black/10 dark:border-white/10"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${plannerItem.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-xs uppercase tracking-[0.28em]">
              {plannerItem.category}
            </p>
            <h1 className="theme-heading mt-3 text-4xl font-semibold">
              {plannerItem.name}
            </h1>

            <div className="theme-muted mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#ff7352]" />
                {plannerItem.location}
              </span>
              {plannerItem.maxGuests && (
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#5aa7ff]" />
                  Up to {plannerItem.maxGuests} guests
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                {plannerItem.rating} ({plannerItem.reviews} bookings)
              </span>
            </div>

            <p className="theme-muted mt-6 text-sm leading-7">
              {plannerItem.description}
            </p>

            <div className="theme-card-soft mt-8 rounded-[30px] p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="theme-subtle text-sm">From</div>
                  <div className="theme-heading mt-1 text-4xl font-semibold">
                    {plannerItem.price}
                    <span className="theme-subtle ml-1 text-lg">{plannerItem.priceUnit}</span>
                  </div>
                </div>
                <div className="theme-chip rounded-full px-4 py-2 text-sm">
                  {listing.bookingMode === "instant" ? "Instant booking" : "Request booking"}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="theme-input rounded-2xl px-4 py-3 text-sm"
                />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="theme-input rounded-2xl px-4 py-3 text-sm"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleBookNow}
                  className="flex-1 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white"
                >
                  Book now
                </button>
                <button
                  onClick={handleAddToPlanner}
                  className="theme-button-secondary flex-1 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  Add to planner
                </button>
              </div>

              <div className="theme-muted mt-6 border-t border-black/10 pt-5 text-sm dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {listing.provider.location}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact available after booking request
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {listing.provider.companyName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <h2 className="theme-heading text-2xl font-semibold">Amenities and planning context</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenityLike.map((amenity) => (
                <div
                  key={amenity}
                  className="theme-card-soft rounded-[24px] p-4 text-sm"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <h2 className="theme-heading text-2xl font-semibold">Policies and timing</h2>
            <div className="mt-5 space-y-3">
              {policies.map(([label, value]) => (
                <PolicyRow key={label} label={label} value={value} />
              ))}
            </div>

            <div className="theme-card-soft mt-8 rounded-[28px] p-5">
              <div className="theme-muted flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-[#ff7352]" />
                Best used with Trip Planner
              </div>
              <p className="theme-muted mt-2 text-sm leading-6">
                Add it to your itinerary, compare it against the rest of your dates,
                and keep the total trip budget visible as you build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="theme-card-soft flex items-start justify-between gap-4 rounded-[24px] p-4 text-sm">
      <span className="theme-subtle">{label}</span>
      <span className="theme-muted max-w-xs text-right">{value}</span>
    </div>
  );
}

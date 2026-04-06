"use client";

import { useRouter } from "next/navigation";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import { Clock3, MapPin, Star, UtensilsCrossed } from "lucide-react";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";

const sampleRestaurants = [
  {
    id: "rest-001",
    name: "Victoria Falls Safari Lodge Restaurant",
    description:
      "Bush-facing dining with stronger atmosphere, higher-value memory making, and polished evening service.",
    price: 75,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "International and local",
    rating: 4.8,
    image: "/images/victoria-falls.jpg",
    reservationTime: ["18:00", "19:00", "20:00"],
  },
  {
    id: "rest-002",
    name: "The Boma",
    description:
      "A social, culture-led dinner experience that works well inside an evening events or destination stay flow.",
    price: 55,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "Traditional Zimbabwean",
    rating: 4.6,
    image: "/images/jacaranda.JPG",
    reservationTime: ["18:30", "19:30"],
  },
  {
    id: "rest-003",
    name: "Mukwa Lodge Restaurant",
    description:
      "A quieter lodge dining moment for travelers wanting a more intimate atmosphere with less crowd energy.",
    price: 65,
    currency: "USD",
    category: "dining",
    location: "Hwange",
    cuisine: "Farm-to-table",
    rating: 4.7,
    image: "/images/hwange-bush-camp-548548-original.jpg",
    reservationTime: ["19:00", "20:00"],
  },
];

export default function RestaurantsPage() {
  const router = useRouter();
  const { addToBooking, items } = usePayment();
  const bookingItems = items ?? [];

  const handleBookRestaurant = (
    restaurant: (typeof sampleRestaurants)[0],
    selectedTime?: string,
    guests = 2
  ) => {
    const bookingItem: BookingItem = {
      id: restaurant.id,
      type: "activity",
      name: restaurant.name,
      description: restaurant.description,
      price: restaurant.price,
      currency: restaurant.currency,
      category: restaurant.category,
      quantity: guests,
      metadata: {
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        image: restaurant.image,
        reservationTime: selectedTime || restaurant.reservationTime[0],
      },
    };

    addToBooking(bookingItem);
    router.push("/checkout");
  };

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Dining
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Add the evening moments that make the route memorable
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Dining should feel like part of the itinerary, not a disconnected
                booking. These curated restaurant moments help travelers place the
                right meal in the right city at the right time.
              </p>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Restaurants" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Dining moments"
          title="Place the right meal in the right stop"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {sampleRestaurants.map((restaurant) => (
            <article key={restaurant.id} className="theme-card overflow-hidden">
              <div
                className="min-h-[220px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48)), url('${restaurant.image}')`,
                }}
              />
              <div className="p-5">
                <div className="theme-label text-xs uppercase tracking-[0.24em]">Dining moment</div>
                <h2 className="theme-heading mt-2 text-xl font-semibold">{restaurant.name}</h2>
                <p className="theme-muted mt-3 text-sm leading-6">{restaurant.description}</p>

                <div className="theme-muted mt-4 space-y-2 text-sm">
                  <div className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ff7352]" />
                    {restaurant.location}
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-[#5aa7ff]" />
                    {restaurant.cuisine}
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#8cf0a1]" />
                    {restaurant.reservationTime.join(", ")}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[#ffca74] text-[#ffca74]" />
                    <span className="theme-heading text-lg font-semibold">{restaurant.rating}</span>
                  </div>
                  <div className="theme-heading text-lg font-semibold">
                    ${restaurant.price}
                    <span className="theme-muted ml-1 text-sm">pp</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookRestaurant(restaurant)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
                >
                  Reserve dining
                </button>
              </div>
            </article>
          ))}
        </div>

        {bookingItems.length > 0 ? (
          <div className="theme-panel mt-6 rounded-[28px] p-6 text-center">
            <p className="theme-muted text-sm">
              You have {bookingItems.length} item{bookingItems.length !== 1 ? "s" : ""} in your booking cart.
            </p>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 inline-flex rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white"
            >
              Continue to checkout
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import { Clock3, MapPin, Minus, Plus, Star, Users, UtensilsCrossed } from "lucide-react";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";

const sampleRestaurants = [
  {
    id: "rest-001",
    name: "Victoria Falls Safari Lodge Restaurant",
    description: "Elevated dining with open views across the bushveld — best suited for a long, unhurried evening during your Victoria Falls stay.",
    price: 75,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "International & local",
    rating: 4.8,
    image: "/images/victoria-falls.jpg",
    reservationTimes: ["18:00", "19:00", "20:00"],
  },
  {
    id: "rest-002",
    name: "The Boma",
    description: "Traditional drums, communal seating, and a parade of Zimbabwean dishes — as much of an experience as it is a meal.",
    price: 55,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "Traditional Zimbabwean",
    rating: 4.6,
    image: "/images/jacaranda.JPG",
    reservationTimes: ["18:30", "19:30"],
  },
  {
    id: "rest-003",
    name: "Mukwa Lodge Restaurant",
    description: "Intimate farm-to-table dining in a quieter lodge setting — ideal for evenings away from the main tourist circuit.",
    price: 65,
    currency: "USD",
    category: "dining",
    location: "Hwange",
    cuisine: "Farm-to-table",
    rating: 4.7,
    image: "/images/hwange-bush-camp-548548-original.jpg",
    reservationTimes: ["19:00", "20:00"],
  },
];

type Restaurant = typeof sampleRestaurants[0];

function RestaurantCard({ restaurant, onBook }: { restaurant: Restaurant; onBook: (r: Restaurant, time: string, guests: number, dietary: string) => void }) {
  const [selectedTime, setSelectedTime] = useState(restaurant.reservationTimes[0]);
  const [guests, setGuests] = useState(2);
  const [dietary, setDietary] = useState("");

  return (
    <article className="theme-card overflow-hidden">
      <div
        className="min-h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48)), url('${restaurant.image}')`,
        }}
      />
      <div className="p-5">
        <div className="theme-label text-xs uppercase tracking-[0.24em]">{restaurant.cuisine}</div>
        <h2 className="theme-heading mt-2 text-xl font-semibold">{restaurant.name}</h2>
        <p className="theme-muted mt-3 text-sm leading-6">{restaurant.description}</p>

        <div className="theme-muted mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#ff7352]" />
            {restaurant.location}
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-[#5aa7ff]" />
            {restaurant.cuisine}
          </div>
        </div>

        {/* Time selector */}
        <div className="mt-5">
          <p className="theme-subtle text-xs mb-2 flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" /> Select a time
          </p>
          <div className="flex flex-wrap gap-2">
            {restaurant.reservationTimes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedTime === t
                    ? "bg-[#ff5630] text-white"
                    : "theme-chip hover:bg-white/[0.1]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Guests selector */}
        <div className="mt-4 flex items-center gap-3">
          <Users className="h-4 w-4 text-white/40" />
          <span className="theme-subtle text-sm">Guests</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 hover:bg-white/[0.07] transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="theme-heading w-6 text-center text-sm font-semibold">{guests}</span>
            <button
              onClick={() => setGuests((g) => g + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 hover:bg-white/[0.07] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <Star className="h-5 w-5 fill-[#ffca74] text-[#ffca74]" />
            <span className="theme-heading text-lg font-semibold">{restaurant.rating}</span>
          </div>
          <div className="theme-heading text-lg font-semibold">
            ${restaurant.price}
            <span className="theme-muted ml-1 text-sm">pp</span>
          </div>
        </div>

        <div className="mt-2 text-right theme-subtle text-xs">
          Total: ${(restaurant.price * guests).toFixed(2)} · {guests} guest{guests !== 1 ? "s" : ""} · {selectedTime}
        </div>

        {/* Dietary / special requests */}
        <div className="mt-4">
          <label className="block text-xs theme-subtle mb-1.5">Dietary needs / notes (optional)</label>
          <input
            type="text"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. vegetarian, nut allergy, high chair needed…"
            className="theme-input w-full rounded-[12px] px-3 py-2 text-xs"
          />
        </div>

        <button
          onClick={() => onBook(restaurant, selectedTime, guests, dietary)}
          className="mt-4 w-full rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
        >
          Reserve dining
        </button>
      </div>
    </article>
  );
}

export default function RestaurantsPage() {
  const router = useRouter();
  const { addToBooking } = usePayment();

  const handleBookRestaurant = (restaurant: Restaurant, selectedTime: string, guests: number, dietary: string) => {
    const bookingItem: BookingItem = {
      id: `${restaurant.id}-${Date.now()}`,
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
        reservationTime: selectedTime,
        allTimes: restaurant.reservationTimes,
        dietaryNotes: dietary || null,
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
                Reserve a table at the places worth the stop — from cultural dinner
                experiences in Victoria Falls to lodge dining deep in the bush.
                Each restaurant is bookable and ready to sit inside your itinerary.
              </p>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{
                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
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
          eyebrow="Curated dining"
          title="Reserve meals worth the stop"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {sampleRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onBook={handleBookRestaurant}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { usePayment } from "../../contexts/PaymentContext";
import { BookingItem } from "../../types/payment";

// Import hotel booking components from the existing structure
import {
  Header9,
  Layout249,
  Layout3,
  Layout4,
  Testimonial14,
  Pricing5,
  Cta1,
  Faq3,
} from "../../components/hotel-booking";

// Sample hotel data
const sampleHotels = [
  {
    id: "hotel_1",
    name: "Victoria Falls Safari Lodge",
    description: "Luxury safari lodge with stunning waterfall views",
    price: 250,
    currency: "USD",
    category: "accommodation",
    location: "Victoria Falls",
    amenities: ["Free WiFi", "Pool", "Safari Tours", "Restaurant"],
    rating: 4.8,
    image: "/images/victoria-falls-lodge.jpg",
  },
  {
    id: "hotel_2",
    name: "Elephant Hills Resort",
    description: "Premium resort in the heart of Victoria Falls",
    price: 180,
    currency: "USD",
    category: "accommodation",
    location: "Victoria Falls",
    amenities: ["Free WiFi", "Pool", "Spa", "Golf Course"],
    rating: 4.6,
    image: "/images/elephant-hills.jpg",
  },
  {
    id: "hotel_3",
    name: "Camp Amalinda",
    description: "Exclusive safari camp in Matobo National Park",
    price: 420,
    currency: "USD",
    category: "accommodation",
    location: "Matobo Hills",
    amenities: ["All Inclusive", "Game Drives", "Rock Art Tours", "Spa"],
    rating: 4.9,
    image: "/images/camp-amalinda.jpg",
  },
];

export default function HotelsPage() {
  const router = useRouter();
  const { addToCart, items } = usePayment();

  const handleBookHotel = (hotel: (typeof sampleHotels)[0]) => {
    const bookingItem: BookingItem = {
      id: hotel.id,
      type: "accommodation",
      name: hotel.name,
      description: hotel.description,
      price: hotel.price,
      currency: hotel.currency,
      category: hotel.category,
      quantity: 1,
      metadata: {
        location: hotel.location,
        amenities: hotel.amenities,
        rating: hotel.rating,
        image: hotel.image,
      },
    };

    addToCart(bookingItem);
    router.push("/checkout");
  };

  return (
    <>
      {/* Hotel Booking Hero Section */}
      <div className="relative">
        <Header9 />

        {/* Enhanced booking buttons */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pointer-events-auto">
            {sampleHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {hotel.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-primary">
                    ${hotel.price}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="ml-1 text-sm">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {hotel.amenities.slice(0, 2).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-xs rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleBookHotel(hotel)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Book Now - ${hotel.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Layout249 />
      <Layout3 />
      <Layout4 />
      <Testimonial14 />
      <Pricing5 />
      <Cta1 />
      <Faq3 />
    </>
  );
}

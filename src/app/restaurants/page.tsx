"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";

// Import dining reservation components
import {
  Navbar3,
  Header44,
  Layout1,
  Layout240,
  Layout249,
  Layout12,
  Testimonial1,
  Cta27,
  Faq2,
  Footer1,
} from "../../components/dining-reservations";

// Sample restaurant data compatible with payment system
const sampleRestaurants = [
  {
    id: "rest-001",
    name: "Victoria Falls Safari Lodge Restaurant",
    description:
      "Elegant dining with stunning views of the African bush, serving international and local cuisine.",
    price: 75,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "International & Local",
    rating: 4.8,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$$",
    reservationTime: ["6:00 PM", "7:00 PM", "8:00 PM"],
    capacity: 120,
  },
  {
    id: "rest-002",
    name: "The Boma Restaurant",
    description:
      "Traditional Zimbabwean dining experience with cultural entertainment and authentic local dishes.",
    price: 55,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "Traditional Zimbabwean",
    rating: 4.6,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$",
    reservationTime: ["6:30 PM", "7:30 PM"],
    capacity: 80,
  },
  {
    id: "rest-003",
    name: "Elephant Hills Resort Restaurant",
    description:
      "Fine dining with panoramic views of the Zambezi River, featuring gourmet cuisine and wine pairings.",
    price: 95,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "Gourmet International",
    rating: 4.9,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$$$",
    reservationTime: ["7:00 PM", "8:00 PM", "9:00 PM"],
    capacity: 60,
  },
  {
    id: "rest-004",
    name: "Café Zambezi",
    description:
      "Casual riverside dining with fresh local ingredients, perfect for lunch or casual dinner.",
    price: 35,
    currency: "USD",
    category: "dining",
    location: "Victoria Falls",
    cuisine: "Continental & Local",
    rating: 4.4,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$",
    reservationTime: ["12:00 PM", "1:00 PM", "6:00 PM", "7:00 PM"],
    capacity: 45,
  },
  {
    id: "rest-005",
    name: "Mukwa Lodge Restaurant",
    description:
      "Intimate lodge dining with farm-to-table cuisine and exceptional service in a tranquil setting.",
    price: 65,
    currency: "USD",
    category: "dining",
    location: "Hwange",
    cuisine: "Farm-to-Table",
    rating: 4.7,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$$",
    reservationTime: ["7:00 PM", "8:00 PM"],
    capacity: 30,
  },
  {
    id: "rest-006",
    name: "Antelope Park Restaurant",
    description:
      "Bush dining experience with game viewing opportunities and traditional African cuisine.",
    price: 50,
    currency: "USD",
    category: "dining",
    location: "Gweru",
    cuisine: "African Traditional",
    rating: 4.5,
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    priceRange: "$$",
    reservationTime: ["6:00 PM", "7:00 PM"],
    capacity: 40,
  },
];

export default function RestaurantsPage() {
  const router = useRouter();
  const { addToBooking, items } = usePayment();

  const handleBookRestaurant = (
    restaurant: (typeof sampleRestaurants)[0],
    selectedTime?: string,
    guests?: number
  ) => {
    const bookingItem: BookingItem = {
      id: restaurant.id,
      type: "activity",
      name: restaurant.name,
      description: restaurant.description,
      price: restaurant.price,
      currency: restaurant.currency,
      category: restaurant.category,
      quantity: guests || 2, // Default to 2 guests
      metadata: {
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        image: restaurant.image,
        priceRange: restaurant.priceRange,
        reservationTime: selectedTime || restaurant.reservationTime[0],
        capacity: restaurant.capacity,
      },
    };

    addToBooking(bookingItem);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen">
      {/* Dining Components */}
      <Navbar3 />
      <Header44 />
      <Layout1 />

      {/* Enhanced Restaurant Booking Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-4xl font-bold md:text-5xl lg:text-6xl">
              Book Your Perfect Dining Experience
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl">
              Reserve your table at Zimbabwe's finest restaurants and discover
              exceptional cuisine
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sampleRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                    <span className="text-lg font-semibold text-green-600">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{restaurant.location}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="ml-1">{restaurant.rating}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Cuisine: </span>
                    <span className="text-gray-600">{restaurant.cuisine}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Available Times: </span>
                    <span className="text-gray-600">
                      {restaurant.reservationTime.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold">
                        ${restaurant.price}
                      </span>
                      <span className="text-gray-500 text-sm"> per person</span>
                    </div>
                    <button
                      onClick={() => handleBookRestaurant(restaurant)}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      Reserve Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Status */}
          {items && items.length > 0 && (
            <div className="mt-12 rounded-lg bg-blue-50 border border-blue-200 p-6 text-center">
              <p className="text-blue-800 font-medium">
                You have {items.length} item(s) in your booking cart
              </p>
              <button
                onClick={() => router.push("/checkout")}
                className="mt-3 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </section>

      <Layout240 />
      <Layout249 />
      <Layout12 />
      <Testimonial1 />
      <Cta27 />
      <Faq2 />
      <Footer1 />
    </div>
  );
}

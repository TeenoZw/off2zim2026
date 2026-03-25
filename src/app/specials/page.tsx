import React from "react";
import { StarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

export default function SpecialsPage() {
  const specials = [
    {
      id: 1,
      title: "Victoria Falls Adventure Package",
      description:
        "3 days, 2 nights including helicopter rides, white water rafting, and sunset cruise",
      originalPrice: "$899",
      specialPrice: "$649",
      discount: "28%",
      image: "/images/victoria-falls.jpg",
      location: "Victoria Falls",
      duration: "3 Days",
      rating: 4.8,
      reviews: 234,
      validUntil: "2024-12-31",
      features: [
        "Helicopter Ride",
        "White Water Rafting",
        "Sunset Cruise",
        "Hotel Included",
      ],
    },
    {
      id: 2,
      title: "Hwange Safari Experience",
      description:
        "4 days, 3 nights wildlife safari with game drives and bush walks",
      originalPrice: "$1,299",
      specialPrice: "$899",
      discount: "31%",
      image: "/images/hwange-safari.jpg",
      location: "Hwange National Park",
      duration: "4 Days",
      rating: 4.9,
      reviews: 189,
      validUntil: "2024-11-30",
      features: [
        "Game Drives",
        "Bush Walks",
        "All Meals",
        "Professional Guide",
      ],
    },
    {
      id: 3,
      title: "Great Zimbabwe Cultural Tour",
      description:
        "2 days exploring ancient ruins and local culture with traditional meals",
      originalPrice: "$399",
      specialPrice: "$299",
      discount: "25%",
      image: "/images/great-zimbabwe.jpg",
      location: "Masvingo",
      duration: "2 Days",
      rating: 4.7,
      reviews: 156,
      validUntil: "2024-10-31",
      features: [
        "Cultural Tour",
        "Traditional Meals",
        "Local Guide",
        "Transport",
      ],
    },
    {
      id: 4,
      title: "Eastern Highlands Retreat",
      description:
        "5 days in the mountains with hiking, fishing, and scenic views",
      originalPrice: "$699",
      specialPrice: "$499",
      discount: "29%",
      image: "/images/eastern-highlands.jpg",
      location: "Nyanga",
      duration: "5 Days",
      rating: 4.6,
      reviews: 98,
      validUntil: "2024-12-15",
      features: ["Mountain Hiking", "Fishing", "Scenic Views", "Lodge Stay"],
    },
    {
      id: 5,
      title: "Lake Kariba Houseboat Holiday",
      description:
        "6 days on a luxury houseboat with fishing, swimming, and wildlife viewing",
      originalPrice: "$1,599",
      specialPrice: "$1,199",
      discount: "25%",
      image: "/images/lake-kariba.jpg",
      location: "Lake Kariba",
      duration: "6 Days",
      rating: 4.8,
      reviews: 167,
      validUntil: "2024-11-15",
      features: [
        "Luxury Houseboat",
        "Fishing",
        "Wildlife Viewing",
        "All Inclusive",
      ],
    },
    {
      id: 6,
      title: "Mana Pools Canoe Safari",
      description:
        "4 days canoeing the Zambezi with camping and wildlife encounters",
      originalPrice: "$799",
      specialPrice: "$599",
      discount: "25%",
      image: "/images/mana-pools.jpg",
      location: "Mana Pools",
      duration: "4 Days",
      rating: 4.9,
      reviews: 203,
      validUntil: "2024-10-30",
      features: [
        "Canoe Safari",
        "Camping",
        "Wildlife Encounters",
        "Expert Guide",
      ],
    },
  ];

  return (
    <>
      {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Exclusive Travel Specials
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Discover Zimbabwe with our limited-time offers and special
                packages
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                <TagIcon className="w-5 h-5" />
                <span className="font-medium">
                  Save up to 31% on selected packages
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Specials Grid */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specials.map((special) => (
                <div
                  key={special.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gray-200">
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{special.discount} OFF
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">
                          Valid until{" "}
                          {new Date(special.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {/* Placeholder for image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        Image Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{special.location}</span>
                      <span className="mx-2">•</span>
                      <CalendarIcon className="w-4 h-4" />
                      <span>{special.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      {special.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {special.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(special.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {special.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({special.reviews} reviews)
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {special.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {special.features.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{special.features.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {special.originalPrice}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {special.specialPrice}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="btn-primary w-full rounded-2xl">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Never Miss a Special Offer
              </h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter and be the first to know about
                exclusive deals and limited-time offers.
              </p>
              <div className="newsletter-form max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-standard flex-1"
                />
                <button className="btn-primary rounded-2xl whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

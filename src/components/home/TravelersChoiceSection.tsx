"use client";

import React, { useState, useEffect } from "react";
import { Star, Heart, MapPin, Camera, Quote, ArrowRight, Trophy } from "lucide-react";

interface Review {
  id: number;
  author: string;
  avatar: string;
  country: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  images: string[];
  helpful: number;
  destination: string;
  verified: boolean;
}

interface TravelersChoice {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  award: string;
  location: string;
  price?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "/images/reviews/sarah.jpg",
    country: "United States",
    rating: 5,
    title: "Absolutely Breathtaking Experience at Victoria Falls",
    content:
      "Victoria Falls exceeded all my expectations! The sound of the water, the mist, and the incredible views were simply magical. Our guide was knowledgeable and made the experience even more special. The sunset cruise was the perfect ending to our day.",
    date: "2025-05-15",
    images: [
      "/images/reviews/victoria-falls-1.jpg",
      "/images/reviews/victoria-falls-2.jpg",
    ],
    helpful: 24,
    destination: "Victoria Falls",
    verified: true,
  },
  {
    id: 2,
    author: "James Thompson",
    avatar: "/images/reviews/james.jpg",
    country: "United Kingdom",
    rating: 5,
    title: "Incredible Safari Experience in Hwange",
    content:
      "The wildlife viewing in Hwange National Park was phenomenal. We saw elephants, lions, leopards, and countless other animals. The camp accommodation was comfortable and the staff was exceptional. Highly recommend for any wildlife enthusiast!",
    date: "2025-05-10",
    images: ["/images/reviews/hwange-1.jpg"],
    helpful: 18,
    destination: "Hwange National Park",
    verified: true,
  },
  {
    id: 3,
    author: "Maria Santos",
    avatar: "/images/reviews/maria.jpg",
    country: "Brazil",
    rating: 5,
    title: "Cultural Journey Through Great Zimbabwe",
    content:
      "Learning about the ancient civilization at Great Zimbabwe was fascinating. The stone structures are impressive and our local guide shared incredible stories about the history. A must-visit for anyone interested in African heritage.",
    date: "2025-05-08",
    images: ["/images/reviews/great-zimbabwe-1.jpg"],
    helpful: 15,
    destination: "Great Zimbabwe",
    verified: true,
  },
  {
    id: 4,
    author: "Michael Chen",
    avatar: "/images/reviews/michael.jpg",
    country: "Australia",
    rating: 4,
    title: "Perfect Lake Kariba Getaway",
    content:
      "The houseboat experience on Lake Kariba was relaxing and beautiful. Great fishing, stunning sunsets, and peaceful atmosphere. Perfect for disconnecting from the busy world and enjoying nature.",
    date: "2025-05-05",
    images: ["/images/reviews/kariba-1.jpg", "/images/reviews/kariba-2.jpg"],
    helpful: 12,
    destination: "Lake Kariba",
    verified: true,
  },
];

const travelersChoices: TravelersChoice[] = [
  {
    id: 1,
    title: "Victoria Falls Guided Tours",
    description:
      "Expert-led tours to one of the Seven Natural Wonders of the World",
    image: "/images/choice/victoria-falls-tour.jpg",
    category: "Sightseeing",
    rating: 4.9,
    reviewCount: 2847,
    award: "Travelers' Choice 2025",
    location: "Victoria Falls",
    price: "from USD 45",
  },
  {
    id: 2,
    title: "Hwange Safari Lodge",
    description:
      "Luxury safari experience in Zimbabwe's premier wildlife destination",
    image: "/images/choice/hwange-lodge.jpg",
    category: "Accommodation",
    rating: 4.8,
    reviewCount: 1923,
    award: "Best Safari Lodge 2025",
    location: "Hwange National Park",
    price: "from USD 280/night",
  },
  {
    id: 3,
    title: "Mana Pools Canoe Safari",
    description: "Unique wildlife viewing experience from the water",
    image: "/images/choice/mana-pools-canoe.jpg",
    category: "Adventure",
    rating: 4.7,
    reviewCount: 1456,
    award: "Best Adventure Tour 2025",
    location: "Mana Pools",
    price: "from USD 120",
  },
  {
    id: 4,
    title: "Old Drift Lodge",
    description: "Luxury accommodation with spectacular Victoria Falls views",
    image: "/images/choice/old-drift-lodge.jpg",
    category: "Accommodation",
    rating: 4.9,
    reviewCount: 987,
    award: "Luxury Hotel Award 2025",
    location: "Victoria Falls",
    price: "from USD 450/night",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function TravelersChoiceSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-off2zim-sunset/5 via-white/90 to-off2zim-primary/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-off2zim-earth mb-4">
            Travelers&apos; Choice & Reviews
          </h2>
          <p className="text-lg md:text-xl text-off2zim-earth/70 max-w-3xl mx-auto">
            Discover award-winning experiences and read authentic reviews from
            travelers who have explored Zimbabwe&apos;s incredible destinations.
          </p>
        </div>

        {/* Travelers' Choice Awards */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-off2zim-sunset to-off2zim-primary rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-off2zim-earth">
                Travelers&apos; Choice Awards 2025
              </h3>
            </div>
          </div>

          <div
            className={`grid gap-4 md:gap-6 ${
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {travelersChoices.map((choice) => (
              <div
                key={choice.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-off2zim-primary/10"
              >
                {/* Image & Award Badge */}
                <div
                  className={`relative overflow-hidden ${
                    isMobile ? "h-40" : "h-48"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${choice.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Award Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-off2zim-sunset to-off2zim-primary text-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-medium">Award Winner</span>
                  </div>

                  {/* Category */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-xs font-medium text-gray-800">
                      {choice.category}
                    </span>
                  </div>

                  {/* Price */}
                  {choice.price && (
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-off2zim-primary to-off2zim-earth text-white rounded px-2 py-1">
                      <span className="text-xs font-medium">
                        {choice.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`${isMobile ? "p-4" : "p-6"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-off2zim-earth group-hover:text-off2zim-primary transition-colors line-clamp-2">
                      {choice.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-off2zim-sunset fill-current" />
                      <span className="text-sm font-medium text-off2zim-earth">
                        {choice.rating}
                      </span>
                    </div>
                    <span className="text-xs text-off2zim-earth/60">
                      ({choice.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-off2zim-earth/60 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{choice.location}</span>
                  </div>

                  <p className="text-off2zim-earth/80 text-sm mb-3 line-clamp-2">
                    {choice.description}
                  </p>

                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-off2zim-sunset">
                    <Trophy className="h-3.5 w-3.5" />
                    {choice.award}
                  </div>

                  <button className="w-full text-off2zim-primary hover:bg-gradient-to-r hover:from-off2zim-primary hover:to-off2zim-earth hover:text-white border border-off2zim-primary py-2 px-3 rounded text-sm transition-all duration-300 flex items-center justify-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-off2zim-earth mb-8 text-center">
            What Travelers Say
          </h3>

          <div
            className={`grid gap-6 md:gap-8 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 border border-off2zim-primary/10 hover:border-off2zim-primary/20"
              >
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full bg-cover bg-center bg-off2zim-earth/20"
                      style={{ backgroundImage: `url(${review.avatar})` }}
                    />
                    {review.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-off2zim-primary to-off2zim-earth rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-off2zim-earth">
                          {review.author}
                        </h5>
                        <p className="text-sm text-off2zim-earth/60">
                          {review.country}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-off2zim-sunset fill-current"
                                  : "text-off2zim-earth/20"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-off2zim-earth/50 mt-1">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h6 className="font-semibold text-off2zim-earth mb-2">
                    {review.title}
                  </h6>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-off2zim-primary opacity-20" />
                    <p className="text-off2zim-earth/80 text-sm leading-relaxed pl-4">
                      {review.content}
                    </p>
                  </div>
                </div>

                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-20 h-20 rounded-lg bg-cover bg-center bg-off2zim-earth/10 cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-off2zim-primary/20 hover:ring-off2zim-primary/40"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-off2zim-primary/10">
                  <div className="flex items-center space-x-4 text-sm text-off2zim-earth/60">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{review.destination}</span>
                    </div>
                    {review.images.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Camera className="w-4 h-4" />
                        <span>
                          {review.images.length} photo
                          {review.images.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <button className="flex items-center space-x-1 text-off2zim-earth/60 hover:text-off2zim-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Reviews CTA */}
          <div className="text-center mt-8 md:mt-12">
            <button className="bg-gradient-to-r from-off2zim-primary to-off2zim-earth text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-2">
              <span>Read All Reviews</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

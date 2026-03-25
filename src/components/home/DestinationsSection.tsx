"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Star, ArrowRight, Cloud, Sun } from "lucide-react";
import { MobileCard } from "../ui/MobileCard";
import { MobileCategoryList } from "../ui/MobileCategoryList";

interface Destination {
  id: number;
  name: string;
  region: string;
  image: string;
  description: string;
  highlights: string[];
  weather: {
    temp: string;
    condition: string;
    icon: "sun" | "cloud" | "rain";
  };
  rating: number;
  reviewCount: number;
  startingPrice: string;
  featured?: boolean;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Victoria Falls",
    region: "Matabeleland North",
    image: "/images/destinations/victoria-falls.jpg",
    description:
      "One of the Seven Natural Wonders of the World, offering breathtaking views and thrilling adventures.",
    highlights: [
      "UNESCO World Heritage",
      "Adventure Activities",
      "Wildlife Viewing",
      "Luxury Lodges",
    ],
    weather: { temp: "28°C", condition: "Sunny", icon: "sun" },
    rating: 4.9,
    reviewCount: 2847,
    startingPrice: "USD 45",
    featured: true,
  },
  {
    id: 2,
    name: "Hwange National Park",
    region: "Matabeleland North",
    image: "/images/destinations/hwange.jpg",
    description:
      "Zimbabwe's largest national park, home to over 100 mammal species and 400 bird species.",
    highlights: [
      "Big Five Safari",
      "Elephant Herds",
      "Game Drives",
      "Bush Camps",
    ],
    weather: { temp: "32°C", condition: "Clear", icon: "sun" },
    rating: 4.8,
    reviewCount: 1923,
    startingPrice: "USD 85",
    featured: true,
  },
  {
    id: 3,
    name: "Mana Pools",
    region: "Mashonaland Central",
    image: "/images/destinations/mana-pools.jpg",
    description:
      "A UNESCO World Heritage Site known for its exceptional beauty and wildlife diversity.",
    highlights: [
      "Canoe Safaris",
      "Walking Safaris",
      "Zambezi River",
      "Wild Dogs",
    ],
    weather: { temp: "30°C", condition: "Partly Cloudy", icon: "cloud" },
    rating: 4.7,
    reviewCount: 1456,
    startingPrice: "USD 120",
  },
  {
    id: 4,
    name: "Great Zimbabwe",
    region: "Masvingo",
    image: "/images/destinations/great-zimbabwe.jpg",
    description:
      "Ancient stone city ruins that gave Zimbabwe its name, showcasing remarkable medieval architecture.",
    highlights: [
      "UNESCO World Heritage",
      "Stone Ruins",
      "History Tours",
      "Cultural Experience",
    ],
    weather: { temp: "26°C", condition: "Sunny", icon: "sun" },
    rating: 4.6,
    reviewCount: 892,
    startingPrice: "USD 25",
  },
  {
    id: 5,
    name: "Lake Kariba",
    region: "Mashonaland West",
    image: "/images/destinations/lake-kariba.jpg",
    description:
      "One of the world's largest man-made lakes, perfect for fishing, boating, and relaxation.",
    highlights: [
      "Houseboat Cruises",
      "Tiger Fishing",
      "Sunset Views",
      "Water Sports",
    ],
    weather: { temp: "29°C", condition: "Clear", icon: "sun" },
    rating: 4.5,
    reviewCount: 1234,
    startingPrice: "USD 75",
    featured: true,
  },
  {
    id: 6,
    name: "Matobo Hills",
    region: "Matabeleland South",
    image: "/images/destinations/matobo.jpg",
    description:
      "Mystical granite formations with ancient rock art and spiritual significance.",
    highlights: [
      "Rock Formations",
      "Cave Paintings",
      "Rhino Tracking",
      "Scenic Views",
    ],
    weather: { temp: "24°C", condition: "Partly Cloudy", icon: "cloud" },
    rating: 4.7,
    reviewCount: 756,
    startingPrice: "USD 35",
  },
  {
    id: 7,
    name: "Eastern Highlands",
    region: "Manicaland",
    image: "/images/destinations/eastern-highlands.jpg",
    description:
      "Mountainous region with cool climate, waterfalls, and excellent hiking opportunities.",
    highlights: [
      "Mountain Hiking",
      "Waterfalls",
      "Cool Climate",
      "Tea Plantations",
    ],
    weather: { temp: "18°C", condition: "Cool", icon: "cloud" },
    rating: 4.4,
    reviewCount: 645,
    startingPrice: "USD 40",
  },
];

const WeatherIcon = ({ icon }: { icon: "sun" | "cloud" | "rain" }) => {
  switch (icon) {
    case "sun":
      return <Sun className="w-4 h-4" />;
    case "cloud":
      return <Cloud className="w-4 h-4" />;
    default:
      return <Sun className="w-4 h-4" />;
  }
};

export default function DestinationsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Categories for mobile filtering
  const categories = [
    { id: "All", title: "All", icon: "map" },
    { id: "National Parks", title: "National Parks", icon: "nature" },
    { id: "Heritage Sites", title: "Heritage Sites", icon: "heritage" },
    { id: "Adventure", title: "Adventure", icon: "adventure" },
    { id: "Lakes & Rivers", title: "Lakes & Rivers", icon: "camera" },
  ];

  // Filter destinations based on category
  const getFilteredDestinations = () => {
    if (selectedCategory === "All") return destinations;
    return destinations.filter((dest) =>
      dest.highlights.some(
        (highlight) =>
          highlight.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (selectedCategory === "National Parks" &&
            dest.name.includes("Park")) ||
          (selectedCategory === "Heritage Sites" &&
            dest.name.includes("Heritage")) ||
          (selectedCategory === "Adventure" &&
            highlight.includes("Adventure")) ||
          (selectedCategory === "Lakes & Rivers" &&
            (dest.name.includes("Lake") || dest.name.includes("Falls")))
      )
    );
  };

  const filteredDestinations = getFilteredDestinations();
  const featuredDestinations = filteredDestinations.filter((d) => d.featured);
  const otherDestinations = filteredDestinations.filter((d) => !d.featured);

  return (
    <section className="py-16 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Zimbabwe&apos;s Best Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From thundering waterfalls to ancient ruins, discover the incredible
            diversity of landscapes and experiences that make Zimbabwe truly
            unforgettable.
          </p>
        </div>

        {/* Mobile Category Filter */}
        {isMobile && (
          <div className="mb-8">
            <MobileCategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Featured Destinations */}
        {featuredDestinations.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Destinations
            </h3>
            {isMobile ? (
              <div className="grid grid-cols-1 gap-4">
                {featuredDestinations.map((destination) => (
                  <MobileCard
                    key={destination.id}
                    id={destination.id.toString()}
                    title={destination.name}
                    subtitle={destination.region}
                    image={destination.image}
                    rating={destination.rating}
                    price={destination.startingPrice}
                    location={destination.region}
                    variant="featured"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${destination.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Weather Info */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                        <WeatherIcon icon={destination.weather.icon} />
                        <span className="text-sm font-medium">
                          {destination.weather.temp}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-3 right-3 bg-off2zim-primary text-white rounded-lg px-3 py-1">
                        <span className="text-sm font-medium">
                          from {destination.startingPrice}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-off2zim-primary transition-colors">
                            {destination.name}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {destination.region}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-off2zim-sunset fill-current" />
                          <span className="text-sm font-medium">
                            {destination.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({destination.reviewCount})
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {destination.highlights
                          .slice(0, 2)
                          .map((highlight, index) => (
                            <span
                              key={index}
                              className="text-xs bg-off2zim-earth/10 text-off2zim-earth px-2 py-1 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        {destination.highlights.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{destination.highlights.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <button className="w-full bg-gray-50 hover:bg-off2zim-primary hover:text-white text-gray-700 py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 group">
                        <span className="font-medium">Explore</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other Destinations */}
        {otherDestinations.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedCategory === "All"
                ? "More Destinations"
                : `${selectedCategory} Destinations`}
            </h3>
            {isMobile ? (
              <div className="grid grid-cols-2 gap-3">
                {otherDestinations.map((destination) => (
                  <MobileCard
                    key={destination.id}
                    id={destination.id.toString()}
                    title={destination.name}
                    subtitle={destination.region}
                    image={destination.image}
                    rating={destination.rating}
                    price={destination.startingPrice}
                    location={destination.region}
                    variant="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${destination.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Price */}
                      <div className="absolute bottom-2 right-2 bg-off2zim-primary text-white rounded px-2 py-1">
                        <span className="text-xs font-medium">
                          from {destination.startingPrice}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-off2zim-primary transition-colors">
                          {destination.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-off2zim-sunset fill-current" />
                          <span className="text-xs">{destination.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {destination.region}
                      </p>

                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {destination.description}
                      </p>

                      <button className="w-full text-off2zim-primary hover:bg-off2zim-primary hover:text-white border border-off2zim-primary py-1 px-3 rounded text-sm transition-colors duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button className="bg-off2zim-primary hover:bg-off2zim-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-300 inline-flex items-center space-x-2">
            <span>View All Destinations</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

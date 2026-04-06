"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Star, Clock } from "lucide-react";
import DestinationDropdown from "./DestinationDropdown";
import DatePicker from "./DatePicker";

interface ThingsToDoFormData {
  destination: string;
  date: Date | null;
  guests: number;
  category: string;
  duration: string;
}

export default function ThingsToDoForm() {
  const router = useRouter();
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const { register, handleSubmit, watch, setValue } =
    useForm<ThingsToDoFormData>({
      defaultValues: {
        destination: "",
        date: null,
        guests: 2,
        category: "any",
        duration: "any",
      },
    });

  const formData = watch();

  const onSubmit = (data: ThingsToDoFormData) => {
    const params = new URLSearchParams();
    params.set("listingType", "experience");
    if (data.destination) params.set("search", data.destination);
    if (data.category !== "any") params.set("category", data.category);
    params.set("guests", String(data.guests));
    router.push(`/marketplace?${params.toString()}`);
  };

  const destinations = [
    "Victoria Falls",
    "Harare",
    "Bulawayo",
    "Hwange National Park",
    "Mana Pools",
    "Great Zimbabwe",
    "Matobo Hills",
    "Nyanga",
    "Chimanimani",
    "Lake Kariba",
  ];

  const categories = [
    { value: "any", label: "All Activities" },
    { value: "adventure", label: "Adventure & Outdoor" },
    { value: "wildlife", label: "Wildlife & Nature" },
    { value: "cultural", label: "Cultural Experiences" },
    { value: "sightseeing", label: "Sightseeing Tours" },
    { value: "food", label: "Food & Drink" },
    { value: "water", label: "Water Activities" },
    { value: "nightlife", label: "Nightlife & Entertainment" },
  ];

  const durations = [
    { value: "any", label: "Any duration" },
    { value: "1-3", label: "1-3 hours" },
    { value: "4-8", label: "4-8 hours" },
    { value: "full-day", label: "Full day (8+ hours)" },
    { value: "multi-day", label: "Multi-day" },
  ];

  const popularActivities = [
    {
      name: "Victoria Falls Tour",
      location: "Victoria Falls",
      price: "USD 45",
      rating: 4.8,
      duration: "3 hours",
      category: "Sightseeing",
      image: "victoria-falls.jpg",
      highlights: ["UNESCO World Heritage", "Guided tour", "Photography spots"],
    },
    {
      name: "Hwange Safari Game Drive",
      location: "Hwange National Park",
      price: "USD 85",
      rating: 4.9,
      duration: "Full day",
      category: "Wildlife",
      image: "hwange-safari.jpg",
      highlights: ["Big Five", "Professional guide", "Lunch included"],
    },
    {
      name: "Mana Pools Canoe Safari",
      location: "Mana Pools",
      price: "USD 120",
      rating: 4.7,
      duration: "6 hours",
      category: "Adventure",
      image: "mana-pools-canoe.jpg",
      highlights: ["Zambezi River", "Wildlife viewing", "Expert guide"],
    },
    {
      name: "Great Zimbabwe Ruins",
      location: "Great Zimbabwe",
      price: "USD 25",
      rating: 4.6,
      duration: "2 hours",
      category: "Cultural",
      image: "great-zimbabwe.jpg",
      highlights: ["Ancient civilization", "Historical tour", "Local guide"],
    },
    {
      name: "Bungee Jumping",
      location: "Victoria Falls",
      price: "USD 160",
      rating: 4.9,
      duration: "2 hours",
      category: "Adventure",
      image: "bungee-jump.jpg",
      highlights: ["111m drop", "Safety certified", "Video included"],
    },
    {
      name: "Traditional Village Tour",
      location: "Bulawayo",
      price: "USD 35",
      rating: 4.5,
      duration: "4 hours",
      category: "Cultural",
      image: "village-tour.jpg",
      highlights: ["Local culture", "Traditional crafts", "Authentic meal"],
    },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Destination */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Where
            </label>
            <div className="relative">
              <div
                className="input cursor-pointer flex items-center justify-between"
                onClick={() =>
                  setShowDestinationDropdown(!showDestinationDropdown)
                }
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span
                    className={
                      formData.destination ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.destination || "Select destination"}
                  </span>
                </div>
              </div>
              {showDestinationDropdown && (
                <DestinationDropdown
                  isOpen={showDestinationDropdown}
                  destinations={destinations}
                  onSelect={(destination) => {
                    setValue("destination", destination);
                    setShowDestinationDropdown(false);
                  }}
                  onClose={() => setShowDestinationDropdown(false)}
                />
              )}
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              When
            </label>
            <div className="relative">
              <div
                className="input cursor-pointer flex items-center justify-between"
                onClick={() => setShowDate(!showDate)}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={
                      formData.date ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.date
                      ? formData.date.toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
              </div>
              {showDate && (
                <DatePicker
                  isOpen={showDate}
                  selectedDate={formData.date}
                  onDateSelect={(date) => {
                    setValue("date", date);
                    setShowDate(false);
                  }}
                  onClose={() => setShowDate(false)}
                  minDate={new Date()}
                />
              )}
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="input flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{formData.guests}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    setValue("guests", Math.max(1, formData.guests - 1))
                  }
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("guests", Math.min(20, formData.guests + 1))
                  }
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select {...register("category")} className="input">
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select {...register("duration")} className="input">
              {durations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Activities */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Popular Activities
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary transition-colors group cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-green-400 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute top-2 right-2 bg-white rounded px-2 py-1">
                    <span className="text-xs font-medium text-primary">
                      {activity.price}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded px-2 py-1">
                    <span className="text-xs">{activity.category}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center text-white">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    <span className="text-xs">{activity.rating}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-xs">{activity.duration}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-medium text-sm text-gray-900 group-hover:text-primary mb-1">
                    {activity.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {activity.location}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activity.highlights.slice(0, 2).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                    {activity.highlights.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{activity.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="w-full btn-primary">
          Search Activities
        </button>
      </form>
    </div>
  );
}

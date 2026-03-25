"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, MapPin, Users, Waves } from "lucide-react";
import DestinationDropdown from "./DestinationDropdown";
import DatePicker from "./DatePicker";

interface HouseboatFormData {
  destination: string;
  checkinDate: Date | null;
  checkoutDate: Date | null;
  guests: number;
  boatType: string;
}

export default function HouseboatForm() {
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showCheckinDate, setShowCheckinDate] = useState(false);
  const [showCheckoutDate, setShowCheckoutDate] = useState(false);

  const { register, handleSubmit, watch, setValue } =
    useForm<HouseboatFormData>({
      defaultValues: {
        destination: "",
        checkinDate: null,
        checkoutDate: null,
        guests: 2,
        boatType: "any",
      },
    });

  const formData = watch();

  const onSubmit = (data: HouseboatFormData) => {
    console.log("Houseboat search:", data);
    // Handle houseboat search
  };

  const destinations = [
    "Lake Kariba",
    "Lake Chivero",
    "Lake Mutirikwi",
    "Zambezi River",
    "Lake Darwendale",
    "Mazowe Dam",
    "Lake Robertson",
    "Sanyati Basin",
  ];

  const boatTypes = [
    { value: "any", label: "Any boat type" },
    { value: "luxury", label: "Luxury Houseboat" },
    { value: "family", label: "Family Houseboat" },
    { value: "romantic", label: "Romantic Getaway" },
    { value: "fishing", label: "Fishing Boat" },
    { value: "party", label: "Party Boat" },
  ];

  const featuredBoats = [
    {
      name: "Lake Kariba Luxury",
      location: "Lake Kariba",
      price: "USD 180/night",
      guests: "8 guests",
      features: ["3 bedrooms", "Kitchen", "Fishing gear", "Sunset deck"],
      image: "luxury-houseboat.jpg",
    },
    {
      name: "Zambezi Explorer",
      location: "Zambezi River",
      price: "USD 120/night",
      guests: "6 guests",
      features: ["2 bedrooms", "Kitchenette", "Game viewing", "BBQ area"],
      image: "zambezi-boat.jpg",
    },
    {
      name: "Chivero Retreat",
      location: "Lake Chivero",
      price: "USD 95/night",
      guests: "4 guests",
      features: ["1 bedroom", "Mini kitchen", "Kayaks", "Bird watching"],
      image: "chivero-boat.jpg",
    },
    {
      name: "Mutirikwi Family",
      location: "Lake Mutirikwi",
      price: "USD 140/night",
      guests: "10 guests",
      features: ["4 bedrooms", "Full kitchen", "Water slides", "Entertainment"],
      image: "family-boat.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <div
                className="input cursor-pointer flex items-center justify-between"
                onClick={() =>
                  setShowDestinationDropdown(!showDestinationDropdown)
                }
              >
                <div className="flex items-center space-x-2">
                  <Waves className="w-4 h-4 text-gray-400" />
                  <span
                    className={
                      formData.destination ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.destination || "Select lake or river"}
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

          {/* Check-in Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="relative">
              <div
                className="input cursor-pointer flex items-center justify-between"
                onClick={() => setShowCheckinDate(!showCheckinDate)}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={
                      formData.checkinDate ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.checkinDate
                      ? formData.checkinDate.toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
              </div>
              {showCheckinDate && (
                <DatePicker
                  isOpen={showCheckinDate}
                  selectedDate={formData.checkinDate}
                  onDateSelect={(date) => {
                    setValue("checkinDate", date);
                    setShowCheckinDate(false);
                  }}
                  onClose={() => setShowCheckinDate(false)}
                  minDate={new Date()}
                />
              )}
            </div>
          </div>

          {/* Check-out Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="relative">
              <div
                className="input cursor-pointer flex items-center justify-between"
                onClick={() => setShowCheckoutDate(!showCheckoutDate)}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={
                      formData.checkoutDate ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.checkoutDate
                      ? formData.checkoutDate.toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
              </div>
              {showCheckoutDate && (
                <DatePicker
                  isOpen={showCheckoutDate}
                  selectedDate={formData.checkoutDate}
                  onDateSelect={(date) => {
                    setValue("checkoutDate", date);
                    setShowCheckoutDate(false);
                  }}
                  onClose={() => setShowCheckoutDate(false)}
                  minDate={formData.checkinDate || new Date()}
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
                <span>
                  {formData.guests} guest{formData.guests !== 1 ? "s" : ""}
                </span>
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
                    setValue("guests", Math.min(12, formData.guests + 1))
                  }
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Boat Type */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Boat Type
          </label>
          <select {...register("boatType")} className="input">
            {boatTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Houseboats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Featured Houseboats
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredBoats.map((boat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary transition-colors group cursor-pointer"
              >
                <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-2 right-2 bg-white rounded px-2 py-1">
                    <span className="text-xs font-medium text-primary">
                      {boat.price}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <Waves className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-medium text-sm text-gray-900 group-hover:text-primary mb-1">
                    {boat.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {boat.location}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {boat.guests}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {boat.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {boat.features.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{boat.features.length - 2} more
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
          Search Houseboats
        </button>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import DestinationDropdown from "./DestinationDropdown";
import DatePicker from "./DatePicker";
import { GuestsDropdown } from "./GuestsDropdown";

export default function StaysForm() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showDestinations, setShowDestinations] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const destinationRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission
    console.log("Search:", { destination, dates, guests });
  };

  const formatGuestsText = () => {
    const total = guests.adults + guests.children;
    if (total === 1) return "1 guest";
    return `${total} guests`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-row">
        {/* Destination Field */}
        <div className="form-field relative" ref={destinationRef}>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Destination
          </label>
          <div className="relative">
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowDestinations(true)}
              placeholder="Where to?"
              className="input-standard pl-10 w-full"
              required
            />
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <DestinationDropdown
            isOpen={showDestinations}
            onClose={() => setShowDestinations(false)}
            onSelect={(dest) => {
              setDestination(dest);
              setShowDestinations(false);
            }}
          />
        </div>

        {/* Dates Field */}
        <div className="form-field relative" ref={datesRef}>
          <label
            htmlFor="dates"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Dates
          </label>
          <div className="relative">
            <input
              type="text"
              id="dates"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              onFocus={() => setShowDates(true)}
              placeholder="When?"
              className="input pl-10 w-full"
              readOnly
              required
            />
            <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <DatePicker
            isOpen={showDates}
            onClose={() => setShowDates(false)}
            onSelect={(dateRange) => {
              setDates(dateRange);
              setShowDates(false);
            }}
          />
        </div>

        {/* Guests Field */}
        <div className="form-field relative" ref={guestsRef}>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Guests
          </label>
          <div className="relative">
            <input
              type="text"
              id="guests"
              value={formatGuestsText()}
              onFocus={() => setShowGuests(true)}
              placeholder="Who's coming?"
              className="input pl-10 w-full"
              readOnly
              required
            />
            <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <GuestsDropdown
            isOpen={showGuests}
            guests={guests}
            onClose={() => setShowGuests(false)}
            onUpdate={setGuests}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary w-full h-12 text-lg font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

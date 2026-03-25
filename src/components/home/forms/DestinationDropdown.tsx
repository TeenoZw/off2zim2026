"use client";

import React, { useEffect, useRef } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

const destinations = [
  "Beitbridge",
  "Binga",
  "Bulawayo",
  "Chinhoyi",
  "Chiredzi",
  "Eastern Highlands",
  "Gweru",
  "Harare",
  "Hwange",
  "Kariba",
  "Kwekwe",
  "Masvingo",
  "Mutare",
  "Nyanga",
  "Victoria Falls",
  "Zvishavane",
];

interface DestinationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: string) => void;
  destinations?: string[];
}

export default function DestinationDropdown({
  isOpen,
  onClose,
  onSelect,
  destinations: propDestinations,
}: DestinationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const destinationList = propDestinations || destinations;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
    >
      <div className="py-2">
        {destinationList.map((destination) => (
          <button
            key={destination}
            type="button"
            onClick={() => onSelect(destination)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900">{destination}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

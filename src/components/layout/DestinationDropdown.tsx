'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Destination {
  name: string;
  tempHigh: number;
  tempLow: number;
  href: string;
}

const destinations: Destination[] = [
  { name: 'Victoria Falls', tempHigh: 32, tempLow: 13, href: '/destinations/victoria-falls' },
  { name: 'Mana Pools', tempHigh: 30, tempLow: 15, href: '/destinations/mana-pools' },
  { name: 'Hwange', tempHigh: 28, tempLow: 12, href: '/destinations/hwange' },
  { name: 'Nyanga', tempHigh: 24, tempLow: 10, href: '/destinations/nyanga' },
  { name: 'Matobo', tempHigh: 27, tempLow: 14, href: '/destinations/matobo' },
];

interface DestinationDropdownProps {
  isOpen: boolean;
}

export function DestinationDropdown({ isOpen }: DestinationDropdownProps) {
  const getTempColor = (temp: number) => {
    if (temp >= 30) return 'temp-high-hot';
    if (temp >= 25) return 'temp-high-warm';
    return 'temp-low-cold';
  };

  return (
    <div className={`dropdown-menu ${isOpen ? 'show' : ''} w-64`}>
      <div className="py-2">
        {destinations.map((destination) => (
          <Link
            key={destination.name}
            href={destination.href}
            className="dropdown-item flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <Image
              src="/icons/destinations.png"
              alt="Destination"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {destination.name}
              </div>
              <div className="text-sm text-gray-500 flex gap-2">
                <span>
                  H: <span className={getTempColor(destination.tempHigh)}>{destination.tempHigh}°</span>
                </span>
                <span>
                  L: <span className="temp-low-cold">{destination.tempLow}°</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
        <div className="border-t mt-2 pt-2">
          <Link
            href="/destinations"
            className="dropdown-item flex items-center justify-between px-4 py-2 text-primary font-medium"
          >
            See all
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

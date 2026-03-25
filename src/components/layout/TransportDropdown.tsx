'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TransportOption {
  name: string;
  icon: string;
  href: string;
}

const transportOptions: TransportOption[] = [
  { name: 'Bus', icon: '/icons/bus.png', href: '/transport/bus' },
  { name: 'Car Rental', icon: '/icons/rental.png', href: '/transport/car-rental' },
  { name: 'Plane', icon: '/icons/plane.png', href: '/transport/flights' },
  { name: 'Taxi', icon: '/icons/taxi.png', href: '/transport/taxi' },
];

interface TransportDropdownProps {
  isOpen: boolean;
}

export function TransportDropdown({ isOpen }: TransportDropdownProps) {
  return (
    <div className={`dropdown-menu ${isOpen ? 'show' : ''} w-48`}>
      <div className="py-2">
        {transportOptions.map((option) => (
          <Link
            key={option.name}
            href={option.href}
            className="dropdown-item flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <Image
              src={option.icon}
              alt={option.name}
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            <span className="text-gray-900">{option.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Specials', href: '/specials', icon: '/icons/special-offers.png' },
  { name: 'Shop', href: '/shop', icon: '/icons/shop.png' },
  { name: 'Destinations', href: '/destinations', icon: '/icons/destinations.png' },
  { name: 'Accommodation', href: '/accommodation', icon: '/icons/accommodation.png' },
  { name: 'Transport', href: '/transport', icon: '/icons/transport.png' },
  { name: 'Events', href: '/events', icon: '/icons/events.png' },
  { name: 'Things To Do', href: '/activities', icon: '/icons/things-to-do.png' },
  { name: 'Food & Dining', href: '/dining', icon: '/icons/food-dining.png' },
  { name: 'Travel Guide', href: '/travel-guide', icon: '/icons/travel-guide.png' },
  { name: 'List Your Services', href: '/list-services', icon: '/icons/check.png' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <Image
            src="/logos/logo.png"
            alt="Off2Zim Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="py-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <span className="text-gray-900 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <Link
            href="/login"
            onClick={onClose}
            className="btn-primary w-full justify-center"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

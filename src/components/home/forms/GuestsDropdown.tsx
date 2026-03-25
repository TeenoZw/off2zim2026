'use client';

import React, { useEffect, useRef } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface GuestsData {
  adults: number;
  children: number;
}

interface GuestsDropdownProps {
  isOpen: boolean;
  guests: GuestsData;
  onClose: () => void;
  onUpdate: (guests: GuestsData) => void;
}

export function GuestsDropdown({ isOpen, guests, onClose, onUpdate }: GuestsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateGuests = (type: 'adults' | 'children', increment: boolean) => {
    const newGuests = { ...guests };
    
    if (increment) {
      newGuests[type] = Math.min(newGuests[type] + 1, type === 'adults' ? 10 : 8);
    } else {
      newGuests[type] = Math.max(newGuests[type] - 1, type === 'adults' ? 1 : 0);
    }
    
    onUpdate(newGuests);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 p-4 w-80"
    >
      <div className="space-y-4">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Adults</div>
            <div className="text-sm text-gray-500">13+ years</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateGuests('adults', false)}
              disabled={guests.adults <= 1}
              className={`
                w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                ${guests.adults <= 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }
              `}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {guests.adults}
            </span>
            <button
              type="button"
              onClick={() => updateGuests('adults', true)}
              disabled={guests.adults >= 10}
              className={`
                w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                ${guests.adults >= 10 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }
              `}
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Children</div>
            <div className="text-sm text-gray-500">0-12 years</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateGuests('children', false)}
              disabled={guests.children <= 0}
              className={`
                w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                ${guests.children <= 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }
              `}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {guests.children}
            </span>
            <button
              type="button"
              onClick={() => updateGuests('children', true)}
              disabled={guests.children >= 8}
              className={`
                w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                ${guests.children >= 8 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }
              `}
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full"
        >
          Done
        </button>
      </div>
    </div>
  );
}

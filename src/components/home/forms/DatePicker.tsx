"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isBefore,
} from "date-fns";

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (dateRange: string) => void;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
}

export default function DatePicker({
  isOpen,
  onClose,
  onSelect,
  onDateSelect,
  selectedDate,
  minDate = new Date(),
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      // Single date mode
      onDateSelect(date);
      onClose();
    } else if (onSelect) {
      // Date range mode
      if (!checkIn || (checkIn && checkOut)) {
        // First click or reset
        setCheckIn(date);
        setCheckOut(null);
      } else if (checkIn && !checkOut) {
        // Second click
        if (isBefore(date, checkIn)) {
          setCheckIn(date);
          setCheckOut(null);
        } else {
          setCheckOut(date);
          const range = `${format(checkIn, "MMM dd")} - ${format(date, "MMM dd")}`;
          onSelect(range);
        }
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return date >= checkIn && date <= checkOut;
  };

  const isDateSelected = (date: Date) => {
    if (onDateSelect && selectedDate) {
      // Single date mode
      return date.getTime() === selectedDate.getTime();
    }
    // Date range mode
    return (
      (checkIn && date.getTime() === checkIn.getTime()) ||
      (checkOut && date.getTime() === checkOut.getTime())
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 p-4 w-80"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          →
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => handleDateClick(day)}
            disabled={isBefore(day, minDate) && !isToday(day)}
            className={`
              p-2 text-sm rounded-md transition-colors
              ${!isSameMonth(day, currentMonth) ? "text-gray-300" : "text-gray-900"}
              ${isDateSelected(day) ? "bg-primary text-white" : ""}
              ${isDateInRange(day) && !isDateSelected(day) ? "bg-primary/10" : ""}
              ${isToday(day) ? "ring-2 ring-primary/20" : ""}
              ${isBefore(day, minDate) && !isToday(day) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>

      {/* Selected Range Display */}
      {checkIn && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            Check-in: {format(checkIn, "MMM dd, yyyy")}
          </div>
          {checkOut && (
            <div className="text-sm text-gray-600">
              Check-out: {format(checkOut, "MMM dd, yyyy")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

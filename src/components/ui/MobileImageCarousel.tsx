"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

interface MobileImageCarouselProps {
  data: CarouselItem[];
  autoPlay?: boolean;
  duration?: number;
  height?: number;
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

export function MobileImageCarousel({
  data,
  autoPlay = true,
  duration = 5000,
  height = 240,
  activeIndex: externalActiveIndex,
  onSlideChange,
}: MobileImageCarouselProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex =
    externalActiveIndex !== undefined
      ? externalActiveIndex
      : internalActiveIndex;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || data.length <= 1 || externalActiveIndex !== undefined)
      return;

    const interval = setInterval(() => {
      const newIndex = (internalActiveIndex + 1) % data.length;
      setInternalActiveIndex(newIndex);
      onSlideChange?.(newIndex);
    }, duration);

    return () => clearInterval(interval);
  }, [
    autoPlay,
    duration,
    data.length,
    internalActiveIndex,
    externalActiveIndex,
    onSlideChange,
  ]);

  // Handle slide changes
  const handleSlideChange = (newIndex: number) => {
    if (externalActiveIndex === undefined) {
      setInternalActiveIndex(newIndex);
    }
    onSlideChange?.(newIndex);
  };

  // Touch handling for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < data.length - 1) {
      handleSlideChange(activeIndex + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      handleSlideChange(activeIndex - 1);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100">
      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{
          height: `${height}px`,
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {data.map((item, index) => (
          <div
            key={item.id}
            className="w-full flex-shrink-0 relative"
            style={{ height: `${height}px` }}
          >
            <Image
              src={item.image}
              alt={item.title || `Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Overlay Content */}
            {(item.title || item.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {item.title && (
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  )}
                  {item.subtitle && (
                    <p className="text-sm opacity-90">{item.subtitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {data.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-white scale-125" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows (hidden on mobile, shown on larger screens) */}
      {data.length > 1 && (
        <>
          <button
            onClick={() =>
              handleSlideChange(
                activeIndex > 0 ? activeIndex - 1 : data.length - 1
              )
            }
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() =>
              handleSlideChange(
                activeIndex < data.length - 1 ? activeIndex + 1 : 0
              )
            }
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

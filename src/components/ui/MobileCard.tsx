"use client";

import React from "react";
import Image from "next/image";
import { StarIcon, HeartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface MobileCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  tags?: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onPress?: (id: string) => void;
  variant?: "default" | "compact" | "featured";
}

export function MobileCard({
  id,
  title,
  subtitle,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  location,
  tags,
  isFavorite = false,
  onFavoriteToggle,
  onPress,
  variant = "default",
}: MobileCardProps) {
  const handleCardPress = () => {
    onPress?.(id);
  };

  const handleFavoritePress = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  if (variant === "compact") {
    return (
      <div
        onClick={handleCardPress}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
              {title}
            </h3>

            {location && (
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <MapPinIcon className="w-3 h-3 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}

            {price && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-off2zim-primary text-sm">
                    {price}
                  </span>
                  {originalPrice && (
                    <span className="text-gray-400 text-xs line-through ml-1">
                      {originalPrice}
                    </span>
                  )}
                </div>

                {rating && (
                  <div className="flex items-center">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{rating}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        onClick={handleCardPress}
        className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        {/* Image with overlay */}
        <div className="relative h-64">
          <Image src={image} alt={title} fill className="object-cover" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Favorite button */}
          <button
            onClick={handleFavoritePress}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-off2zim-primary text-white text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-bold text-xl mb-2 leading-tight">{title}</h3>

            {location && (
              <div className="flex items-center text-white/90 text-sm mb-3">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{location}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              {price && (
                <div>
                  <span className="font-bold text-2xl">{price}</span>
                  {originalPrice && (
                    <span className="text-white/70 text-sm line-through ml-2">
                      {originalPrice}
                    </span>
                  )}
                </div>
              )}

              {rating && (
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{rating}</span>
                  {reviewCount && (
                    <span className="text-xs text-white/80 ml-1">
                      ({reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={handleCardPress}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />

        {/* Favorite button */}
        <button
          onClick={handleFavoritePress}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-4 h-4 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-off2zim-primary text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{subtitle}</p>
        )}

        {location && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="truncate">{location}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {price && (
            <div>
              <span className="font-bold text-off2zim-primary text-lg">
                {price}
              </span>
              {originalPrice && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  {originalPrice}
                </span>
              )}
            </div>
          )}

          {rating && (
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm text-gray-600">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-gray-500 ml-1">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

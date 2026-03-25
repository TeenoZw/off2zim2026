"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showText?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  maxRating = 5,
  size = "md",
  readonly = false,
  showText = true,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  const getRatingText = (rating: number): string => {
    if (rating === 0) return "No rating";
    if (rating <= 1) return "Poor";
    if (rating <= 2) return "Fair";
    if (rating <= 3) return "Good";
    if (rating <= 4) return "Very Good";
    return "Excellent";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= displayRating;
          const isHalfFilled =
            !readonly &&
            starRating - 0.5 <= displayRating &&
            starRating > displayRating;

          return (
            <Star
              key={index}
              className={`
                ${sizeClasses[size]}
                ${readonly ? "cursor-default" : "cursor-pointer"}
                transition-colors duration-200
                ${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : isHalfFilled
                      ? "fill-yellow-200 text-yellow-400"
                      : "fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-400"
                }
              `}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
            />
          );
        })}
      </div>

      {showText && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{displayRating.toFixed(1)}</span>
          <span>•</span>
          <span>{getRatingText(displayRating)}</span>
        </div>
      )}
    </div>
  );
};

export default StarRating;

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

const SIZE: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const LABELS: Record<number, string> = {
  0: "No rating",
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  maxRating = 5,
  size = "md",
  readonly = false,
  showText = true,
  className = "",
}) => {
  const [hover, setHover] = useState(0);
  const display = hover || rating;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => !readonly && setHover(0)}
      >
        {Array.from({ length: maxRating }).map((_, i) => {
          const star = i + 1;
          const filled = star <= display;
          return (
            <Star
              key={i}
              className={[
                SIZE[size],
                readonly ? "cursor-default" : "cursor-pointer",
                "transition-colors duration-150",
                filled
                  ? "fill-[#fbbf24] text-[#fbbf24]"
                  : readonly
                    ? "fill-white/10 text-white/20"
                    : "fill-white/10 text-white/20 hover:fill-[#fbbf24]/60 hover:text-[#fbbf24]/60",
              ].join(" ")}
              onClick={() => !readonly && onRatingChange?.(star)}
              onMouseEnter={() => !readonly && setHover(star)}
            />
          );
        })}
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="theme-heading font-semibold">{display.toFixed(1)}</span>
          <span className="theme-muted">{LABELS[Math.round(display)] ?? ""}</span>
        </div>
      )}
    </div>
  );
};

export default StarRating;

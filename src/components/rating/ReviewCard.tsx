"use client";

import React, { useState } from "react";
import { Calendar, Flag, MoreHorizontal, ThumbsUp, User } from "lucide-react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerType: "explorer" | "provider" | "guide";
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerified: boolean;
  response?: {
    author: string;
    date: string;
    content: string;
  };
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showResponse?: boolean;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  explorer: { bg: "bg-[#13283a]", text: "text-[#8dc9ff]", label: "Explorer" },
  provider: { bg: "bg-[#0f2a1e]", text: "text-[#4ade80]", label: "Service Provider" },
  guide:    { bg: "bg-[#2d1f38]", text: "text-[#c4b5fd]", label: "Community Guide" },
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReport,
  showResponse = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const typeStyle = TYPE_STYLES[review.reviewerType] ?? {
    bg: "bg-white/8",
    text: "text-white/60",
    label: "User",
  };

  return (
    <div className="theme-panel rounded-[24px] p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8">
            {review.reviewerAvatar ? (
              <img
                src={review.reviewerAvatar}
                alt={review.reviewerName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-white/40" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="theme-heading text-sm font-semibold">
                {review.reviewerName}
              </span>
              {review.isVerified && (
                <span className="rounded-full bg-[#0f2a1e] px-2 py-0.5 text-[10px] font-medium text-[#4ade80]">
                  Verified
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeStyle.bg} ${typeStyle.text}`}
              >
                {typeStyle.label}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
              <Calendar className="h-3 w-3" />
              {review.date}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-1 text-white/30 hover:bg-white/8 hover:text-white/60"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-10 min-w-[130px] overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c] shadow-xl">
              {onHelpful && (
                <button
                  onClick={() => { onHelpful(review.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.07]"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful
                </button>
              )}
              {onReport && (
                <button
                  onClick={() => { onReport(review.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#ff8a78] hover:bg-white/[0.07]"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="mt-3">
        <StarRating rating={review.rating} readonly showText={false} size="sm" />
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="theme-heading text-sm font-semibold">{review.title}</p>
        <p
          className={`theme-muted mt-1.5 text-sm leading-6 ${
            !expanded && review.comment.length > 220 ? "line-clamp-3" : ""
          }`}
        >
          {review.comment}
        </p>
        {review.comment.length > 220 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs font-medium text-[#ff5630] hover:text-[#ff7352]"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Helpful action */}
      {onHelpful && (
        <div className="mt-4 border-t border-white/8 pt-3">
          <button
            onClick={() => onHelpful(review.id)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Helpful ({review.helpfulCount})
          </button>
        </div>
      )}

      {/* Provider response */}
      {showResponse && review.response && (
        <div className="mt-4 rounded-[16px] border-l-2 border-[#ff5630]/40 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff5630]/20">
              <User className="h-3 w-3 text-[#ff5630]" />
            </div>
            <span className="theme-heading text-xs font-semibold">
              {review.response.author}
            </span>
            <span className="text-xs text-white/30">· {review.response.date}</span>
          </div>
          <p className="theme-muted text-xs leading-5">{review.response.content}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;

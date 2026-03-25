"use client";

import React, { useState } from "react";
import { User, Calendar, ThumbsUp, Flag, MoreHorizontal } from "lucide-react";
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

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReport,
  showResponse = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getReviewerTypeLabel = (type: string) => {
    switch (type) {
      case "explorer":
        return "Explorer";
      case "provider":
        return "Service Provider";
      case "guide":
        return "Community Guide";
      default:
        return "User";
    }
  };

  const getReviewerTypeColor = (type: string) => {
    switch (type) {
      case "explorer":
        return "bg-blue-100 text-blue-800";
      case "provider":
        return "bg-green-100 text-green-800";
      case "guide":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {review.reviewerAvatar ? (
              <img
                src={review.reviewerAvatar}
                alt={review.reviewerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {review.reviewerName}
              </h4>
              {review.isVerified && (
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified
                </div>
              )}
              <div
                className={`text-xs px-2 py-1 rounded-full ${getReviewerTypeColor(review.reviewerType)}`}
              >
                {getReviewerTypeLabel(review.reviewerType)}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{review.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              {onHelpful && (
                <button
                  onClick={() => {
                    onHelpful(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful
                </button>
              )}
              {onReport && (
                <button
                  onClick={() => {
                    onReport(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating
          rating={review.rating}
          readonly
          showText={false}
          size="sm"
        />
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
        <div
          className={`text-gray-700 ${!isExpanded && review.comment.length > 200 ? "line-clamp-3" : ""}`}
        >
          {review.comment}
        </div>
        {review.comment.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        {onHelpful && (
          <button
            onClick={() => onHelpful(review.id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Helpful ({review.helpfulCount})</span>
          </button>
        )}
      </div>

      {/* Response */}
      {showResponse && review.response && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-900">
              {review.response.author}
            </span>
            <span className="text-sm text-gray-500">
              • {review.response.date}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{review.response.content}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;

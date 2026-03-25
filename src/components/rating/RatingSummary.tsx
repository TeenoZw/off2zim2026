"use client";

import React, { useState } from "react";
import { Star, TrendingUp, Users, Award, Filter, Calendar } from "lucide-react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";

interface RatingSummaryProps {
  overallRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  criteriaRatings?: { [key: string]: number };
  recentReviews: any[];
  showWriteReview?: boolean;
  onWriteReview?: () => void;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  overallRating,
  totalReviews,
  ratingDistribution,
  criteriaRatings = {},
  recentReviews,
  showWriteReview = true,
  onWriteReview,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getPercentage = (count: number): number => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const getRatingTrend = (): "up" | "down" | "stable" => {
    // This would typically come from your data
    // For demo purposes, we'll simulate it
    return "up";
  };

  const criteriaLabels: { [key: string]: string } = {
    quality: "Service Quality",
    communication: "Communication",
    value: "Value for Money",
    professionalism: "Professionalism",
    knowledge: "Local Knowledge",
    helpfulness: "Helpfulness",
    responsiveness: "Responsiveness",
    respect: "Respectfulness",
    reliability: "Reliability",
  };

  const filterOptions = [
    { value: "all", label: "All Reviews" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
    { value: "verified", label: "Verified Only" },
  ];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Rated" },
    { value: "lowest", label: "Lowest Rated" },
    { value: "helpful", label: "Most Helpful" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {overallRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={overallRating}
                  readonly
                  showText={false}
                  size="lg"
                />
                <div
                  className={`flex items-center gap-1 text-sm ${
                    getRatingTrend() === "up"
                      ? "text-green-600"
                      : getRatingTrend() === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  <TrendingUp
                    className={`h-4 w-4 ${getRatingTrend() === "down" ? "rotate-180" : ""}`}
                  />
                  <span>Trending {getRatingTrend()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{totalReviews.toLocaleString()} reviews</span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3 w-3 fill-gray-300 text-gray-300" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getPercentage(ratingDistribution[rating] || 0)}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center lg:items-end justify-center">
            {showWriteReview && onWriteReview && (
              <button
                onClick={onWriteReview}
                className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Write a Review
              </button>
            )}
            <div className="mt-3 text-center lg:text-right">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>Verified Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      {Object.keys(criteriaRatings).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(criteriaRatings).map(([key, rating]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">
                  {criteriaLabels[key] || key}
                </span>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={rating}
                    readonly
                    showText={false}
                    size="sm"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {recentReviews.length} of {totalReviews} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {recentReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onHelpful={(reviewId) => {
              console.log("Marked as helpful:", reviewId);
            }}
            onReport={(reviewId) => {
              console.log("Reported review:", reviewId);
            }}
          />
        ))}
      </div>

      {/* Load More */}
      {recentReviews.length < totalReviews && (
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingSummary;

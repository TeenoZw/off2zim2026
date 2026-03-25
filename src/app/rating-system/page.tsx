"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  UserCheck,
  Building,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/rating/StarRating";
import ReviewForm from "@/components/rating/ReviewForm";
import RatingSummary from "@/components/rating/RatingSummary";

const RatingSystemPage = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "write-review"
  >("overview");
  const [selectedReviewType, setSelectedReviewType] = useState<
    "service" | "explorer" | "guide"
  >("service");

  // Sample data - would come from API in real application
  const ratingData = {
    service: {
      overallRating: 4.6,
      totalReviews: 127,
      ratingDistribution: { 5: 89, 4: 23, 3: 10, 2: 3, 1: 2 },
      criteriaRatings: {
        quality: 4.7,
        communication: 4.5,
        value: 4.4,
        professionalism: 4.8,
      },
      recentReviews: [
        {
          id: "1",
          reviewerName: "Sarah Johnson",
          reviewerType: "explorer" as const,
          rating: 5,
          title: "Amazing safari experience!",
          comment:
            "The service was exceptional from start to finish. Our guide was knowledgeable and the wildlife viewing was incredible. Highly recommend for anyone visiting Zimbabwe.",
          date: "2 days ago",
          helpfulCount: 8,
          isVerified: true,
          response: {
            author: "Zimbabwe Wildlife Tours",
            date: "1 day ago",
            content:
              "Thank you Sarah! We're thrilled you had such a wonderful experience. Your feedback means the world to us.",
          },
        },
        {
          id: "2",
          reviewerName: "Michael Chen",
          reviewerType: "explorer" as const,
          rating: 4,
          title: "Great value for money",
          comment:
            "Solid experience overall. The accommodations were comfortable and the activities were well-organized. Only minor issue was some delays in transportation.",
          date: "1 week ago",
          helpfulCount: 5,
          isVerified: true,
        },
      ],
    },
    explorer: {
      overallRating: 4.8,
      totalReviews: 45,
      ratingDistribution: { 5: 35, 4: 8, 3: 2, 2: 0, 1: 0 },
      criteriaRatings: {
        communication: 4.9,
        respect: 4.8,
        reliability: 4.7,
      },
      recentReviews: [
        {
          id: "3",
          reviewerName: "Victoria Falls Lodge",
          reviewerType: "provider" as const,
          rating: 5,
          title: "Wonderful guests!",
          comment:
            "Sarah and her family were delightful guests. They were respectful of our property and followed all guidelines perfectly. Would welcome them back anytime.",
          date: "3 days ago",
          helpfulCount: 3,
          isVerified: true,
        },
      ],
    },
    guide: {
      overallRating: 4.9,
      totalReviews: 78,
      ratingDistribution: { 5: 68, 4: 8, 3: 2, 2: 0, 1: 0 },
      criteriaRatings: {
        knowledge: 4.9,
        helpfulness: 4.8,
        responsiveness: 4.9,
      },
      recentReviews: [
        {
          id: "4",
          reviewerName: "Travel Explorer",
          reviewerType: "explorer" as const,
          rating: 5,
          title: "Local expert with amazing insights",
          comment:
            "Tino provided incredible local insights that made our trip unforgettable. His recommendations for hidden gems were spot on!",
          date: "5 days ago",
          helpfulCount: 12,
          isVerified: true,
        },
      ],
    },
  };

  const tabs = [
    {
      id: "overview" as const,
      label: "Rating Overview",
      icon: TrendingUp,
      description: "View comprehensive rating statistics",
    },
    {
      id: "reviews" as const,
      label: "All Reviews",
      icon: MessageSquare,
      description: "Browse all reviews and ratings",
    },
    {
      id: "write-review" as const,
      label: "Write Review",
      icon: Star,
      description: "Share your experience",
    },
  ];

  const reviewTypes = [
    {
      id: "service" as const,
      label: "Service Provider Reviews",
      icon: Building,
      description: "Reviews from explorers about service providers",
      count: ratingData.service.totalReviews,
    },
    {
      id: "explorer" as const,
      label: "Explorer Reviews",
      icon: UserCheck,
      description: "Reviews from providers about explorers",
      count: ratingData.explorer.totalReviews,
    },
    {
      id: "guide" as const,
      label: "Community Guide Reviews",
      icon: Users,
      description: "Reviews about community guides",
      count: ratingData.guide.totalReviews,
    },
  ];

  const handleReviewSubmit = (reviewData: {
    rating: number;
    comment: string;
    criteria?: Record<string, number>;
  }) => {
    console.log("Review submitted:", reviewData);
    // In real app, this would submit to API
    setActiveTab("reviews");
  };

  const currentData = ratingData[selectedReviewType];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Two-Way Rating System
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Our comprehensive rating system ensures trust and transparency
            between all members of the Off2Zim community. Explorers rate service
            providers, providers rate explorers, and everyone can review
            community guides.
          </p>
        </div>

        {/* Review Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {reviewTypes.map((type) => {
            const Icon = type.icon;
            const isActive = selectedReviewType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setSelectedReviewType(type.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <h3
                    className={`font-semibold ${isActive ? "text-blue-900" : "text-gray-900"}`}
                  >
                    {type.label}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={currentData.overallRating}
                    readonly
                    showText={false}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {currentData.overallRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({type.count} reviews)
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Rating System Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {(
                        ratingData.service.overallRating +
                        ratingData.explorer.overallRating +
                        ratingData.guide.overallRating / 3
                      ).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Average Platform Rating
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {(
                        ratingData.service.totalReviews +
                        ratingData.explorer.totalReviews +
                        ratingData.guide.totalReviews
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      98%
                    </div>
                    <div className="text-sm text-gray-600">
                      Verified Reviews
                    </div>
                  </div>
                </div>
              </div>

              <RatingSummary
                overallRating={currentData.overallRating}
                totalReviews={currentData.totalReviews}
                ratingDistribution={currentData.ratingDistribution}
                criteriaRatings={currentData.criteriaRatings}
                recentReviews={currentData.recentReviews}
                showWriteReview={true}
                onWriteReview={() => setActiveTab("write-review")}
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <RatingSummary
              overallRating={currentData.overallRating}
              totalReviews={currentData.totalReviews}
              ratingDistribution={currentData.ratingDistribution}
              criteriaRatings={currentData.criteriaRatings}
              recentReviews={currentData.recentReviews}
              showWriteReview={true}
              onWriteReview={() => setActiveTab("write-review")}
            />
          )}

          {activeTab === "write-review" && (
            <ReviewForm
              reviewType={selectedReviewType}
              targetName="Sample Target"
              onSubmit={handleReviewSubmit}
              onCancel={() => setActiveTab("overview")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingSystemPage;

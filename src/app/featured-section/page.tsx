"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/rating/StarRating";

interface FeaturedItem {
  id: string;
  name: string;
  type: "accommodation" | "activity" | "service" | "guide";
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  featuredScore: number;
  fairnessMetrics: {
    qualityScore: number;
    localSupport: number;
    sustainabilityScore: number;
    communityImpact: number;
  };
  featuredDuration: string;
  lastFeatured: string;
}

const FeaturedSectionPage = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "algorithm" | "metrics"
  >("current");

  // Sample featured items with fairness scoring
  const featuredItems: FeaturedItem[] = [
    {
      id: "1",
      name: "Victoria Falls Safari Lodge",
      type: "accommodation",
      description:
        "Luxury eco-lodge overlooking Victoria Falls with exceptional wildlife viewing and community partnerships.",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80",
      rating: 4.8,
      reviewCount: 342,
      location: "Victoria Falls, Zimbabwe",
      verified: true,
      featuredScore: 94,
      fairnessMetrics: {
        qualityScore: 95,
        localSupport: 90,
        sustainabilityScore: 98,
        communityImpact: 92,
      },
      featuredDuration: "7 days",
      lastFeatured: "2 months ago",
    },
    {
      id: "2",
      name: "Traditional Village Experience",
      type: "activity",
      description:
        "Authentic cultural immersion with local Shona community, including traditional cooking and craft making.",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
      rating: 4.9,
      reviewCount: 128,
      location: "Masvingo, Zimbabwe",
      verified: true,
      featuredScore: 91,
      fairnessMetrics: {
        qualityScore: 92,
        localSupport: 95,
        sustainabilityScore: 90,
        communityImpact: 88,
      },
      featuredDuration: "5 days",
      lastFeatured: "3 months ago",
    },
    {
      id: "3",
      name: "Hwange Game Drive Specialists",
      type: "service",
      description:
        "Family-owned safari company specializing in Hwange National Park with 20+ years of local expertise.",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=80",
      rating: 4.7,
      reviewCount: 89,
      location: "Hwange, Zimbabwe",
      verified: true,
      featuredScore: 88,
      fairnessMetrics: {
        qualityScore: 89,
        localSupport: 85,
        sustainabilityScore: 92,
        communityImpact: 86,
      },
      featuredDuration: "6 days",
      lastFeatured: "1 month ago",
    },
  ];

  const fairnessAlgorithm = {
    principles: [
      {
        title: "Quality-Based Selection",
        description:
          "Featured items must maintain minimum quality standards (4.0+ rating, verified status)",
        weight: "30%",
      },
      {
        title: "Rotation Fairness",
        description:
          "Automatic rotation ensures all qualifying providers get featuring opportunities",
        weight: "25%",
      },
      {
        title: "Local Business Priority",
        description:
          "Preference given to locally-owned and community-partnered businesses",
        weight: "20%",
      },
      {
        title: "Geographic Distribution",
        description:
          "Balanced representation across different regions of Zimbabwe",
        weight: "15%",
      },
      {
        title: "Community Impact",
        description:
          "Bonus scoring for businesses with proven positive community impact",
        weight: "10%",
      },
    ],
    metrics: {
      totalProviders: 1247,
      featuredSlots: 12,
      rotationCycle: "7 days",
      fairnessScore: 96,
      lastUpdated: "2 hours ago",
    },
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accommodation":
        return "bg-blue-100 text-blue-800";
      case "activity":
        return "bg-green-100 text-green-800";
      case "service":
        return "bg-purple-100 text-purple-800";
      case "guide":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

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
              Featured Section & Fairness Framework
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Our AI-powered fairness framework ensures equal opportunities for
            all service providers while highlighting the best Zimbabwe has to
            offer. Every business gets a fair chance to be featured based on
            quality, community impact, and rotation fairness.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "current"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Award className="h-4 w-4" />
              Currently Featured
            </button>
            <button
              onClick={() => setActiveTab("algorithm")}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "algorithm"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Fairness Algorithm
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "metrics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Platform Metrics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "current" && (
          <div className="space-y-6">
            {/* Current Featured Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Currently Featured (Rotation: 7 days)
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Next rotation in 3 days</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Featured Badge */}
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Featured
                      </div>
                      <div
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Location and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarRating
                            rating={item.rating}
                            readonly
                            showText={false}
                            size="sm"
                          />
                          <span className="text-sm text-gray-600">
                            ({item.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Fairness Metrics */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Featured Score</span>
                          <span
                            className={`font-semibold ${getMetricColor(item.featuredScore)}`}
                          >
                            {item.featuredScore}/100
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Quality</span>
                            <span
                              className={getMetricColor(
                                item.fairnessMetrics.qualityScore
                              )}
                            >
                              {item.fairnessMetrics.qualityScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Local Support</span>
                            <span
                              className={getMetricColor(
                                item.fairnessMetrics.localSupport
                              )}
                            >
                              {item.fairnessMetrics.localSupport}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Sustainability
                            </span>
                            <span
                              className={getMetricColor(
                                item.fairnessMetrics.sustainabilityScore
                              )}
                            >
                              {item.fairnessMetrics.sustainabilityScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Community</span>
                            <span
                              className={getMetricColor(
                                item.fairnessMetrics.communityImpact
                              )}
                            >
                              {item.fairnessMetrics.communityImpact}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span>Featured for: {item.featuredDuration}</span>
                          <span>Last featured: {item.lastFeatured}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "algorithm" && (
          <div className="space-y-6">
            {/* Algorithm Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Fairness Algorithm Principles
              </h2>
              <p className="text-gray-600 mb-6">
                Our AI-powered algorithm ensures fair representation while
                maintaining quality standards. Every qualified provider gets
                equal opportunity to be featured.
              </p>

              <div className="space-y-4">
                {fairnessAlgorithm.principles.map((principle, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {principle.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {principle.description}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {principle.weight}
                        </div>
                        <div className="text-xs text-gray-500">Weight</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Transparency */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Quality Screening
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Only providers with 4.0+ ratings and verified status
                      qualify for featuring.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Fairness Scoring
                    </h4>
                    <p className="text-gray-600 text-sm">
                      AI calculates fairness scores based on quality, local
                      impact, and rotation history.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Automated Rotation
                    </h4>
                    <p className="text-gray-600 text-sm">
                      System automatically rotates featured items every 7 days,
                      ensuring equal opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Continuous Monitoring
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Algorithm continuously monitors for bias and adjusts to
                      maintain fairness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {fairnessAlgorithm.metrics.totalProviders}
                </div>
                <div className="text-sm text-gray-600">Total Providers</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {fairnessAlgorithm.metrics.featuredSlots}
                </div>
                <div className="text-sm text-gray-600">Featured Slots</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {fairnessAlgorithm.metrics.rotationCycle}
                </div>
                <div className="text-sm text-gray-600">Rotation Cycle</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {fairnessAlgorithm.metrics.fairnessScore}%
                </div>
                <div className="text-sm text-gray-600">Fairness Score</div>
              </div>
            </div>

            {/* Fairness Dashboard */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fairness Dashboard
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">
                      Algorithm Status: Active
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Fairness algorithm is running normally. Last updated:{" "}
                    {fairnessAlgorithm.metrics.lastUpdated}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Geographic Distribution
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harare</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Victoria Falls</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bulawayo</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other Regions</span>
                        <span className="font-medium">40%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Provider Types
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accommodation</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guides</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedSectionPage;

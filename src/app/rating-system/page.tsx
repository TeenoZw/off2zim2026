"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  MessageSquare,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/rating/StarRating";
import ReviewForm from "@/components/rating/ReviewForm";
import { RatingSummary } from "@/components/rating/RatingSummary";
import FilterChips from "@/components/ui/FilterChips";

// ── static sample data (explainer page) ──────────────────────────────────────

const RATING_DATA = {
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
          "The service was exceptional from start to finish. Our guide was knowledgeable and the wildlife viewing was incredible.",
        date: "2 days ago",
        helpfulCount: 8,
        isVerified: true,
        response: {
          author: "Zimbabwe Wildlife Tours",
          date: "1 day ago",
          content: "Thank you Sarah! We're thrilled you had such a wonderful experience.",
        },
      },
      {
        id: "2",
        reviewerName: "Michael Chen",
        reviewerType: "explorer" as const,
        rating: 4,
        title: "Great value for money",
        comment: "Solid experience overall. Well-organised with minor transport delays.",
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
    criteriaRatings: { communication: 4.9, respect: 4.8, reliability: 4.7 },
    recentReviews: [
      {
        id: "3",
        reviewerName: "Victoria Falls Lodge",
        reviewerType: "provider" as const,
        rating: 5,
        title: "Wonderful guests!",
        comment:
          "Sarah and her family were respectful of our property and followed all guidelines perfectly.",
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
    criteriaRatings: { knowledge: 4.9, helpfulness: 4.8, responsiveness: 4.9 },
    recentReviews: [
      {
        id: "4",
        reviewerName: "Travel Explorer",
        reviewerType: "explorer" as const,
        rating: 5,
        title: "Local expert with amazing insights",
        comment:
          "Incredible local insights that made our trip unforgettable. Hidden gem recommendations were spot on!",
        date: "5 days ago",
        helpfulCount: 12,
        isVerified: true,
      },
    ],
  },
};

type ReviewType = "service" | "explorer" | "guide";
type TabId = "overview" | "reviews" | "write-review";

// ── component ─────────────────────────────────────────────────────────────────

export default function RatingSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedType, setSelectedType] = useState<ReviewType>("service");

  const currentData = RATING_DATA[selectedType];

  const totalReviews =
    RATING_DATA.service.totalReviews +
    RATING_DATA.explorer.totalReviews +
    RATING_DATA.guide.totalReviews;

  const avgRating = (
    (RATING_DATA.service.overallRating +
      RATING_DATA.explorer.overallRating +
      RATING_DATA.guide.overallRating) /
    3
  ).toFixed(1);

  const reviewTypeChips = [
    { id: "service", label: "Service providers", count: RATING_DATA.service.totalReviews },
    { id: "explorer", label: "Explorers", count: RATING_DATA.explorer.totalReviews },
    { id: "guide", label: "Community guides", count: RATING_DATA.guide.totalReviews },
  ];

  const tabChips = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Browse reviews" },
    { id: "write-review", label: "Write a review" },
  ];

  return (
    <div className="theme-page min-h-screen pb-20">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back + heading */}
        <Link
          href="/"
          className="theme-muted mb-8 inline-flex items-center gap-2 text-sm transition hover:text-current"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff5630]">
            Trust &amp; transparency
          </p>
          <h1 className="theme-heading mt-2 text-4xl font-semibold">
            Two-way rating system
          </h1>
          <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">
            Explorers rate service providers, providers rate explorers, and everyone
            can review community guides. Ratings are blind until both parties
            complete them — keeping feedback honest.
          </p>
        </div>

        {/* Platform stats */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="theme-panel rounded-[28px] p-5 text-center">
            <div className="theme-heading text-3xl font-semibold">{avgRating}</div>
            <div className="theme-muted mt-1 text-xs">Platform avg</div>
            <div className="mt-2 flex justify-center">
              <StarRating rating={Number(avgRating)} readonly showText={false} size="sm" />
            </div>
          </div>
          <div className="theme-panel rounded-[28px] p-5 text-center">
            <div className="theme-heading text-3xl font-semibold">
              {totalReviews.toLocaleString()}
            </div>
            <div className="theme-muted mt-1 text-xs">Total reviews</div>
            <div className="mt-2 flex justify-center">
              <TrendingUp className="h-4 w-4 text-[#4ade80]" />
            </div>
          </div>
          <div className="theme-panel rounded-[28px] p-5 text-center">
            <div className="theme-heading text-3xl font-semibold">98%</div>
            <div className="theme-muted mt-1 text-xs">Verified reviews</div>
            <div className="mt-2 flex justify-center">
              <Shield className="h-4 w-4 text-[#8dc9ff]" />
            </div>
          </div>
        </div>

        {/* How it works cards */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Building2,
              color: "text-[#ff7352]",
              bg: "bg-[#2d1714]",
              title: "Rate service providers",
              body: "After every completed experience, explorers rate providers on quality, communication, value, and professionalism.",
            },
            {
              icon: UserCheck,
              color: "text-[#4ade80]",
              bg: "bg-[#0f2a1e]",
              title: "Rate explorers",
              body: "Providers rate the explorers they host — communication, respect, and reliability — helping build community trust.",
            },
            {
              icon: Users,
              color: "text-[#8dc9ff]",
              bg: "bg-[#13283a]",
              title: "Review community guides",
              body: "Anyone can review the community guides who answer questions in Ask-a-Local and lead Guide+ sessions.",
            },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} className="theme-panel rounded-[28px] p-6">
              <div className={`mb-4 inline-flex rounded-2xl p-3 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="theme-heading font-semibold">{title}</h3>
              <p className="theme-muted mt-2 text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        {/* Blind rating explainer */}
        <div className="mb-10 rounded-[28px] bg-gradient-to-r from-[#1e1b2e] to-[#1a1e2e] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#2d2455] p-3">
              <Star className="h-5 w-5 text-[#c4b5fd]" />
            </div>
            <div>
              <h3 className="theme-heading font-semibold">Blind rating window</h3>
              <p className="theme-muted mt-2 text-sm leading-6">
                Ratings are hidden for 7 days after a booking completes. Both parties
                submit independently before seeing each other&apos;s score. This
                eliminates retaliation bias and keeps feedback authentic.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive demo */}
        <div className="theme-panel rounded-[32px] p-6">
          <div className="mb-5 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#ff5630]" />
            <h2 className="theme-heading text-xl font-semibold">Live demo</h2>
          </div>

          {/* Review type selector */}
          <FilterChips
            options={reviewTypeChips}
            selected={selectedType}
            onSelect={(id) => setSelectedType(id as ReviewType)}
            className="mb-6"
          />

          {/* Tab navigation */}
          <div className="mb-6 border-b border-white/8">
            <div className="flex gap-6">
              {tabChips.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabId)}
                  className={`pb-3 text-sm font-medium transition ${
                    activeTab === id
                      ? "border-b-2 border-[#ff5630] text-[#ff5630]"
                      : "theme-muted hover:text-current"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "overview" && (
            <RatingSummary
              overallRating={currentData.overallRating}
              totalReviews={currentData.totalReviews}
              ratingDistribution={currentData.ratingDistribution}
              criteriaRatings={currentData.criteriaRatings}
              recentReviews={currentData.recentReviews}
              showWriteReview
              onWriteReview={() => setActiveTab("write-review")}
            />
          )}

          {activeTab === "reviews" && (
            <RatingSummary
              overallRating={currentData.overallRating}
              totalReviews={currentData.totalReviews}
              ratingDistribution={currentData.ratingDistribution}
              criteriaRatings={currentData.criteriaRatings}
              recentReviews={currentData.recentReviews}
              showWriteReview
              onWriteReview={() => setActiveTab("write-review")}
            />
          )}

          {activeTab === "write-review" && (
            <ReviewForm
              reviewType={selectedType}
              targetName="Sample Target"
              onSubmit={() => setActiveTab("overview")}
              onCancel={() => setActiveTab("overview")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

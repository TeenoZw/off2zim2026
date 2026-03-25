"use client";

import React, { useState } from "react";
import ProviderDashboardHeader from "../../components/provider-dashboard/ProviderDashboardHeader";
import ProviderOverview from "../../components/provider-dashboard/ProviderOverview";
import ListingManagement from "../../components/provider-dashboard/ListingManagement";
import EnhancedOrderManagement from "../../components/provider-dashboard/EnhancedOrderManagement";
import VerificationStatus from "../../components/provider-dashboard/VerificationStatus";
import CompanyProfile from "../../components/provider-dashboard/CompanyProfile";
import {
  BarChart3,
  Building2,
  Package,
  Shield,
  Star,
  Users,
} from "lucide-react";

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for notification badges
  const notificationData = {
    pendingOrders: 3,
    activeDisputes: 1,
    verificationProgress: 75,
    unreadMessages: 2,
    pendingListings: 1,
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Performance metrics and recent activity",
    },
    {
      id: "profile",
      label: "Company Profile",
      icon: Building2,
      description: "Manage business information and settings",
    },
    {
      id: "listings",
      label: "Listings",
      icon: Package,
      description: "Manage your services and products",
      badge:
        notificationData.pendingListings > 0
          ? notificationData.pendingListings
          : null,
    },
    {
      id: "orders",
      label: "Orders & Disputes",
      icon: Users,
      description: "Handle bookings and customer disputes",
      badge: notificationData.pendingOrders + notificationData.activeDisputes,
      badgeColor:
        notificationData.activeDisputes > 0
          ? "bg-red-100 text-red-800"
          : "bg-orange-100 text-orange-800",
    },
    {
      id: "verification",
      label: "Verification",
      icon: Shield,
      description: "Complete verification process",
      badge: `${notificationData.verificationProgress}%`,
      badgeColor:
        notificationData.verificationProgress === 100
          ? "bg-green-100 text-green-800"
          : "bg-blue-100 text-blue-800",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProviderOverview onNavigateToTab={setActiveTab} />;
      case "profile":
        return <CompanyProfile />;
      case "listings":
        return <ListingManagement />;
      case "orders":
        return <EnhancedOrderManagement />;
      case "verification":
        return <VerificationStatus />;
      default:
        return <ProviderOverview onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <div className="theme-page min-h-screen">
      <main>
        <ProviderDashboardHeader />

        {/* Navigation Tabs */}
        <div className="sticky top-0 z-40 border-b border-black/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070707]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Tab Selector */}
            <div className="sm:hidden py-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="theme-input w-full rounded-2xl px-4 py-3"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                    {tab.badge && ` (${tab.badge})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden space-x-8 overflow-x-auto sm:flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-[#ff5630] text-slate-950 dark:text-white"
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-black/15 dark:text-white/45 dark:hover:text-white/75 dark:hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && (
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          tab.badgeColor || "bg-white/10 text-white/80"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Message for New Users */}
          {notificationData.verificationProgress < 50 &&
            activeTab === "overview" && (
              <div className="mb-6 rounded-[28px] border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-6 dark:border-[#ff5630]/20 dark:from-[#241612] dark:to-[#17110f]">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-[#2d1714]">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Welcome to Off2Zim
                    </h3>
                    <p className="mb-4 text-gray-700 dark:text-white/70">
                      Get started by completing your company profile and
                      verification process to unlock all features.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                      >
                        Complete Profile
                      </button>
                      <button
                        onClick={() => setActiveTab("verification")}
                        className="rounded-lg border border-orange-600 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:bg-transparent dark:text-orange-300 dark:hover:bg-[#2d1714]"
                      >
                        Start Verification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Tab Description */}
          <div className="mb-6">
            <div className="theme-panel rounded-[28px] p-5">
              <div className="flex items-center gap-3">
                {tabs.map((tab) => {
                  if (tab.id === activeTab) {
                    const Icon = tab.icon;
                    return (
                      <React.Fragment key={tab.id}>
                        <div className="rounded-2xl bg-[#2d1714] p-3">
                          <Icon className="w-5 h-5 text-[#ff7352]" />
                        </div>
                        <div>
                          <h1 className="theme-heading text-xl font-bold">
                            {tab.label}
                          </h1>
                          <p className="theme-muted text-sm">
                            {tab.description}
                          </p>
                        </div>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="transition-all duration-300">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

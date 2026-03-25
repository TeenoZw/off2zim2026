"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const UserDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    bio: user?.profile?.bio || "",
  });

  if (!user) return null;

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const getVerificationBadge = () => {
    if (!user.verification) return null;

    const badges = [];
    if (user.verification.email) badges.push("Email");
    if (user.verification.phone) badges.push("Phone");
    if (user.verification.identity) badges.push("ID");
    if (user.verification.business) badges.push("Business");

    return badges.length > 0 ? badges.join(", ") : "None";
  };

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case "explorer":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Trips Planned
              </h3>
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-blue-700">Active trips</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Reviews Given
              </h3>
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-green-700">Average: 4.8/5</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                Guides Consulted
              </h3>
              <p className="text-2xl font-bold text-purple-600">8</p>
              <p className="text-sm text-purple-700">Local experts</p>
            </div>
          </div>
        );

      case "provider":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">
                Active Listings
              </h3>
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-sm text-orange-700">Services offered</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Monthly Revenue
              </h3>
              <p className="text-2xl font-bold text-green-600">$1,250</p>
              <p className="text-sm text-green-700">+15% from last month</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Customer Rating
              </h3>
              <p className="text-2xl font-bold text-blue-600">4.7/5</p>
              <p className="text-sm text-blue-700">Based on 34 reviews</p>
            </div>
          </div>
        );

      case "guide":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">
                Consultations
              </h3>
              <p className="text-2xl font-bold text-indigo-600">47</p>
              <p className="text-sm text-indigo-700">This month</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Expert Rating
              </h3>
              <p className="text-2xl font-bold text-yellow-600">4.9/5</p>
              <p className="text-sm text-yellow-700">Based on 89 reviews</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Earnings</h3>
              <p className="text-2xl font-bold text-green-600">$890</p>
              <p className="text-sm text-green-700">This month</p>
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Total Users</h3>
              <p className="text-2xl font-bold text-red-600">1,247</p>
              <p className="text-sm text-red-700">+23 this week</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Active Providers
              </h3>
              <p className="text-2xl font-bold text-blue-600">89</p>
              <p className="text-sm text-blue-700">Verified businesses</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Platform Revenue
              </h3>
              <p className="text-2xl font-bold text-green-600">$12,450</p>
              <p className="text-sm text-green-700">This month</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                Pending Reviews
              </h3>
              <p className="text-2xl font-bold text-purple-600">7</p>
              <p className="text-sm text-purple-700">Need attention</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 capitalize">
                {user.role} Dashboard • Verification: {getVerificationBadge()}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Dashboard Overview
              </h2>
              {getRoleSpecificContent()}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {user.role === "explorer" && (
                  <>
                    <a
                      href="/trip-planner"
                      className="bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <h4 className="font-medium text-blue-900">
                        Plan New Trip
                      </h4>
                      <p className="text-sm text-blue-700">Create itinerary</p>
                    </a>
                    <a
                      href="/community-guides"
                      className="bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <h4 className="font-medium text-green-900">
                        Ask a Local
                      </h4>
                      <p className="text-sm text-green-700">
                        Get expert advice
                      </p>
                    </a>
                  </>
                )}
                {user.role === "provider" && (
                  <>
                    <a
                      href="/provider-dashboard"
                      className="bg-orange-100 p-4 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <h4 className="font-medium text-orange-900">
                        Manage Listings
                      </h4>
                      <p className="text-sm text-orange-700">Update services</p>
                    </a>
                    <a
                      href="/marketplace"
                      className="bg-purple-100 p-4 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <h4 className="font-medium text-purple-900">
                        Add Products
                      </h4>
                      <p className="text-sm text-purple-700">Sell items</p>
                    </a>
                  </>
                )}
                <a
                  href="/rating-system"
                  className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Reviews</h4>
                  <p className="text-sm text-gray-700">Manage ratings</p>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Member Since
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user.profile?.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.profile.bio}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Security Settings
            </h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Password
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Enable 2FA
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Verification</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.verification?.email
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.verification?.email ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Phone Verification</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.verification?.phone
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.verification?.phone ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  {user.role === "provider" && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        Business Verification
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.verification?.business
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.verification?.business
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">
                      Trip reminders and updates
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">
                      New message notifications
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">
                      Marketing and promotional emails
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Push Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">
                      Booking confirmations
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">Review requests</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

"use client";

import React, { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface CommunityGuideApplication {
  id: string;
  applicantName: string;
  email: string;
  location: string;
  explorerScore: number;
  yearsInZimbabwe: number;
  languages: string[];
  expertise: string[];
  motivation: string;
  references: {
    name: string;
    relationship: string;
    contact: string;
  }[];
  documents: {
    name: string;
    type: string;
    url: string;
  }[];
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
}

// Mock data for demonstration
const mockApplications: CommunityGuideApplication[] = [
  {
    id: "1",
    applicantName: "Tendai Mukamuri",
    email: "tendai@email.com",
    location: "Harare",
    explorerScore: 4.8,
    yearsInZimbabwe: 25,
    languages: ["English", "Shona", "Ndebele"],
    expertise: ["Cultural Heritage", "Historical Sites", "Urban Tourism"],
    motivation:
      "I've been passionate about sharing Zimbabwe's rich history and culture with visitors for over a decade...",
    references: [
      {
        name: "Sarah Johnson",
        relationship: "Tourism Manager at ZTA",
        contact: "sarah@zta.co.zw",
      },
      {
        name: "Michael Chivero",
        relationship: "Local Business Owner",
        contact: "michael@localbiznw.co.zw",
      },
    ],
    documents: [
      {
        name: "Tourism Qualification Certificate",
        type: "PDF",
        url: "/documents/cert1.pdf",
      },
      {
        name: "Character Reference Letter",
        type: "PDF",
        url: "/documents/ref1.pdf",
      },
    ],
    submittedAt: new Date("2024-12-01"),
    status: "pending",
  },
  {
    id: "2",
    applicantName: "Chipo Makoni",
    email: "chipo@email.com",
    location: "Victoria Falls",
    explorerScore: 4.6,
    yearsInZimbabwe: 30,
    languages: ["English", "Shona", "Tonga"],
    expertise: ["Adventure Tourism", "Wildlife", "Hospitality"],
    motivation:
      "Living in Victoria Falls, I've had the privilege of experiencing Zimbabwe's natural wonders daily...",
    references: [
      {
        name: "James Wright",
        relationship: "Hotel Manager",
        contact: "james@vicfallshotel.com",
      },
    ],
    documents: [
      {
        name: "Wildlife Guide Certification",
        type: "PDF",
        url: "/documents/wildlife_cert.pdf",
      },
    ],
    submittedAt: new Date("2024-11-28"),
    status: "pending",
  },
];

export default function CommunityGuideReview() {
  const [applications, setApplications] =
    useState<CommunityGuideApplication[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [reviewNotes, setReviewNotes] = useState<string>("");

  const handleApprove = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: "approved" as const } : app
      )
    );
    setSelectedApplication(null);
    setReviewNotes("");
  };

  const handleReject = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: "rejected" as const } : app
      )
    );
    setSelectedApplication(null);
    setReviewNotes("");
  };

  const selectedApp = applications.find(
    (app) => app.id === selectedApplication
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Community Guide Applications
        </h1>
        <p className="text-gray-600">
          Review and approve applications from Local Explorers wanting to become
          Community Guides
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Pending Applications</h2>
            <div className="space-y-3">
              {applications
                .filter((app) => app.status === "pending")
                .map((application) => (
                  <div
                    key={application.id}
                    onClick={() => setSelectedApplication(application.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedApplication === application.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {application.applicantName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {application.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {application.explorerScore} Explorer Score
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {application.submittedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Processed Applications */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-3">Recent Reviews</h3>
              <div className="space-y-2">
                {applications
                  .filter((app) => app.status !== "pending")
                  .map((application) => (
                    <div
                      key={application.id}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {application.applicantName}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApp.applicantName}
                  </h2>
                  <p className="text-gray-600">{selectedApp.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Applied on</div>
                  <div className="font-medium">
                    {selectedApp.submittedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <StarIcon className="h-6 w-6 text-orange-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">
                        Explorer Score
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {selectedApp.explorerScore}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="text-lg font-bold text-blue-600">
                        {selectedApp.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">
                        Years in Zimbabwe
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {selectedApp.yearsInZimbabwe}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages & Expertise */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Expertise Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.expertise.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Motivation</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedApp.motivation}
                </p>
              </div>

              {/* References */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">References</h3>
                <div className="space-y-3">
                  {selectedApp.references.map((ref, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="font-medium">{ref.name}</div>
                      <div className="text-sm text-gray-600">
                        {ref.relationship}
                      </div>
                      <div className="text-sm text-blue-600">{ref.contact}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Supporting Documents
                </h3>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <DocumentArrowDownIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Add any notes about this application..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(selectedApp.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Approve Application
                </button>
                <button
                  onClick={() => handleReject(selectedApp.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Reject Application
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an Application
              </h3>
              <p className="text-gray-600">
                Choose an application from the list to review the details and
                make a decision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

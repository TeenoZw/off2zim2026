"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";

const BookingCancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardContent className="p-8 text-center">
            {/* Cancel Icon */}
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Cancelled
            </h1>

            <p className="text-gray-600 mb-6">
              Your payment was cancelled and no charges were made to your
              account.
            </p>

            {/* What Happened */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">
                What happened?
              </h3>
              <ul className="text-sm text-red-700 text-left space-y-1">
                <li>• Payment was cancelled during checkout</li>
                <li>• No charges were made to your payment method</li>
                <li>• Your booking was not confirmed</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/accommodation"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
              >
                <RefreshCw className="w-4 h-4" />
                Try Booking Again
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              <Link
                href="/support"
                className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-sm text-gray-500">
              <p>
                Need help with your booking? Our team is available 24/7 to
                assist you.
              </p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:support@off2zim.com"
                  className="text-emerald-600 hover:underline"
                >
                  support@off2zim.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+263123456789"
                  className="text-emerald-600 hover:underline"
                >
                  +263 123 456 789
                </a>
              </p>
            </div>

            {/* Popular Alternatives */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                Popular Alternatives
              </h4>
              <div className="space-y-2">
                <Link
                  href="/activities"
                  className="block text-sm text-emerald-600 hover:underline"
                >
                  Explore Activities in Zimbabwe
                </Link>
                <Link
                  href="/trip-planner"
                  className="block text-sm text-emerald-600 hover:underline"
                >
                  Plan Your Perfect Trip
                </Link>
                <Link
                  href="/community-guides"
                  className="block text-sm text-emerald-600 hover:underline"
                >
                  Ask Local Guides
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCancelPage;

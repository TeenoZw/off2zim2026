import React from "react";
import { Check } from "lucide-react";

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-600" />
      <span>{children}</span>
    </li>
  );
}

export const Pricing5: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Pricing Plans
          </h2>
          <p className="text-gray-600">
            Choose the perfect accommodation for your budget
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Standard</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $89<span className="text-sm font-normal">/night</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <FeatureItem>Comfortable rooms</FeatureItem>
              <FeatureItem>Basic amenities</FeatureItem>
              <FeatureItem>24/7 front desk</FeatureItem>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Premium</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $159<span className="text-sm font-normal">/night</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <FeatureItem>Luxury rooms</FeatureItem>
              <FeatureItem>Premium amenities</FeatureItem>
              <FeatureItem>Concierge service</FeatureItem>
              <FeatureItem>Spa access</FeatureItem>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Suite</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $299<span className="text-sm font-normal">/night</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <FeatureItem>Executive suites</FeatureItem>
              <FeatureItem>All amenities</FeatureItem>
              <FeatureItem>Personal butler</FeatureItem>
              <FeatureItem>Private dining</FeatureItem>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

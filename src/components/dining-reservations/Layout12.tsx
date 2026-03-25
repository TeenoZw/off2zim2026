import React from "react";

export const Layout12: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-gray-50">
      <div className="container">
        <div className="bg-orange-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Special Dining Packages
            </h2>
            <p className="text-gray-600 mb-8">
              Enhance your dining experience with our curated packages
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">
                  Romantic Dinner
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Perfect for couples
                </p>
                <div className="text-2xl font-bold text-orange-600">$89</div>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Family Feast</h3>
                <p className="text-gray-600 text-sm mb-4">Great for families</p>
                <div className="text-2xl font-bold text-orange-600">$149</div>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">
                  Group Experience
                </h3>
                <p className="text-gray-600 text-sm mb-4">Ideal for groups</p>
                <div className="text-2xl font-bold text-orange-600">$199</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

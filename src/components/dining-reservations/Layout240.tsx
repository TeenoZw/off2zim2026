import React from "react";

export const Layout240: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Dine With Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best dining experiences Zimbabwe has to offer, from
            traditional cuisine to modern fusion
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-2">Fresh Ingredients</h3>
            <p className="text-sm text-gray-600">
              Locally sourced, fresh ingredients daily
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-2">
              Cultural Experience
            </h3>
            <p className="text-sm text-gray-600">
              Immerse yourself in Zimbabwean culture
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-2">Expert Chefs</h3>
            <p className="text-sm text-gray-600">
              Trained chefs with years of experience
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-2">Memorable Moments</h3>
            <p className="text-sm text-gray-600">
              Create lasting dining memories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

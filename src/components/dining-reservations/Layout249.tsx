import React from "react";

export const Layout249: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Restaurants
          </h2>
          <p className="text-gray-600">
            Discover our handpicked selection of dining establishments
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Traditional Cuisine
              </h3>
              <p className="text-gray-600 text-sm">
                Authentic Zimbabwean dishes
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Modern Fusion</h3>
              <p className="text-gray-600 text-sm">
                Contemporary African cuisine
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">International</h3>
              <p className="text-gray-600 text-sm">
                World cuisine with local flair
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

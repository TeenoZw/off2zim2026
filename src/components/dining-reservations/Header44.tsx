import React from "react";

export const Header44: React.FC = () => {
  return (
    <header className="px-[5%] py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Authentic Zimbabwean Cuisine
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Experience the rich flavors and traditional dishes of Zimbabwe
        </p>
        <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Explore Restaurants
        </button>
      </div>
    </header>
  );
};

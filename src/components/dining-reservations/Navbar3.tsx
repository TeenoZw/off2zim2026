import React from "react";

export const Navbar3: React.FC = () => {
  return (
    <nav className="px-[5%] py-4 bg-white border-b">
      <div className="container flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">Off2Zim</div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Restaurants
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

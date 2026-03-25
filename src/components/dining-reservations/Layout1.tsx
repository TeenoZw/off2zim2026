import React from "react";
import { Calendar, Star, Utensils } from "lucide-react";

export const Layout1: React.FC = () => {
  return (
    <section className="px-[5%] py-12 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Local Cuisine
            </h3>
            <p className="text-gray-600">
              Authentic Zimbabwean dishes prepared by local chefs
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Top Rated</h3>
            <p className="text-gray-600">
              Hand-picked restaurants with excellent reviews
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Easy Booking
            </h3>
            <p className="text-gray-600">
              Simple reservation system with instant confirmation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

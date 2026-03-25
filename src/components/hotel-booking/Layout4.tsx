import React from "react";

export const Layout4: React.FC = () => {
  return (
    <section className="px-[5%] py-12">
      <div className="container">
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Our Hotels?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900">Prime Locations</h3>
              <p className="text-sm text-gray-600">
                Central locations near attractions
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Modern Amenities</h3>
              <p className="text-sm text-gray-600">
                All modern facilities included
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Local Experience</h3>
              <p className="text-sm text-gray-600">
                Authentic Zimbabwean hospitality
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Value for Money</h3>
              <p className="text-sm text-gray-600">Best rates guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

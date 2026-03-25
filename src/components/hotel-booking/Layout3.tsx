import React from "react";

export const Layout3: React.FC = () => {
  return (
    <section className="px-[5%] py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">Best Prices</h3>
            <p className="text-sm text-gray-600">Guaranteed lowest rates</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">Quality Service</h3>
            <p className="text-sm text-gray-600">24/7 customer support</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">Secure Booking</h3>
            <p className="text-sm text-gray-600">Safe and secure payments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

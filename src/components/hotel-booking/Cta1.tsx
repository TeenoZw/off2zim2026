import React from "react";

export const Cta1: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-blue-600">
      <div className="container">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the best of Zimbabwe hospitality
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

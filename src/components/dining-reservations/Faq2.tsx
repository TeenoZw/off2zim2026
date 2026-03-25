import React from "react";

export const Faq2: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dining FAQs</h2>
          <p className="text-gray-600">
            Common questions about our restaurants and reservations
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              How far in advance should I make a reservation?
            </h3>
            <p className="text-gray-600">
              We recommend booking at least 24 hours in advance, especially for
              weekend dining and special occasions.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Do you accommodate dietary restrictions?
            </h3>
            <p className="text-gray-600">
              Yes! Our restaurants can accommodate vegetarian, vegan, and
              gluten-free requirements. Please mention this when booking.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept cash, all major credit cards, and mobile money payments
              (EcoCash, OneMoney).
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Is there a cancellation fee?
            </h3>
            <p className="text-gray-600">
              Cancellations made more than 2 hours before your reservation time
              are free. Late cancellations may incur a small fee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

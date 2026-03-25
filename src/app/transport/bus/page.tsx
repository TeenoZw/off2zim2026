import React from "react";
import { Button } from "@relume_io/relume-ui";
import Image from "next/image";

const busRoutes = [
  {
    route: "Harare - Bulawayo",
    duration: "4-5 hours",
    frequency: "Daily departures",
    operators: ["Pioneer", "Pathfinder", "Tombs"],
    price: "$8-15",
  },
  {
    route: "Harare - Victoria Falls",
    duration: "7-8 hours",
    frequency: "2-3 daily",
    operators: ["Eagle Liner", "Bravo Tours", "Intercape"],
    price: "$12-20",
  },
  {
    route: "Bulawayo - Victoria Falls",
    duration: "3-4 hours",
    frequency: "Daily departures",
    operators: ["Pathfinder", "Tenda Bus", "Eagle Liner"],
    price: "$6-12",
  },
  {
    route: "Harare - Mutare",
    duration: "3-4 hours",
    frequency: "Multiple daily",
    operators: ["Blue Arrow", "Kukura", "City Link"],
    price: "$5-10",
  },
];

const busTypes = [
  {
    type: "Luxury Coaches",
    description:
      "Air-conditioned coaches with reclining seats and entertainment",
    features: ["AC", "WiFi", "Refreshments", "Extra Legroom"],
    image: "/images/luxury-bus.jpg",
  },
  {
    type: "Standard Buses",
    description: "Comfortable standard buses for intercity travel",
    features: ["Regular Seating", "Luggage Space", "Affordable", "Reliable"],
    image: "/images/standard-bus.jpg",
  },
  {
    type: "City Buses",
    description: "Local urban transport within cities",
    features: [
      "Frequent Service",
      "Multiple Stops",
      "Budget Friendly",
      "Daily Routes",
    ],
    image: "/images/city-bus.jpg",
  },
];

export default function BusTransportPage() {
  return (
    <>
      {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 to-black text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-[16px] flex items-center justify-center">
                  <Image
                    src="/icons/bus.png"
                    alt="Bus"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 font-['Century_Gothic']">
                Bus Transport Services
              </h1>
              <p className="text-xl mb-8 text-gray-200 font-['Century_Gothic']">
                Travel comfortably across Zimbabwe with our reliable bus
                services. From luxury coaches to budget-friendly options, we
                connect you to every corner of the country.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  title="Book Bus Ticket"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                >
                  Book Bus Ticket
                </Button>
                <Button
                  title="View Timetables"
                  variant="secondary"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                >
                  View Timetables
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4 font-['Century_Gothic']">
                Popular Bus Routes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Century_Gothic']">
                Choose from our most popular intercity routes with multiple
                daily departures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {busRoutes.map((route, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[16px] shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-black font-['Century_Gothic']">
                        {route.route}
                      </h3>
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        {route.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="font-['Century_Gothic']">
                        <span className="font-medium">Duration:</span>{" "}
                        {route.duration}
                      </div>
                      <div className="font-['Century_Gothic']">
                        <span className="font-medium">Frequency:</span>{" "}
                        {route.frequency}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-gray-700 font-['Century_Gothic']">
                        Operators:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {route.operators.map((operator, opIndex) => (
                          <span
                            key={opIndex}
                            className="px-3 py-1 bg-gray-100 text-black rounded-[16px] text-sm font-['Century_Gothic']"
                          >
                            {operator}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      title="Book This Route"
                      className="w-full bg-black hover:bg-gray-800 rounded-[16px] font-['Century_Gothic']"
                    >
                      Book This Route
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bus Types */}
        <section className="py-16 bg-gray-50/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4 font-['Century_Gothic']">
                Types of Bus Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Century_Gothic']">
                Choose the service that best fits your comfort and budget needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {busTypes.map((bus, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[16px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black rounded-[16px] flex items-center justify-center">
                      <Image
                        src="/icons/bus.png"
                        alt="Bus"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3 font-['Century_Gothic']">
                      {bus.type}
                    </h3>
                    <p className="text-gray-600 mb-4 font-['Century_Gothic']">
                      {bus.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {bus.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-700 text-sm font-['Century_Gothic']">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      title="Learn More"
                      variant="secondary"
                      className="w-full border-black text-black hover:bg-gray-50 rounded-[16px] font-['Century_Gothic']"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-black text-center mb-12 font-['Century_Gothic']">
                How to Book Your Bus Ticket
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                      1
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-['Century_Gothic'] text-black">
                    Select Route
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    Choose your departure and destination cities with preferred
                    travel date
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                      2
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-['Century_Gothic'] text-black">
                    Choose Service
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    Select from available bus operators and service types
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                      3
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-['Century_Gothic'] text-black">
                    Book & Pay
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    Secure payment and receive your ticket confirmation
                    instantly
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Button
                  title="Start Booking Now"
                  className="bg-black hover:bg-gray-800 px-12 py-4 text-lg rounded-[16px] font-['Century_Gothic']"
                >
                  Start Booking Now
                </Button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

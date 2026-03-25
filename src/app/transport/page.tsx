import React from "react";
import { Button } from "@relume_io/relume-ui";
import Image from "next/image";
import Link from "next/link";

const transportTypes = [
  {
    id: "bus",
    name: "Bus Transport",
    description: "Comfortable intercity and local bus services across Zimbabwe",
    icon: "/icons/bus.png",
    href: "/transport/bus",
    features: [
      "Intercity Routes",
      "Local Transport",
      "Tour Buses",
      "Group Transport",
    ],
  },
  {
    id: "car-rental",
    name: "Car Rental",
    description: "Rent vehicles for self-drive adventures and city exploration",
    icon: "/icons/rental.png",
    href: "/transport/car-rental",
    features: [
      "Economy Cars",
      "SUVs & 4WDs",
      "Luxury Vehicles",
      "Commercial Vehicles",
    ],
  },
  {
    id: "flights",
    name: "Flights",
    description:
      "Domestic and international flight bookings and charter services",
    icon: "/icons/plane.png",
    href: "/transport/flights",
    features: [
      "Domestic Flights",
      "International Routes",
      "Charter Flights",
      "Scenic Flights",
    ],
  },
  {
    id: "taxi",
    name: "Taxi Services",
    description: "Reliable taxi and ride-hailing services for local transport",
    icon: "/icons/taxi.png",
    href: "/transport/taxi",
    features: [
      "City Taxis",
      "Airport Transfers",
      "Long Distance",
      "Tour Taxis",
    ],
  },
];

export default function TransportPage() {
  return (
    <>
      {/* Hero Section */}
        <section className="relative py-20 text-white bg-gradient-to-br from-gray-900 to-black">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative z-10 px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 font-['Century_Gothic']">
                Transport Services in Zimbabwe
              </h1>
              <p className="text-xl mb-8 text-gray-200 font-['Century_Gothic']">
                Discover convenient and reliable transport options for your
                journey across Zimbabwe. From buses and car rentals to flights
                and taxis, we&apos;ve got you covered.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  title="Book Transport"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-[16px] font-['Century_Gothic']"
                >
                  Book Transport
                </Button>
                <Button
                  title="View Routes"
                  variant="secondary"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-[16px] font-['Century_Gothic']"
                >
                  View Routes
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Transport Types Grid */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container px-4 mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-black mb-4 font-['Century_Gothic']">
                Choose Your Transport
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Century_Gothic']">
                Select from our range of transport services designed to meet all
                your travel needs in Zimbabwe
              </p>
            </div>

            <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-2">
              {transportTypes.map((transport) => (
                <div
                  key={transport.id}
                  className="group bg-white rounded-[16px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-[16px] flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <Image
                          src={transport.icon}
                          alt={transport.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors font-['Century_Gothic']">
                          {transport.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed font-['Century_Gothic']">
                      {transport.description}
                    </p>

                    <div className="mb-8 space-y-3">
                      {transport.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-700 font-['Century_Gothic']">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link href={transport.href}>
                      <Button
                        title={`Explore ${transport.name}`}
                        className="w-full bg-black hover:bg-gray-800 text-white rounded-[16px] font-['Century_Gothic']"
                      >
                        Explore {transport.name}
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Transport Section */}
        <section className="py-16 bg-gray-50/80 backdrop-blur-sm">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-black mb-6 font-['Century_Gothic']">
                Why Choose Our Transport Services?
              </h2>
              <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-['Century_Gothic'] text-black">
                    Reliable & Safe
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    All our transport partners are vetted for safety and
                    reliability
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-['Century_Gothic'] text-black">
                    24/7 Support
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    Round-the-clock customer support for all your transport
                    needs
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-['Century_Gothic'] text-black">
                    Best Prices
                  </h3>
                  <p className="text-gray-600 font-['Century_Gothic']">
                    Competitive pricing across all transport options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

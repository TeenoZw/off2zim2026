import { Button } from "@relume_io/relume-ui";
import {
  Plane,
  Calendar,
  Clock,
  Star,
  Luggage,
  Wifi,
  Coffee,
} from "lucide-react";

export default function FlightsPage() {
  const flightRoutes = [
    {
      route: "Harare → Victoria Falls",
      duration: "1h 15m",
      frequency: "Daily",
      price: "From $180",
      airlines: ["Air Zimbabwe", "Fastjet"],
    },
    {
      route: "Harare → Bulawayo",
      duration: "1h 5m",
      frequency: "Daily",
      price: "From $160",
      airlines: ["Air Zimbabwe"],
    },
    {
      route: "Harare → Johannesburg",
      duration: "1h 30m",
      frequency: "Multiple daily",
      price: "From $280",
      airlines: ["Air Zimbabwe", "South African Airways", "Fastjet"],
    },
    {
      route: "Harare → Cape Town",
      duration: "2h 15m",
      frequency: "Daily",
      price: "From $320",
      airlines: ["Air Zimbabwe", "South African Airways"],
    },
    {
      route: "Victoria Falls → Johannesburg",
      duration: "1h 45m",
      frequency: "Daily",
      price: "From $290",
      airlines: ["South African Airways", "Fastjet"],
    },
    {
      route: "Harare → Nairobi",
      duration: "2h 45m",
      frequency: "3x weekly",
      price: "From $450",
      airlines: ["Kenya Airways", "Ethiopian Airlines"],
    },
  ];

  const flightClasses = [
    {
      name: "Economy Class",
      description: "Comfortable and affordable travel",
      features: [
        "Standard seating",
        "In-flight meal",
        "20kg baggage",
        "Entertainment system",
      ],
      icon: <Plane className="h-8 w-8 text-black" />,
    },
    {
      name: "Business Class",
      description: "Premium comfort and service",
      features: [
        "Extra legroom",
        "Priority boarding",
        "Premium meals",
        "30kg baggage",
      ],
      icon: <Star className="h-8 w-8 text-black" />,
    },
    {
      name: "First Class",
      description: "Ultimate luxury experience",
      features: [
        "Lie-flat seats",
        "Gourmet dining",
        "50kg baggage",
        "Airport lounge access",
      ],
      icon: <Star className="h-8 w-8 text-black" />,
    },
  ];

  const airlines = [
    {
      name: "Air Zimbabwe",
      description: "National carrier with domestic and regional routes",
      destinations: "15+ destinations",
      fleet: "Modern Boeing aircraft",
    },
    {
      name: "South African Airways",
      description: "Premium regional and international flights",
      destinations: "Major African cities",
      fleet: "Airbus and Boeing fleet",
    },
    {
      name: "Fastjet",
      description: "Low-cost carrier for budget travelers",
      destinations: "Regional routes",
      fleet: "Embraer aircraft",
    },
    {
      name: "Kenya Airways",
      description: "East African hub with global connections",
      destinations: "Worldwide network",
      fleet: "Modern wide-body aircraft",
    },
  ];

  const flightFeatures = [
    {
      icon: <Calendar className="h-6 w-6 text-black" />,
      title: "Flexible Booking",
      description: "Easy date changes and cancellations",
    },
    {
      icon: <Luggage className="h-6 w-6 text-black" />,
      title: "Baggage Included",
      description: "Generous baggage allowances",
    },
    {
      icon: <Wifi className="h-6 w-6 text-black" />,
      title: "In-Flight WiFi",
      description: "Stay connected during your flight",
    },
    {
      icon: <Coffee className="h-6 w-6 text-black" />,
      title: "Complimentary Service",
      description: "Meals and beverages included",
    },
  ];

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/api/placeholder/1920/1080')" }}
      >
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-sm rounded-[16px] p-12 shadow-xl text-white">
                <div className="flex items-center justify-center mb-6">
                  <Plane className="h-16 w-16 text-white mr-4" />
                  <h1 className="text-5xl font-bold font-['Century_Gothic']">
                    Flight Services
                  </h1>
                </div>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-['Century_Gothic']">
                  Discover Zimbabwe and beyond with our comprehensive flight
                  booking services. From domestic routes to international
                  destinations, we help you soar to new heights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    title="Search Flights"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Search Flights
                  </Button>
                  <Button
                    title="Flight Status"
                    variant="secondary"
                    className="border-white text-white hover:bg-white/20 px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Flight Status
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Routes */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Popular Flight Routes
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flightRoutes.map((flight, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <Plane className="h-5 w-5 text-black mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800 font-['Century_Gothic']">
                          {flight.route}
                        </h3>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm font-['Century_Gothic']">
                            {flight.duration}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm font-['Century_Gothic']">
                            {flight.frequency}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-black font-['Century_Gothic']">
                          {flight.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-black hover:bg-gray-800 text-white rounded-[16px] font-['Century_Gothic']"
                        >
                          Book Flight
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 font-['Century_Gothic']">
                        Airlines: {flight.airlines.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Flight Classes */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Choose Your Travel Class
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {flightClasses.map((flightClass, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-2 rounded-[16px] mr-3">
                          {flightClass.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 font-['Century_Gothic']">
                          {flightClass.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4 font-['Century_Gothic']">
                        {flightClass.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {flightClass.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-600 font-['Century_Gothic']"
                          >
                            <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        title="Select Class"
                        className="w-full bg-black hover:bg-gray-800 text-white rounded-[16px] font-['Century_Gothic']"
                      >
                        Select Class
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Airlines */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Our Partner Airlines
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {airlines.map((airline, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                        {airline.name}
                      </h3>
                      <p className="text-gray-600 mb-4 font-['Century_Gothic']">
                        {airline.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-800 font-['Century_Gothic']">
                            Destinations:
                          </span>
                          <p className="text-gray-600 font-['Century_Gothic']">
                            {airline.destinations}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 font-['Century_Gothic']">
                            Fleet:
                          </span>
                          <p className="text-gray-600 font-['Century_Gothic']">
                            {airline.fleet}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Flight Features */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Flight Booking Benefits
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {flightFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-center mb-4">
                          <div className="bg-gray-100 p-3 rounded-[16px]">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm font-['Century_Gothic']">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Booking Process */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Easy Flight Booking
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        1
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Search Flights
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Enter your destination and travel dates
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        2
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Compare & Select
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Choose from available flights and airlines
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        3
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Passenger Details
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Enter traveler information and preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        4
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Confirm & Pay
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Complete payment and receive your tickets
                    </p>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <Button
                    title="Book Your Flight"
                    className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg rounded-[16px] font-['Century_Gothic']"
                  >
                    Book Your Flight
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

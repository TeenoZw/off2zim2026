import { Button } from "@relume_io/relume-ui";
import {
  Car,
  Clock,
  Shield,
  MapPin,
  Star,
  Phone,
  Navigation,
  CreditCard,
} from "lucide-react";

export default function TaxiPage() {
  const taxiServices = [
    {
      name: "City Taxi",
      description: "Quick rides within city limits",
      features: [
        "4-seater vehicles",
        "Metered fares",
        "Professional drivers",
        "24/7 availability",
      ],
      basePrice: "$2.50",
      icon: <Car className="h-8 w-8 text-black" />,
    },
    {
      name: "Airport Transfer",
      description: "Reliable airport pickup and drop-off",
      features: [
        "Meet & greet service",
        "Flight tracking",
        "Fixed pricing",
        "Luggage assistance",
      ],
      basePrice: "$25",
      icon: <Navigation className="h-8 w-8 text-black" />,
    },
    {
      name: "Luxury Taxi",
      description: "Premium vehicles for special occasions",
      features: [
        "Executive cars",
        "Leather interiors",
        "WiFi onboard",
        "Complimentary water",
      ],
      basePrice: "$8.00",
      icon: <Star className="h-8 w-8 text-black" />,
    },
  ];

  const popularRoutes = [
    {
      from: "Harare Airport",
      to: "City Center",
      price: "$25",
      time: "45 mins",
    },
    { from: "Harare", to: "Chitungwiza", price: "$15", time: "30 mins" },
    {
      from: "Bulawayo Airport",
      to: "City Center",
      price: "$20",
      time: "35 mins",
    },
    {
      from: "Victoria Falls Airport",
      to: "Hotels",
      price: "$30",
      time: "25 mins",
    },
    { from: "Harare", to: "Epworth", price: "$12", time: "25 mins" },
    { from: "Mutare", to: "Penhalonga", price: "$18", time: "40 mins" },
  ];

  const taxiFeatures = [
    {
      icon: <Clock className="h-6 w-6 text-black" />,
      title: "Quick Response",
      description: "Average pickup time under 10 minutes",
    },
    {
      icon: <Shield className="h-6 w-6 text-black" />,
      title: "Safe & Insured",
      description: "All vehicles and drivers are fully insured",
    },
    {
      icon: <Phone className="h-6 w-6 text-black" />,
      title: "Easy Booking",
      description: "Book via app, phone, or online platform",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-black" />,
      title: "Multiple Payment",
      description: "Cash, card, or mobile money accepted",
    },
  ];

  const driverBenefits = [
    "GPS tracking for all rides",
    "Background-checked drivers",
    "Regular vehicle maintenance",
    "Customer rating system",
    "24/7 customer support",
    "Transparent pricing",
  ];

  const cities = [
    { name: "Harare", vehicles: "200+ taxis", coverage: "Full city coverage" },
    { name: "Bulawayo", vehicles: "80+ taxis", coverage: "City & suburbs" },
    {
      name: "Victoria Falls",
      vehicles: "40+ taxis",
      coverage: "Tourism areas",
    },
    { name: "Mutare", vehicles: "35+ taxis", coverage: "City center" },
    { name: "Gweru", vehicles: "25+ taxis", coverage: "Main areas" },
    { name: "Masvingo", vehicles: "20+ taxis", coverage: "City routes" },
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
                  <Car className="h-16 w-16 text-white mr-4" />
                  <h1 className="text-5xl font-bold font-['Century_Gothic']">
                    Taxi Services
                  </h1>
                </div>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-['Century_Gothic']">
                  Get around Zimbabwe with our reliable taxi services. Safe,
                  comfortable, and convenient transportation whenever you need
                  it.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    title="Book a Taxi"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Book a Taxi
                  </Button>
                  <Button
                    title="Track Ride"
                    variant="secondary"
                    className="border-white text-white hover:bg-white/20 px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Track Ride
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Taxi Services */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Our Taxi Services
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {taxiServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-2 rounded-[16px] mr-3">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 font-['Century_Gothic']">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4 font-['Century_Gothic']">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-600 font-['Century_Gothic']"
                          >
                            <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                          From {service.basePrice}
                        </span>
                        <Button
                          title="Book Now"
                          className="bg-black hover:bg-gray-800 text-white rounded-[16px] font-['Century_Gothic']"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Popular Routes */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                  Popular Taxi Routes
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <Navigation className="h-5 w-5 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {route.from}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3">→ {route.to}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{route.time}</span>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">
                          {route.price}
                        </span>
                      </div>
                      <Button
                        title={`Book in ${route.from}`}
                        size="sm"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Book in {route.from}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Coverage Areas */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                  Service Coverage
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {city.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-2">{city.vehicles}</p>
                      <p className="text-sm text-gray-500">{city.coverage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                  Why Choose Our Taxis
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {taxiFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-center mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/90 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Additional Benefits
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {driverBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Process */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                  How to Book a Taxi
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        1
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Choose Location
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Set your pickup and destination points
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        2
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Select Service
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose from city taxi, airport transfer, or luxury
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        3
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Confirm Booking
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Review details and confirm your ride
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        4
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Track & Ride
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Track your driver and enjoy your ride
                    </p>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <Button
                    title="Start Booking Now"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-4 text-lg"
                  >
                    Start Booking Now
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  Need Help?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our customer support team is available 24/7 to assist you with
                  your taxi bookings and rides.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button
                    title="Call Emergency Line"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Emergency Line
                  </Button>
                  <Button
                    title="Report Issue"
                    variant="secondary"
                    className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-8 py-3"
                  >
                    Report Issue
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

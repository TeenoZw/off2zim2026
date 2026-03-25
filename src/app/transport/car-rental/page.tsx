import { Button } from "@relume_io/relume-ui";
import { Car, Clock, Shield, MapPin, Star } from "lucide-react";

export default function CarRentalPage() {
  const carTypes = [
    {
      name: "Economy Cars",
      description: "Fuel-efficient and budget-friendly options",
      features: ["Manual/Automatic", "AC", "4 Seats", "Great fuel economy"],
      priceFrom: "$25",
      icon: <Car className="h-8 w-8 text-black" />,
    },
    {
      name: "SUVs & 4WDs",
      description: "Perfect for group travel and adventures",
      features: [
        "4WD capability",
        "7-8 Seats",
        "Large luggage space",
        "Premium comfort",
      ],
      priceFrom: "$65",
      icon: <Car className="h-8 w-8 text-black" />,
    },
    {
      name: "Luxury Vehicles",
      description: "Premium cars for special occasions",
      features: [
        "Leather seats",
        "Premium sound",
        "GPS navigation",
        "Concierge service",
      ],
      priceFrom: "$120",
      icon: <Car className="h-8 w-8 text-black" />,
    },
  ];

  const popularLocations = [
    { city: "Harare", cars: "50+ vehicles", price: "From $25/day" },
    { city: "Bulawayo", cars: "35+ vehicles", price: "From $30/day" },
    { city: "Victoria Falls", cars: "25+ vehicles", price: "From $40/day" },
    { city: "Mutare", cars: "20+ vehicles", price: "From $28/day" },
    { city: "Gweru", cars: "15+ vehicles", price: "From $25/day" },
    { city: "Masvingo", cars: "18+ vehicles", price: "From $27/day" },
  ];

  const rentalFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-black" />,
      title: "Full Insurance Coverage",
      description: "Comprehensive insurance included with all rentals",
    },
    {
      icon: <Clock className="h-6 w-6 text-black" />,
      title: "24/7 Roadside Assistance",
      description: "Round-the-clock support wherever you go",
    },
    {
      icon: <MapPin className="h-6 w-6 text-black" />,
      title: "Multiple Pickup Locations",
      description: "Convenient pickup points across Zimbabwe",
    },
    {
      icon: <Star className="h-6 w-6 text-black" />,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprise charges",
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
                  <Car className="h-16 w-16 text-white mr-4" />
                  <h1 className="text-5xl font-bold font-['Century_Gothic']">
                    Car Rental Services
                  </h1>
                </div>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-['Century_Gothic']">
                  Explore Zimbabwe at your own pace with our premium car rental
                  services. From economy cars to luxury SUVs, we have the
                  perfect vehicle for your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    title="Browse All Cars"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Browse All Cars
                  </Button>
                  <Button
                    title="Get Quote"
                    variant="secondary"
                    className="border-white text-white hover:bg-white/20 px-8 py-3 rounded-[16px] font-['Century_Gothic']"
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Car Types Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Choose Your Perfect Vehicle
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {carTypes.map((car, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-2 rounded-[16px] mr-3">
                          {car.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 font-['Century_Gothic']">
                          {car.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4 font-['Century_Gothic']">
                        {car.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {car.features.map((feature, idx) => (
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
                          {car.priceFrom}/day
                        </span>
                        <Button
                          title="View Cars"
                          className="bg-black hover:bg-gray-800 text-white rounded-[16px] font-['Century_Gothic']"
                        >
                          View Cars
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Popular Locations */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Popular Rental Locations
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularLocations.map((location, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-black mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800 font-['Century_Gothic']">
                          {location.city}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-2 font-['Century_Gothic']">
                        {location.cars}
                      </p>
                      <p className="text-black font-semibold font-['Century_Gothic']">
                        {location.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Rental Features */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-[16px] p-12 shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 font-['Century_Gothic']">
                  Why Choose Our Car Rental
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {rentalFeatures.map((feature, index) => (
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
                  Easy Booking Process
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        1
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Choose Your Car
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Browse our fleet and select the perfect vehicle for your
                      needs
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        2
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Select Dates
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Pick your rental dates and preferred pickup location
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        3
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Complete Booking
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Fill in your details and make secure payment
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-black font-['Century_Gothic']">
                        4
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 font-['Century_Gothic']">
                      Pick Up & Drive
                    </h3>
                    <p className="text-gray-600 text-sm font-['Century_Gothic']">
                      Collect your car and start your adventure
                    </p>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <Button
                    title="Start Your Booking"
                    className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg rounded-[16px] font-['Century_Gothic']"
                  >
                    Start Your Booking
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

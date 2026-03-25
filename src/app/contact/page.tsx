import React from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import {
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: "Phone",
      description: "Speak with our travel experts",
      contact: "+263 4 123 456",
      availability: "Mon - Fri: 8AM - 6PM",
      action: "Call Now",
    },
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: "Email",
      description: "Send us your travel inquiries",
      contact: "info@off2zim.com",
      availability: "24/7 - Response within 24hrs",
      action: "Send Email",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      availability: "Mon - Fri: 8AM - 8PM",
      action: "Start Chat",
    },
    {
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Quick messages and support",
      contact: "+263 77 123 4567",
      availability: "Mon - Sat: 8AM - 10PM",
      action: "Message Us",
    },
  ];

  const offices = [
    {
      city: "Harare",
      address: "123 Nelson Mandela Avenue, Harare CBD",
      phone: "+263 4 123 456",
      email: "harare@off2zim.com",
      hours: "Mon - Fri: 8AM - 6PM, Sat: 9AM - 2PM",
      isHeadquarters: true,
    },
    {
      city: "Victoria Falls",
      address: "456 Livingstone Way, Victoria Falls",
      phone: "+263 13 789 012",
      email: "vicfalls@off2zim.com",
      hours: "Mon - Sun: 7AM - 8PM",
      isHeadquarters: false,
    },
    {
      city: "Bulawayo",
      address: "789 Joshua Nkomo Street, Bulawayo",
      phone: "+263 9 345 678",
      email: "bulawayo@off2zim.com",
      hours: "Mon - Fri: 8AM - 5PM, Sat: 9AM - 1PM",
      isHeadquarters: false,
    },
  ];

  const faqs = [
    {
      question: "What is the best time to visit Zimbabwe?",
      answer:
        "The dry season (May to October) is generally the best time to visit Zimbabwe, with cooler temperatures and excellent wildlife viewing opportunities.",
    },
    {
      question: "Do I need a visa to visit Zimbabwe?",
      answer:
        "Most visitors need a visa to enter Zimbabwe. Visas are available on arrival at airports and border posts, or can be obtained in advance from Zimbabwean embassies.",
    },
    {
      question: "What currency is used in Zimbabwe?",
      answer:
        "The US Dollar is the most widely accepted currency in Zimbabwe. Other accepted currencies include the South African Rand and British Pound.",
    },
    {
      question: "Is it safe to travel to Zimbabwe?",
      answer:
        "Zimbabwe is generally safe for tourists who take normal precautions. We recommend staying aware of your surroundings and following local advice.",
    },
    {
      question: "How far in advance should I book my trip?",
      answer:
        "We recommend booking at least 2-3 months in advance, especially for peak season (May-October) and popular destinations like Victoria Falls.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Let our Zimbabwe travel experts help you plan your perfect
                adventure
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                <ClockIcon className="w-5 h-5" />
                <span className="font-medium">Available 7 days a week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {method.description}
                  </p>
                  <p className="font-semibold text-primary mb-2">
                    {method.contact}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {method.availability}
                  </p>
                  <button className="btn-primary rounded-2xl w-full">
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="input w-full"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="input w-full"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="input w-full"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="input w-full"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Interest
                      </label>
                      <select className="input w-full">
                        <option>Select your interest</option>
                        <option>Safari & Wildlife</option>
                        <option>Adventure Activities</option>
                        <option>Cultural Tours</option>
                        <option>Accommodation</option>
                        <option>Transportation</option>
                        <option>Custom Package</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Travel Dates
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          className="input"
                          placeholder="Departure"
                        />
                        <input
                          type="date"
                          className="input"
                          placeholder="Return"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Travelers
                      </label>
                      <select className="input w-full">
                        <option>Select number</option>
                        <option>1 person</option>
                        <option>2 people</option>
                        <option>3-5 people</option>
                        <option>6-10 people</option>
                        <option>More than 10</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="input w-full resize-none"
                        placeholder="Tell us about your travel plans and any specific requirements..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full rounded-2xl"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <BuildingOfficeIcon className="w-6 h-6 text-primary" />
                      Our Offices
                    </h3>
                    <div className="space-y-6">
                      {offices.map((office, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">
                              {office.city}
                            </h4>
                            {office.isHeadquarters && (
                              <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                                Headquarters
                              </span>
                            )}
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <MapPinIcon className="w-4 h-4 mt-0.5 text-gray-400" />
                              <span>{office.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              <span>{office.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">
                      Emergency Contact
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium">24/7 Emergency Line</p>
                          <p className="text-sm text-gray-600">
                            +263 77 999 0000
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium">Emergency Email</p>
                          <p className="text-sm text-gray-600">
                            emergency@off2zim.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <h3 className="font-semibold text-lg pr-4">
                          {faq.question}
                        </h3>
                        <div className="transform transition-transform group-open:rotate-180">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section Placeholder */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Find Us
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-300 rounded-2xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <GlobeAltIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Interactive Map Coming Soon
                  </p>
                  <p className="text-sm text-gray-500">
                    Our offices across Zimbabwe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

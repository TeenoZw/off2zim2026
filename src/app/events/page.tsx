"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "../../contexts/PaymentContext";
import { BookingItem } from "../../types/payment";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
  capacity: string;
  organizer: string;
  status: string;
}

export default function EventsPage() {
  const router = useRouter();
  const { addToBooking, currentBooking } = usePayment();

  const handleBookEvent = (event: Event) => {
    const bookingItem: BookingItem = {
      id: `event_${event.id}`,
      type: "activity",
      name: event.title,
      description: event.description,
      price: parseFloat(event.price.replace("$", "").replace(" USD", "")),
      currency: "USD",
      category: "events",
      quantity: 1,
      metadata: {
        date: event.date,
        location: event.location,
        time: event.time,
        capacity: event.capacity,
        organizer: event.organizer,
        category: event.category,
        image: event.image,
      },
    };

    addToBooking(bookingItem);
    router.push("/checkout");
  };
  const eventCategories = [
    "All Events",
    "Cultural Festivals",
    "Music & Arts",
    "Food & Drink",
    "Sports",
    "Business",
    "Community",
    "Seasonal",
  ];

  const events = [
    {
      id: 1,
      title: "Harare International Festival of the Arts (HIFA)",
      description:
        "Zimbabwe's premier arts festival featuring international and local artists across multiple disciplines",
      date: "2024-05-01",
      endDate: "2024-05-06",
      time: "Various Times",
      location: "Harare Gardens, Harare",
      category: "Music & Arts",
      price: "Free - $45",
      image: "/images/hifa-festival.jpg",
      featured: true,
      capacity: "10,000+",
      organizer: "HIFA Trust",
      status: "Early Bird",
    },
    {
      id: 2,
      title: "Victoria Falls Carnival",
      description:
        "Annual street carnival with parades, music, and cultural displays",
      date: "2024-12-31",
      endDate: "2024-12-31",
      time: "6:00 PM",
      location: "Victoria Falls Town",
      category: "Cultural Festivals",
      price: "Free",
      image: "/images/vic-falls-carnival.jpg",
      featured: true,
      capacity: "5,000+",
      organizer: "Victoria Falls Municipality",
      status: "Coming Soon",
    },
    {
      id: 3,
      title: "Zimbabwe International Trade Fair",
      description:
        "Leading trade exhibition showcasing business opportunities across various sectors",
      date: "2024-04-24",
      endDate: "2024-04-28",
      time: "9:00 AM - 5:00 PM",
      location: "Zimbabwe International Exhibition Centre, Bulawayo",
      category: "Business",
      price: "$15 - $50",
      image: "/images/trade-fair.jpg",
      featured: false,
      capacity: "50,000+",
      organizer: "Zimbabwe International Trade Fair Company",
      status: "Registration Open",
    },
    {
      id: 4,
      title: "Intwasa Arts Festival",
      description:
        "Bulawayo's vibrant arts festival celebrating local and regional talent",
      date: "2024-09-26",
      endDate: "2024-09-29",
      time: "Various Times",
      location: "Various Venues, Bulawayo",
      category: "Music & Arts",
      price: "$5 - $25",
      image: "/images/intwasa-festival.jpg",
      featured: true,
      capacity: "8,000+",
      organizer: "Intwasa Arts Festival",
      status: "Early Bird",
    },
    {
      id: 5,
      title: "Lake Kariba Tiger Fishing Tournament",
      description: "Annual fishing competition on Zimbabwe's largest lake",
      date: "2024-10-15",
      endDate: "2024-10-18",
      time: "6:00 AM - 6:00 PM",
      location: "Lake Kariba",
      category: "Sports",
      price: "$100 - $300",
      image: "/images/tiger-fishing.jpg",
      featured: false,
      capacity: "500",
      organizer: "Zimbabwe Fishing Association",
      status: "Registration Open",
    },
    {
      id: 6,
      title: "Chimanimani Arts Festival",
      description:
        "Mountain arts festival showcasing traditional and contemporary arts",
      date: "2024-08-16",
      endDate: "2024-08-18",
      time: "10:00 AM - 8:00 PM",
      location: "Chimanimani, Manicaland",
      category: "Cultural Festivals",
      price: "$10 - $30",
      image: "/images/chimanimani-arts.jpg",
      featured: false,
      capacity: "2,000",
      organizer: "Chimanimani Arts Trust",
      status: "Tickets Available",
    },
    {
      id: 7,
      title: "Gweru Agricultural Show",
      description: "Annual agricultural exhibition and community gathering",
      date: "2024-08-30",
      endDate: "2024-09-01",
      time: "8:00 AM - 6:00 PM",
      location: "Gweru Showgrounds",
      category: "Community",
      price: "$5 - $15",
      image: "/images/gweru-agric-show.jpg",
      featured: false,
      capacity: "15,000+",
      organizer: "Gweru Agricultural Society",
      status: "Tickets Available",
    },
    {
      id: 8,
      title: "Matabeleland Music Festival",
      description:
        "Celebrating traditional and modern music from the Matabeleland region",
      date: "2024-11-22",
      endDate: "2024-11-24",
      time: "7:00 PM - 11:00 PM",
      location: "Various Venues, Bulawayo",
      category: "Music & Arts",
      price: "$8 - $35",
      image: "/images/matabeleland-music.jpg",
      featured: false,
      capacity: "3,000",
      organizer: "Matabeleland Arts Council",
      status: "Coming Soon",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Early Bird":
        return "bg-green-100 text-green-800";
      case "Registration Open":
        return "bg-blue-100 text-blue-800";
      case "Tickets Available":
        return "bg-purple-100 text-purple-800";
      case "Coming Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Sold Out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Events in Zimbabwe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover cultural festivals, arts events, and exciting happenings
              across the country
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="input pl-10 w-full"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" className="input pl-10" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="input pl-10 min-w-[150px]">
                <option>All Locations</option>
                <option>Harare</option>
                <option>Bulawayo</option>
                <option>Victoria Falls</option>
                <option>Gweru</option>
                <option>Mutare</option>
              </select>
            </div>

            {/* Advanced Filters */}
            <button className="btn-outline rounded-2xl flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {eventCategories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-colors ${
                  index === 0
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Events */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {events
                .filter((event) => event.featured)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                  />
                ))}
            </div>
          </div>

          {/* All Events */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">All Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-outline rounded-2xl">
              Load More Events
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss an Event
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and get notified about upcoming events
              and festivals in Zimbabwe.
            </p>
            <div className="newsletter-form max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-standard flex-1"
              />
              <button className="btn-primary rounded-2xl whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EventCard({
  event,
  formatDate,
  getStatusColor,
}: {
  event: Event;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200">
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
        >
          {event.status}
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <HeartIcon className="w-5 h-5 text-gray-600" />
        </button>
        {/* Placeholder for image */}
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-600 font-medium">Image Coming Soon</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            {event.category}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>
              {formatDate(event.date)}
              {event.endDate !== event.date &&
                ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserGroupIcon className="w-4 h-4" />
            <span>{event.capacity} capacity</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-bold text-primary">
              {event.price}
            </span>
          </div>
          <button className="btn-primary rounded-2xl">Get Tickets</button>
        </div>

        {/* Organizer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Organized by <span className="font-medium">{event.organizer}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Star, ArrowRight } from "lucide-react";

interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  image: string;
  description: string;
  price: string;
  capacity: number;
  attendees: number;
  rating: number;
  featured?: boolean;
  tags: string[];
}

const events: Event[] = [
  {
    id: 1,
    title: "Victoria Falls Music Festival",
    category: "Music & Entertainment",
    date: "2025-07-15",
    time: "18:00",
    location: "Victoria Falls",
    venue: "Victoria Falls Amphitheatre",
    image: "/images/events/music-festival.jpg",
    description:
      "Annual music festival featuring local and international artists against the backdrop of Victoria Falls.",
    price: "USD 45",
    capacity: 5000,
    attendees: 3200,
    rating: 4.8,
    featured: true,
    tags: ["Music", "Festival", "Outdoor", "Family Friendly"],
  },
  {
    id: 2,
    title: "Great Zimbabwe Heritage Day",
    category: "Cultural",
    date: "2025-06-20",
    time: "09:00",
    location: "Great Zimbabwe",
    venue: "Great Zimbabwe National Monument",
    image: "/images/events/heritage-day.jpg",
    description:
      "Celebrate Zimbabwe's rich cultural heritage with traditional performances, crafts, and storytelling.",
    price: "USD 15",
    capacity: 800,
    attendees: 450,
    rating: 4.7,
    featured: true,
    tags: ["Culture", "Heritage", "Educational", "Traditional"],
  },
  {
    id: 3,
    title: "Kariba Fishing Tournament",
    category: "Sports",
    date: "2025-08-10",
    time: "06:00",
    location: "Lake Kariba",
    venue: "Kariba Marina",
    image: "/images/events/fishing-tournament.jpg",
    description:
      "Annual tiger fishing competition on Lake Kariba with prizes for biggest catch and most fish.",
    price: "USD 75",
    capacity: 200,
    attendees: 156,
    rating: 4.6,
    tags: ["Fishing", "Competition", "Outdoor", "Prize Money"],
  },
  {
    id: 4,
    title: "Hwange Wildlife Photography Workshop",
    category: "Education",
    date: "2025-09-05",
    time: "05:30",
    location: "Hwange National Park",
    venue: "Hwange Safari Lodge",
    image: "/images/events/photography-workshop.jpg",
    description:
      "Learn wildlife photography techniques from professional photographers in Zimbabwe's premier game park.",
    price: "USD 120",
    capacity: 20,
    attendees: 18,
    rating: 4.9,
    featured: true,
    tags: ["Photography", "Wildlife", "Workshop", "Professional"],
  },
  {
    id: 5,
    title: "Matobo Rock Art Festival",
    category: "Cultural",
    date: "2025-07-28",
    time: "10:00",
    location: "Matobo Hills",
    venue: "Matobo National Park",
    image: "/images/events/rock-art-festival.jpg",
    description:
      "Explore ancient rock art and participate in contemporary art workshops inspired by Matobo's landscapes.",
    price: "USD 25",
    capacity: 300,
    attendees: 180,
    rating: 4.5,
    tags: ["Art", "History", "Workshop", "Scenic"],
  },
  {
    id: 6,
    title: "Chimanimani Mountain Challenge",
    category: "Adventure",
    date: "2025-10-12",
    time: "07:00",
    location: "Chimanimani",
    venue: "Chimanimani Mountains",
    image: "/images/events/mountain-challenge.jpg",
    description:
      "Multi-day hiking and climbing challenge through the scenic Chimanimani mountain range.",
    price: "USD 180",
    capacity: 50,
    attendees: 35,
    rating: 4.8,
    tags: ["Hiking", "Adventure", "Multi-day", "Challenge"],
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getAvailabilityStatus = (capacity: number, attendees: number) => {
  const percentage = (attendees / capacity) * 100;
  if (percentage >= 90) return { status: "Almost Full", color: "text-red-600" };
  if (percentage >= 70)
    return { status: "Filling Fast", color: "text-orange-600" };
  return { status: "Available", color: "text-green-600" };
};

export default function EventsSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const featuredEvents = events.filter((event) => event.featured);
  const upcomingEvents = events.filter((event) => !event.featured);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-off2zim-primary/5 via-white/90 to-off2zim-sunset/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-off2zim-earth mb-4">
            Upcoming Events & Experiences
          </h2>
          <p className="text-lg md:text-xl text-off2zim-earth/70 max-w-3xl mx-auto">
            Join exclusive events, festivals, and unique experiences that
            showcase Zimbabwe&apos;s vibrant culture, wildlife, and natural
            beauty.
          </p>
        </div>

        {/* Featured Events */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-off2zim-earth mb-4 md:mb-6">
            Featured Events
          </h3>
          <div
            className={`grid gap-6 md:gap-8 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {featuredEvents.map((event) => {
              const availability = getAvailabilityStatus(
                event.capacity,
                event.attendees
              );

              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-off2zim-primary/10"
                >
                  {/* Image & Date Badge */}
                  <div
                    className={`relative overflow-hidden ${
                      isMobile ? "h-48" : "h-64"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Date Badge */}
                    <div
                      className={`absolute top-4 left-4 bg-white rounded-lg text-center shadow-lg ${
                        isMobile ? "p-2" : "p-3"
                      }`}
                    >
                      <div
                        className={`font-bold text-off2zim-primary ${
                          isMobile ? "text-lg" : "text-2xl"
                        }`}
                      >
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs font-medium text-off2zim-earth/70 uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 right-4 bg-off2zim-primary text-white rounded-full px-3 py-1">
                      <span className="text-xs font-medium">
                        {event.category}
                      </span>
                    </div>

                    {/* Availability Status */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span
                        className={`text-xs font-medium ${availability.color}`}
                      >
                        {availability.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isMobile ? "p-4" : "p-6"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg md:text-xl font-bold text-off2zim-earth group-hover:text-off2zim-primary transition-colors line-clamp-2">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-1 ml-4">
                        <Star className="w-4 h-4 text-off2zim-sunset fill-current" />
                        <span className="text-sm font-medium">
                          {event.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-off2zim-earth/70 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-off2zim-earth/60">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(event.date)} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-off2zim-earth/60">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {event.venue}, {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-off2zim-earth/60">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {event.attendees}/{event.capacity} attending
                          </span>
                        </div>
                        <div className="font-bold text-off2zim-primary text-lg">
                          {event.price}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-off2zim-primary/10 text-off2zim-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="text-xs text-off2zim-earth/50">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <button className="w-full bg-off2zim-primary hover:bg-off2zim-primary/90 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 group">
                      <span className="font-medium">Book Now</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-off2zim-earth mb-4 md:mb-6">
            More Upcoming Events
          </h3>
          <div
            className={`grid gap-4 md:gap-6 ${
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {upcomingEvents.map((event) => {
              const availability = getAvailabilityStatus(
                event.capacity,
                event.attendees
              );

              return (
                <div
                  key={event.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-off2zim-primary/10 hover:border-off2zim-primary/20"
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden ${
                      isMobile ? "h-44" : "h-48"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Date */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center border border-off2zim-primary/20">
                      <div className="text-lg font-bold text-off2zim-primary">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs font-medium text-off2zim-earth uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-off2zim-sunset to-off2zim-primary text-white rounded px-2 py-1">
                      <span className="text-sm font-medium">{event.price}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isMobile ? "p-4" : "p-4"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-off2zim-earth group-hover:text-off2zim-primary transition-colors line-clamp-2">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-off2zim-sunset fill-current" />
                        <span className="text-xs text-off2zim-earth">
                          {event.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-off2zim-earth/60 mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{event.time}</span>
                      <span className="mx-2">•</span>
                      <span className={availability.color}>
                        {availability.status}
                      </span>
                    </div>

                    <div className="flex items-center text-xs text-off2zim-earth/60 mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-off2zim-primary/10 text-off2zim-primary px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full text-off2zim-primary hover:bg-gradient-to-r hover:from-off2zim-primary hover:to-off2zim-earth hover:text-white border border-off2zim-primary py-2 px-3 rounded text-sm transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8 md:mt-12">
          <button className="bg-gradient-to-r from-off2zim-primary to-off2zim-earth text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-2">
            <span>View All Events</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

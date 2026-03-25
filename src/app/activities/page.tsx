"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";
import {
  Clock3,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";

interface Activity {
  id: number;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  difficulty: string;
  groupSize: string;
  featured: boolean;
  highlights: string[];
}

const activityCategories = [
  "All",
  "Adventure",
  "Wildlife",
  "Culture",
  "Water",
  "Food",
  "Family",
];

const activities: Activity[] = [
  {
    id: 1,
    title: "Victoria Falls from Above",
    description:
      "A premium scenic experience built around aerial views, drama, and high-value memory making.",
    location: "Victoria Falls",
    duration: "15 minutes",
    price: "$165",
    category: "Adventure",
    rating: 4.9,
    reviews: 1247,
    image: "/images/victoria-falls.jpg",
    difficulty: "Easy",
    groupSize: "1-6 people",
    featured: true,
    highlights: ["Aerial views", "Photography", "Professional crew"],
  },
  {
    id: 2,
    title: "White Water Rafting",
    description:
      "A bolder, adrenaline-led card for travelers looking for intensity on the Zambezi.",
    location: "Victoria Falls",
    duration: "Full day",
    price: "$135",
    category: "Adventure",
    rating: 4.8,
    reviews: 892,
    image: "/images/rafting.jpg",
    difficulty: "Challenging",
    groupSize: "6-12 people",
    featured: true,
    highlights: ["Rapids", "Lunch included", "Safety crew"],
  },
  {
    id: 3,
    title: "Mana Pools Canoe Safari",
    description:
      "Story-rich wilderness paddling with a slower, more immersive wildlife rhythm.",
    location: "Mana Pools",
    duration: "2-3 days",
    price: "$285",
    category: "Wildlife",
    rating: 4.9,
    reviews: 178,
    image: "/images/canoeing.jpg",
    difficulty: "Moderate",
    groupSize: "4-8 people",
    featured: true,
    highlights: ["Camping", "Guided", "Wildlife encounters"],
  },
  {
    id: 4,
    title: "Great Zimbabwe Heritage Tour",
    description:
      "A cultural route focused on architecture, origin stories, and national identity.",
    location: "Masvingo",
    duration: "4 hours",
    price: "$45",
    category: "Culture",
    rating: 4.6,
    reviews: 234,
    image: "/images/great-zimbabwe.jpg",
    difficulty: "Easy",
    groupSize: "8-15 people",
    featured: false,
    highlights: ["UNESCO site", "Guide", "History"],
  },
  {
    id: 5,
    title: "Kariba Sunset Cruise",
    description:
      "A softer luxury-water product with atmosphere, wildlife, and sunset photography appeal.",
    location: "Lake Kariba",
    duration: "3 hours",
    price: "$75",
    category: "Water",
    rating: 4.7,
    reviews: 445,
    image: "/images/kariba.jpg",
    difficulty: "Easy",
    groupSize: "10-20 people",
    featured: false,
    highlights: ["Wildlife", "Drinks", "Snacks"],
  },
  {
    id: 6,
    title: "Eastern Highlands Ride",
    description:
      "A scenic active-day option for travelers who want fresh air and mountain texture.",
    location: "Nyanga",
    duration: "6 hours",
    price: "$65",
    category: "Adventure",
    rating: 4.5,
    reviews: 312,
    image: "/images/nyanga bike.webp",
    difficulty: "Moderate",
    groupSize: "6-12 people",
    featured: false,
    highlights: ["Views", "Waterfalls", "Guide"],
  },
];

function difficultyClasses(level: string) {
  if (level === "Easy") return "bg-[#183321] text-[#91f1a6]";
  if (level === "Moderate") return "bg-[#332913] text-[#ffd17b]";
  if (level === "Challenging") return "bg-[#351e1b] text-[#ff9d8e]";
  return "bg-black/[0.05] text-slate-600 dark:bg-white/10 dark:text-white/70";
}

export default function ActivitiesPage() {
  const router = useRouter();
  const { addToBooking, currentBooking, getItemCount } = usePayment();

  const handleBookActivity = (activity: Activity) => {
    const bookingItem: BookingItem = {
      id: `activity-${activity.id}`,
      type: "activity",
      name: activity.title,
      description: activity.description,
      price: parseFloat(activity.price.replace("$", "")),
      currency: "USD",
      quantity: 1,
      metadata: {
        location: activity.location,
        duration: activity.duration,
        difficulty: activity.difficulty,
        groupSize: activity.groupSize,
        category: activity.category,
        rating: activity.rating,
        reviews: activity.reviews,
        highlights: activity.highlights,
      },
    };

    addToBooking(bookingItem);
    router.push("/checkout");
  };

  const featured = activities.filter((activity) => activity.featured);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1fr_1fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Things to do
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Book Zimbabwe experiences with more mood and more clarity
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                This browse page now feels closer to the app: darker surfaces,
                stronger imagery, tighter cards, and clearer signals for price,
                group size, difficulty, and booking intent.
              </p>
            </div>
            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/rafting.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      {currentBooking && currentBooking.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#ff5630]/20 bg-[#fff4ef] px-5 py-4 dark:bg-[#19110f]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-700 dark:text-white/80">
                {getItemCount()} item{getItemCount() !== 1 ? "s" : ""} ready for checkout
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="rounded-full bg-[#ff5630] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#ff6d4d]"
              >
                View cart and checkout
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[32px] p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))_auto]">
            <div className="relative">
              <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search experiences"
                className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
            <select className="theme-input rounded-2xl px-4 py-3 text-sm">
              <option>All locations</option>
              <option>Victoria Falls</option>
              <option>Hwange</option>
              <option>Mana Pools</option>
            </select>
            <select className="theme-input rounded-2xl px-4 py-3 text-sm">
              <option>Any duration</option>
              <option>Under 2 hours</option>
              <option>Half day</option>
              <option>Full day</option>
            </select>
            <select className="theme-input rounded-2xl px-4 py-3 text-sm">
              <option>Any price</option>
              <option>Under $50</option>
              <option>$50 - $100</option>
              <option>$100+</option>
            </select>
            <button className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activityCategories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-white text-black"
                  : "theme-chip hover:bg-black/[0.07] dark:hover:bg-white/[0.08]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="theme-label text-sm uppercase tracking-[0.28em]">
            Featured experiences
          </p>
          <h2 className="theme-heading mt-2 text-3xl font-semibold">
            High-conviction activities first
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onBookActivity={handleBookActivity}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="theme-label text-sm uppercase tracking-[0.28em]">
            Browse all
          </p>
          <h2 className="theme-heading mt-2 text-3xl font-semibold">
            Clearer activity cards for decision-making on mobile and web
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onBookActivity={handleBookActivity}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityCard({
  activity,
  onBookActivity,
}: {
  activity: Activity;
  onBookActivity: (activity: Activity) => void;
}) {
  return (
    <article className="theme-card overflow-hidden">
      <div
        className="relative h-60 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.38)), url('${activity.image}')`,
        }}
      >
        <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${difficultyClasses(activity.difficulty)}`}>
          {activity.difficulty}
        </div>
        <button className="absolute right-4 top-4 rounded-full bg-[#111111]/85 p-3 text-white/75 backdrop-blur">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="theme-label text-xs uppercase tracking-[0.24em]">
              {activity.category}
            </p>
            <h3 className="theme-heading mt-2 text-2xl font-semibold">
              {activity.title}
            </h3>
          </div>
          <div className="theme-chip inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm">
            <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
            {activity.rating}
          </div>
        </div>

        <p className="theme-muted mt-4 text-sm leading-6">
          {activity.description}
        </p>

        <div className="theme-muted mt-4 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#ff7352]" />
            {activity.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#5aa7ff]" />
            {activity.duration}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-[#7ddf8c]" />
            {activity.groupSize}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {activity.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="theme-chip rounded-full px-3 py-2 text-xs"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className="theme-heading text-3xl font-bold">{activity.price}</span>
            <span className="theme-subtle ml-1 text-sm">per person</span>
            <p className="theme-subtle mt-1 text-xs">{activity.reviews} reviews</p>
          </div>
          <button
            onClick={() => onBookActivity(activity)}
            className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6e4d]"
          >
            Book now
          </button>
        </div>
      </div>
    </article>
  );
}

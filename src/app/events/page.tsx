"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";

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

const events: Event[] = [
  {
    id: 1,
    title: "Harare International Festival of the Arts",
    description:
      "A flagship arts moment bringing music, theatre, food, and international creativity into one city-wide program.",
    date: "2026-05-01",
    endDate: "2026-05-06",
    time: "Various times",
    location: "Harare",
    category: "Arts & Culture",
    price: "$15 - $45",
    image: "/images/jacaranda.JPG",
    featured: true,
    capacity: "10,000+",
    organizer: "HIFA Trust",
    status: "Early access",
  },
  {
    id: 2,
    title: "Victoria Falls Carnival",
    description:
      "A destination-scale celebration with street energy, music, and year-end atmosphere in one of Zimbabwe's best-known places.",
    date: "2026-12-31",
    endDate: "2026-12-31",
    time: "18:00",
    location: "Victoria Falls",
    category: "Festival",
    price: "$20 - $60",
    image: "/images/victoria-falls.jpg",
    featured: true,
    capacity: "5,000+",
    organizer: "Victoria Falls Events",
    status: "Coming soon",
  },
  {
    id: 3,
    title: "Zimbabwe International Trade Fair",
    description:
      "A major business and exhibition calendar anchor for travelers combining meetings, networking, and city stays.",
    date: "2026-04-24",
    endDate: "2026-04-28",
    time: "09:00 - 17:00",
    location: "Bulawayo",
    category: "Business",
    price: "$15 - $50",
    image: "/images/bulawayo.jpg",
    featured: false,
    capacity: "50,000+",
    organizer: "ZITF",
    status: "Registration open",
  },
  {
    id: 4,
    title: "Intwasa Arts Festival",
    description:
      "A strong regional arts program that pairs well with Bulawayo cultural stays and city discovery.",
    date: "2026-09-26",
    endDate: "2026-09-29",
    time: "Various times",
    location: "Bulawayo",
    category: "Arts & Culture",
    price: "$8 - $25",
    image: "/images/bulawayo.jpg",
    featured: true,
    capacity: "8,000+",
    organizer: "Intwasa Arts",
    status: "Early access",
  },
  {
    id: 5,
    title: "Lake Kariba Tiger Fishing Tournament",
    description:
      "A multi-day sports event that works well for group itineraries, stays, and lakeside transport planning.",
    date: "2026-10-15",
    endDate: "2026-10-18",
    time: "06:00 - 18:00",
    location: "Kariba",
    category: "Sport",
    price: "$100 - $300",
    image: "/images/eastern-highlands.jpg",
    featured: false,
    capacity: "500",
    organizer: "Zimbabwe Fishing Association",
    status: "Tickets available",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const router = useRouter();
  const { addToBooking } = usePayment();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLocation, setActiveLocation] = useState("All");

  const categories = ["All", ...Array.from(new Set(events.map((event) => event.category)))];
  const locations = ["All", ...Array.from(new Set(events.map((event) => event.location)))];

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = activeCategory === "All" || event.category === activeCategory;
      const matchesLocation = activeLocation === "All" || event.location === activeLocation;
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term);
      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [activeCategory, activeLocation, search]);

  const featured = filteredEvents.filter((event) => event.featured);

  const handleBookEvent = (event: Event) => {
    const priceValue = Number(event.price.replace(/[^0-9.]/g, "")) || 0;
    const bookingItem: BookingItem = {
      id: `event_${event.id}`,
      type: "activity",
      name: event.title,
      description: event.description,
      price: priceValue,
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

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Events
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Find the moments that give the itinerary its energy
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Off2Zim events should help travelers discover what is happening,
                understand whether it fits their route, and move into booking or
                itinerary planning without losing context.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <div className="relative">
                  <MagnifyingGlassIcon className="theme-subtle absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="theme-input h-12 w-full rounded-[18px] pl-12 pr-4"
                    placeholder="Search by event, city, or vibe"
                  />
                </div>
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                  className="theme-input h-12 rounded-[18px] px-4"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={activeLocation}
                  onChange={(event) => setActiveLocation(event.target.value)}
                  className="theme-input h-12 rounded-[18px] px-4"
                >
                  {locations.map((location) => (
                    <option key={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
              }}
            >
              <div className="flex h-full items-end p-5 md:p-7">
                <div className="w-full rounded-[28px] border border-white/15 bg-black/40 p-4 text-white backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Event rhythm
                  </div>
                  <div className="mt-2 text-xl font-semibold">
                    Festivals, business, and culture across key stops
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-[#ffca74]" />
                      Featured moments
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-[#ff7352]" />
                      Route-aware discovery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[30px] p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-label text-xs uppercase tracking-[0.24em]">Featured</p>
              <h2 className="theme-heading mt-2 text-2xl font-semibold">
                Event picks with the strongest travel pull
              </h2>
            </div>
            <div className="theme-chip rounded-full px-4 py-2 text-sm">
              {featured.length} highlighted
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {(featured.length ? featured : filteredEvents).map((event) => (
              <EventCard key={`featured-${event.id}`} event={event} onBook={handleBookEvent} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[30px] p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-label text-xs uppercase tracking-[0.24em]">Explore more</p>
              <h2 className="theme-heading mt-2 text-2xl font-semibold">
                Build the itinerary around what is actually happening
              </h2>
            </div>
            <div className="theme-muted text-sm">{filteredEvents.length} results</div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onBook={handleBookEvent} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({
  event,
  onBook,
}: {
  event: Event;
  onBook: (event: Event) => void;
}) {
  return (
    <article className="theme-card overflow-hidden">
      <div
        className="relative min-h-[240px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55)), url('${event.image}')`,
        }}
      >
        <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {event.status}
        </div>
        <button className="absolute right-4 top-4 rounded-full bg-black/45 p-3 text-white backdrop-blur">
          <HeartIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="theme-label text-xs uppercase tracking-[0.24em]">{event.category}</div>
        <h3 className="theme-heading mt-2 text-xl font-semibold">{event.title}</h3>
        <p className="theme-muted mt-3 text-sm leading-6">{event.description}</p>

        <div className="theme-muted mt-4 space-y-2 text-sm">
          <div className="inline-flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4 text-[#ff7352]" />
            {formatDate(event.date)}
            {event.endDate !== event.date ? ` to ${formatDate(event.endDate)}` : ""}
          </div>
          <div className="inline-flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-[#5aa7ff]" />
            {event.time}
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-[#ff7352]" />
            {event.location}
          </div>
          <div className="inline-flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4 text-[#8cf0a1]" />
            {event.capacity} capacity
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-[#ffca74]" />
            <span className="theme-heading text-lg font-semibold">{event.price}</span>
          </div>
          <button
            onClick={() => onBook(event)}
            className="rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Book event
          </button>
        </div>

        <div className="theme-muted mt-4 border-t border-black/10 pt-4 text-xs dark:border-white/10">
          Hosted by {event.organizer}
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import FavoriteButton from "@/components/ui/FavoriteButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { MapPin, Search, SlidersHorizontal, Star, Users, Wifi } from "lucide-react";

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  price: string;
  priceUnit: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  description: string;
  maxGuests: number;
  featured: boolean;
  availability: string;
}

const accommodationTypes = [
  "All",
  "Safari Lodges",
  "City Hotels",
  "Houseboats",
  "Boutique Stays",
  "Luxury",
  "Family Friendly",
];

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const accommodations: Accommodation[] = [
  {
    id: 1,
    name: "Palm River Hotel",
    type: "Luxury Hotel",
    location: "Victoria Falls",
    price: "$320",
    priceUnit: "/night",
    rating: 4.9,
    reviews: 1567,
    image: "/images/palm-river-hotel-604329-original.jpg",
    amenities: ["WiFi", "Pool", "Spa", "Transfers"],
    description: "Riverfront luxury with polished service and a serene Falls-side atmosphere.",
    maxGuests: 4,
    featured: true,
    availability: "Verified",
  },
  {
    id: 2,
    name: "Old Drift Lodge",
    type: "Safari Lodge",
    location: "Victoria Falls",
    price: "$450",
    priceUnit: "/night",
    rating: 4.8,
    reviews: 932,
    image: "/images/old-drift.jpg",
    amenities: ["Game Drives", "All Meals", "Pool", "WiFi"],
    description: "A cinematic bush-and-river stay designed for premium wildlife escapes.",
    maxGuests: 3,
    featured: true,
    availability: "Filling Fast",
  },
  {
    id: 3,
    name: "Somalisa Camp",
    type: "Safari Camp",
    location: "Hwange",
    price: "$385",
    priceUnit: "/night",
    rating: 4.9,
    reviews: 511,
    image: "/images/african-bush-camps-somalisa-camp-604482-original.jpg",
    amenities: ["Safari", "Dining", "Pool", "Guides"],
    description: "Immersive wildlife accommodation for travelers chasing iconic Hwange moments.",
    maxGuests: 2,
    featured: true,
    availability: "Verified",
  },
  {
    id: 4,
    name: "Ivory Lodge",
    type: "Boutique Stay",
    location: "Binga",
    price: "$180",
    priceUnit: "/night",
    rating: 4.6,
    reviews: 278,
    image: "/images/ivoryLodge.jpg",
    amenities: ["Lake Views", "Restaurant", "WiFi", "Bar"],
    description: "Relaxed lakeside comfort with warm local hospitality and sunset character.",
    maxGuests: 4,
    featured: false,
    availability: "Available",
  },
  {
    id: 5,
    name: "Safari Camp Retreat",
    type: "Bush Camp",
    location: "Mana Pools",
    price: "$290",
    priceUnit: "/night",
    rating: 4.7,
    reviews: 344,
    image: "/images/safariCamp1.jpg",
    amenities: ["Guided Walks", "Dining", "River Access", "Firepit"],
    description: "Quiet, story-rich accommodation made for travelers who want nature up close.",
    maxGuests: 2,
    featured: false,
    availability: "Limited",
  },
  {
    id: 6,
    name: "Bush Camps Collection",
    type: "Curated Collection",
    location: "Zimbabwe Circuit",
    price: "$210",
    priceUnit: "/night",
    rating: 4.5,
    reviews: 189,
    image: "/images/bush-camps.jpg",
    amenities: ["Multi-stop", "Curated", "Local Support", "Flexible"],
    description: "A curated set of camp stays for multi-destination itineraries across Zimbabwe.",
    maxGuests: 4,
    featured: false,
    availability: "Available",
  },
];

function statusClasses(status: string) {
  if (status === "Verified") return "bg-[#193321] text-[#8cf0a1]";
  if (status === "Filling Fast") return "bg-[#332513] text-[#ffca74]";
  if (status === "Limited") return "bg-[#35201e] text-[#ff8a78]";
  return "bg-black/[0.05] text-slate-600 dark:bg-white/10 dark:text-white/70";
}

export default function AccommodationPage() {
  const featured = accommodations.filter((item) => item.featured);

  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Stays
              </div>
              <h1 className="theme-heading mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                Where you stay shapes how the trip feels
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                From Victoria Falls riverfront lodges to Hwange safari camps and
                Kariba houseboats — every stay is verified, placed on the right
                route, and ready to add straight to your itinerary.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="theme-panel-soft rounded-[24px] p-4">
                  <div className="theme-heading text-2xl font-bold">150+</div>
                  <div className="theme-subtle mt-1 text-sm">Verified stays</div>
                </div>
                <div className="theme-panel-soft rounded-[24px] p-4">
                  <div className="theme-heading text-2xl font-bold">8</div>
                  <div className="theme-subtle mt-1 text-sm">Destinations covered</div>
                </div>
                <div className="theme-panel-soft rounded-[24px] p-4">
                  <div className="theme-heading text-2xl font-bold">Free</div>
                  <div className="theme-subtle mt-1 text-sm">Cancellation on most stays</div>
                </div>
                <div className="theme-panel-soft rounded-[24px] p-4">
                  <div className="theme-heading text-2xl font-bold">4.7★</div>
                  <div className="theme-subtle mt-1 text-sm">Average guest rating</div>
                </div>
              </div>
            </div>

            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url('/images/palm-river-hotel-604329-original.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Stays" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[32px] p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr_1fr_0.85fr_auto]">
            <div className="relative">
              <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destination or property"
                className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
            <input
              type="date"
              className="theme-input rounded-2xl px-4 py-3 text-sm"
            />
            <input
              type="date"
              className="theme-input rounded-2xl px-4 py-3 text-sm"
            />
            <select className="theme-input rounded-2xl px-4 py-3 text-sm">
              <option>2 Guests</option>
              <option>1 Guest</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
            <button className="rounded-2xl bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6e4d]">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {accommodationTypes.map((type, index) => (
              <button
                key={type}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  index === 0
                    ? "bg-white text-black"
                    : "theme-chip hover:bg-black/[0.07] dark:hover:bg-white/[0.08]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select className="theme-chip rounded-full px-4 py-2 text-sm">
              <option>Featured first</option>
              <option>Price low to high</option>
              <option>Top rated</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured stays"
          title="Strong first options for high-intent travelers"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((accommodation) => (
            <article
              key={accommodation.id}
              className="theme-card overflow-hidden"
            >
              <div
                className="relative h-72 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.65)), url('${accommodation.image}')`,
                }}
              >
                <div className={`absolute left-4 top-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses(accommodation.availability)}`}>
                  {accommodation.availability}
                </div>
                <FavoriteButton
                  itemId={`stay-${accommodation.id}`}
                  itemType="stay"
                  className="absolute right-4 top-4 rounded-full bg-[#111111]/85 p-3 text-white/75 backdrop-blur"
                  iconClassName="h-4 w-4"
                />

                <div className="absolute inset-x-4 bottom-4 rounded-[24px] bg-black/35 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/55">{accommodation.type}</p>
                      <h3 className="text-2xl font-semibold text-white">
                        {accommodation.name}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm text-white">
                      <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                      {accommodation.rating}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="All properties"
          title="Browse Zimbabwe stays by vibe, location, and confidence"
        />

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {accommodations.map((accommodation) => (
            <article
              key={accommodation.id}
              className="theme-card overflow-hidden"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.28)), url('${accommodation.image}')`,
                }}
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="theme-label text-xs uppercase tracking-[0.24em]">
                      {accommodation.type}
                    </p>
                    <h3 className="theme-heading mt-2 text-2xl font-semibold">
                      {accommodation.name}
                    </h3>
                  </div>
                  <FavoriteButton
                    itemId={`stay-${accommodation.id}`}
                    itemType="stay"
                    className="theme-button-secondary rounded-full p-3"
                    iconClassName="h-4 w-4"
                  />
                </div>

                <div className="theme-muted mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ff7352]" />
                    {accommodation.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#5aa7ff]" />
                    Up to {accommodation.maxGuests}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                    {accommodation.rating} ({accommodation.reviews})
                  </span>
                </div>

                <p className="theme-muted mt-4 text-sm leading-6">
                  {accommodation.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {accommodation.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="theme-chip inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs"
                    >
                      {amenity === "WiFi" && <Wifi className="h-3 w-3" />}
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="theme-heading text-3xl font-bold">
                      {accommodation.price}
                    </span>
                    <span className="theme-subtle ml-1 text-sm">
                      {accommodation.priceUnit}
                    </span>
                  </div>
                  <Link href={`/accommodation/${toSlug(accommodation.name)}`} className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6e4d]">
                    View stay
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock3, Globe2,
  MapPin, SunMedium, Telescope, Camera,
} from "lucide-react";

const destinations = [
  {
    slug: "victoria-falls",
    name: "Victoria Falls",
    meta: "Adventure capital",
    description: "Victoria Falls is one of the world's most spectacular natural wonders — a curtain of mist and thunder that marks the border between Zimbabwe and Zambia. Known as 'Mosi-oa-Tunya' (The Smoke that Thunders), it draws travelers from across the globe for helicopter flights, white-water rafting, bungee jumping, sunset cruises on the Zambezi, and iconic safari lodges.",
    bestTime: "May – October",
    climate: "Subtropical",
    temperature: "18–28°C",
    image: "/images/victoria-falls.jpg",
    gallery: ["/images/victoria-falls.jpg", "/images/old-drift.jpg"],
    highlights: ["Devil's Pool", "Bridge Bungee Jump", "Helicopter Flights", "Sunset Cruises", "White-water Rafting", "Elephant Sanctuary"],
    practicalInfo: [
      { label: "Getting there", value: "Domestic flights from Harare (1hr) or Bulawayo (45min). Road from Bulawayo: 3–4hrs." },
      { label: "Currency", value: "USD widely accepted. Carry small notes for local purchases." },
      { label: "Visa", value: "KAZA Uni-Visa available for dual entry Zimbabwe/Zambia." },
      { label: "Best base", value: "Stay in Victoria Falls town for easy access to all activities." },
    ],
    activities: [
      { name: "Helicopter flight", duration: "15 min", price: "From $165", link: "/activities" },
      { name: "Sunset river cruise", duration: "3 hrs", price: "From $65", link: "/restaurants" },
      { name: "White-water rafting", duration: "Full day", price: "From $120", link: "/activities" },
      { name: "Safari lodge stay", duration: "Per night", price: "From $320", link: "/accommodation" },
    ],
  },
  {
    slug: "hwange-national-park",
    name: "Hwange National Park",
    meta: "Safari classic",
    description: "Hwange is Zimbabwe's largest national park and one of Africa's premier wildlife destinations. With an estimated 40,000 elephants — among the highest concentration anywhere on the continent — alongside lions, leopards, wild dogs, and over 400 bird species, Hwange delivers a safari experience that competes with the best in the world. The dry season (April–October) is the optimal window for game viewing, when animals congregate around water holes.",
    bestTime: "April – October",
    climate: "Semi-arid",
    temperature: "15–32°C",
    image: "/images/hwange.jpg",
    gallery: ["/images/hwange.jpg", "/images/african-bush-camps-somalisa-camp-604482-original.jpg"],
    highlights: ["40,000 Elephants", "Big Five", "Game Drives", "Bird Watching", "Wild Dog Territory", "Night Safaris"],
    practicalInfo: [
      { label: "Getting there", value: "Fly to Hwange Airport or drive from Victoria Falls (2hrs) or Bulawayo (3hrs)." },
      { label: "Accommodation", value: "Luxury lodges, tented camps, and NP campsites available." },
      { label: "Best season", value: "Aug–Oct for maximum wildlife concentration at water holes." },
      { label: "Guides", value: "Professional guides required for walking safaris." },
    ],
    activities: [
      { name: "Game drive safari", duration: "Half day", price: "From $85", link: "/activities" },
      { name: "Walking safari", duration: "3–4 hrs", price: "From $95", link: "/activities" },
      { name: "Bush camp stay", duration: "Per night", price: "From $290", link: "/accommodation" },
      { name: "Night drive", duration: "3 hrs", price: "From $65", link: "/activities" },
    ],
  },
  {
    slug: "great-zimbabwe",
    name: "Great Zimbabwe",
    meta: "Culture & history",
    description: "Great Zimbabwe is the largest ancient stone structure south of the Sahara and the site that gave Zimbabwe its name. Built between the 11th and 15th centuries by the ancestors of the Shona people, this UNESCO World Heritage Site reveals a sophisticated Iron Age civilization that controlled a vast trade network stretching to China and India. The ruins are divided into three sections — the Hill Complex, the Valley Ruins, and the Great Enclosure — each offering a different perspective on this remarkable kingdom.",
    bestTime: "April – September",
    climate: "Temperate",
    temperature: "12–25°C",
    image: "/images/great-zimbabwe.jpg",
    gallery: ["/images/great-zimbabwe.jpg"],
    highlights: ["Stone Ruins", "UNESCO Heritage Site", "National Museum", "Local Craft Markets", "Hill Complex", "Great Enclosure"],
    practicalInfo: [
      { label: "Location", value: "30km from Masvingo — easily reached by road from Harare (4hrs) or Bulawayo (3hrs)." },
      { label: "Entry", value: "National Park fees apply. Guided tours available at the site." },
      { label: "Combine with", value: "Pair with Lake Mutirikwi for a fuller Masvingo experience." },
      { label: "Best time", value: "Cooler months (May–Aug) are most comfortable for exploring the ruins." },
    ],
    activities: [
      { name: "Guided ruins tour", duration: "2–3 hrs", price: "From $15", link: "/activities" },
      { name: "Museum visit", duration: "1–2 hrs", price: "From $8", link: "/activities" },
      { name: "Cultural experience", duration: "Half day", price: "From $35", link: "/activities" },
      { name: "Lake Mutirikwi cruise", duration: "2 hrs", price: "From $45", link: "/activities" },
    ],
  },
  {
    slug: "eastern-highlands",
    name: "Eastern Highlands",
    meta: "Scenic escape",
    description: "The Eastern Highlands stretch along Zimbabwe's eastern border with Mozambique — a cool, misty mountain landscape of waterfalls, tea estates, forest trails, and scenic drives that feels entirely different from the rest of the country. Nyanga, Vumba, and Chimanimani each have distinct characters: Nyanga for mountains and trout fishing, Vumba for lush botanical gardens and boutique stays, and Chimanimani for serious hiking and wilderness adventure.",
    bestTime: "March – November",
    climate: "Temperate / Highland",
    temperature: "10–22°C",
    image: "/images/destinations/eastern-highlands.jpg",
    gallery: ["/images/destinations/eastern-highlands.jpg"],
    highlights: ["Mountain Hiking", "Waterfalls", "Tea Estates", "Vumba Gardens", "Trout Fishing", "Cool Weather"],
    practicalInfo: [
      { label: "Getting there", value: "Drive from Harare to Nyanga (3hrs) or Mutare (3hrs). Road trips from Bulawayo (5hrs)." },
      { label: "Best months", value: "March–May and Aug–Nov. Avoid heaviest rains (Dec–Feb)." },
      { label: "Key stops", value: "Nyanga, Vumba, Chimanimani — each worth a separate night." },
      { label: "Activities", value: "Hiking, fly-fishing, botanical gardens, waterfall walks, scenic drives." },
    ],
    activities: [
      { name: "Mountain hiking", duration: "Full day", price: "From $35", link: "/activities" },
      { name: "Tea estate visit", duration: "3 hrs", price: "From $20", link: "/activities" },
      { name: "Waterfall trek", duration: "Half day", price: "From $25", link: "/activities" },
      { name: "Boutique lodge stay", duration: "Per night", price: "From $180", link: "/accommodation" },
    ],
  },
];

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dest = destinations.find((d) => d.slug === slug);

  if (!dest) {
    return (
      <div className="theme-page min-h-screen flex items-center justify-center px-4">
        <div className="theme-panel rounded-[32px] p-10 text-center max-w-md">
          <h1 className="theme-heading text-2xl font-semibold">Destination not found</h1>
          <p className="theme-muted mt-2 text-sm">This destination page doesn't exist.</p>
          <Link href="/travel-guide" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Travel guide
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen pb-20">
      {/* Hero */}
      <div
        className="relative h-[420px] sm:h-[520px] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${dest.image}')` }}
      >
        <div className="absolute top-6 left-6">
          <Link href="/travel-guide" className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:bg-black/55 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Travel guide
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff5630]/90 px-3 py-1.5 text-xs font-medium text-white mb-3">
              <Camera className="h-3.5 w-3.5" /> {dest.meta}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">{dest.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75">
              <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#4ade80]" />Best: {dest.bestTime}</span>
              <span className="flex items-center gap-1.5"><SunMedium className="h-4 w-4 text-[#ffc247]" />{dest.climate} · {dest.temperature}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#ff7352]" />Zimbabwe</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Left */}
          <div className="space-y-6">
            {/* About */}
            <div className="theme-panel rounded-[28px] p-6">
              <h2 className="theme-heading text-xl font-semibold mb-3">About {dest.name}</h2>
              <p className="theme-muted text-sm leading-7">{dest.description}</p>
            </div>

            {/* Highlights */}
            <div className="theme-panel rounded-[28px] p-6">
              <h2 className="theme-heading text-xl font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {dest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                    <Telescope className="h-4 w-4 shrink-0 text-[#ff7352]" />
                    <span className="theme-muted text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical info */}
            <div className="theme-panel rounded-[28px] p-6">
              <h2 className="theme-heading text-xl font-semibold mb-4">Practical information</h2>
              <div className="space-y-3">
                {dest.practicalInfo.map(({ label, value }) => (
                  <div key={label} className="flex gap-3 rounded-[14px] bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#4ade80]" />
                    <div>
                      <p className="theme-heading text-sm font-medium">{label}</p>
                      <p className="theme-muted text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="theme-panel rounded-[28px] p-6">
              <h2 className="theme-heading text-xl font-semibold mb-4">Things to do</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {dest.activities.map((act) => (
                  <Link key={act.name} href={act.link}
                    className="group flex items-center justify-between rounded-[16px] border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 hover:border-[#ff5630]/30 hover:bg-[#ff5630]/[0.05] transition-colors">
                    <div>
                      <p className="theme-heading text-sm font-medium">{act.name}</p>
                      <p className="theme-subtle text-xs mt-0.5">{act.duration} · {act.price}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#ff5630] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="theme-panel rounded-[24px] p-5">
              <h3 className="theme-heading font-semibold mb-4">Plan your visit</h3>
              <div className="space-y-3">
                <Link href="/marketplace" className="flex items-center justify-between rounded-[14px] bg-[#ff5630] px-4 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors">
                  Browse stays near {dest.name.split(" ")[0]}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/activities" className="theme-button-secondary flex items-center justify-between rounded-[14px] px-4 py-3 text-sm font-semibold">
                  Explore activities
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/trip-planner" className="theme-button-secondary flex items-center justify-between rounded-[14px] px-4 py-3 text-sm font-semibold">
                  Add to trip planner
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/community-guides" className="theme-button-secondary flex items-center justify-between rounded-[14px] px-4 py-3 text-sm font-semibold">
                  <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />Ask a local guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="theme-panel rounded-[24px] p-5">
              <h3 className="theme-heading font-semibold mb-3">Quick facts</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Best time", value: dest.bestTime },
                  { label: "Climate", value: dest.climate },
                  { label: "Temperature", value: dest.temperature },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="theme-subtle">{label}</span>
                    <span className="theme-heading font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CalendarDays, MapPin, Sparkles, Tag } from "lucide-react";

const specials = [
  {
    id: 1,
    title: "Victoria Falls Adventure Package",
    description:
      "A tighter multi-day route that combines aerial views, water activity, and a strong destination stay.",
    originalPrice: "$899",
    specialPrice: "$649",
    discount: "28%",
    image: "/images/victoria-falls.jpg",
    location: "Victoria Falls",
    duration: "3 days",
    features: ["Helicopter ride", "Rafting", "Sunset cruise", "Hotel included"],
  },
  {
    id: 2,
    title: "Hwange Safari Experience",
    description:
      "A wildlife-focused package built for travelers who want game drives, pacing, and lodge comfort in one booking.",
    originalPrice: "$1,299",
    specialPrice: "$899",
    discount: "31%",
    image: "/images/hwange-bush-camp-548548-original.jpg",
    location: "Hwange",
    duration: "4 days",
    features: ["Game drives", "Bush walks", "All meals", "Guide included"],
  },
  {
    id: 3,
    title: "Eastern Highlands Retreat",
    description:
      "A scenic mountain reset with softer pacing, lodge atmosphere, and outdoors-led time.",
    originalPrice: "$699",
    specialPrice: "$499",
    discount: "29%",
    image: "/images/eastern-highlands.jpg",
    location: "Nyanga",
    duration: "5 days",
    features: ["Hiking", "Fishing", "Scenic views", "Lodge stay"],
  },
];

export default function SpecialsPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Specials
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Limited offers built around real travel routes
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Specials should do more than slash a price. They should package
                destination logic, timing, and value in a way that helps travelers
                move faster from interest to decision.
              </p>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {specials.map((special) => (
            <article key={special.id} className="theme-card overflow-hidden">
              <div
                className="min-h-[220px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48)), url('${special.image}')`,
                }}
              >
                <div className="p-4">
                  <div className="inline-flex rounded-full bg-[#ff5630] px-3 py-1 text-sm font-semibold text-white">
                    -{special.discount}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h2 className="theme-heading text-xl font-semibold">{special.title}</h2>
                <p className="theme-muted mt-3 text-sm leading-6">{special.description}</p>

                <div className="theme-muted mt-4 flex flex-wrap gap-4 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ff7352]" />
                    {special.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#5aa7ff]" />
                    {special.duration}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {special.features.map((feature) => (
                    <span key={feature} className="theme-chip rounded-full px-3 py-1.5 text-sm">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="theme-muted text-sm line-through">{special.originalPrice}</div>
                    <div className="theme-heading text-2xl font-semibold">{special.specialPrice}</div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white">
                    <Tag className="h-4 w-4" />
                    Book special
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

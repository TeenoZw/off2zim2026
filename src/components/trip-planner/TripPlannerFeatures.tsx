"use client";

import {
  CheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function TripPlannerFeatures() {
  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-[#5aa7ff]" />,
      title: "Community-centric planning",
      description:
        "Bring verified local recommendations into the same place where you organize your route.",
      benefits: [
        "Ask locals for better sequencing",
        "Find hidden gems with context",
        "Blend logistics with real insight",
      ],
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-[#7ddf8c]" />,
      title: "Trusted provider layer",
      description:
        "The planner works best because it connects to verified stays, activities, and local suppliers.",
      benefits: [
        "Trust signals built into planning",
        "Clearer booking confidence",
        "Less guesswork across providers",
      ],
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-[#ffc247]" />,
      title: "Smarter logistics checks",
      description:
        "Warnings, sequencing, and budget visibility make the itinerary feel practical, not just pretty.",
      benefits: [
        "Spot travel gaps early",
        "Reduce timing conflicts",
        "Keep cost and flow visible",
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-6">
      <div className="theme-panel rounded-[32px] p-5 md:rounded-[36px] md:p-8">
        <div className="text-center">
          <p className="theme-label text-sm uppercase tracking-[0.28em]">
            Why it fits Off2Zim
          </p>
          <h2 className="theme-heading mt-3 text-3xl font-semibold md:text-4xl">
            Planning should feel as polished as discovery
          </h2>
          <p className="theme-muted mx-auto mt-4 max-w-2xl text-base leading-7">
            The planner is strongest when it carries the same trust, destination-first
            clarity, and human guidance that already shapes the rest of the product.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="theme-card-soft rounded-[26px] p-5 md:p-6">
              {feature.icon}
              <h3 className="theme-heading mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="theme-muted mt-3 text-sm leading-6">{feature.description}</p>
              <ul className="mt-5 space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="theme-muted flex items-center gap-2 text-sm">
                    <CheckIcon className="h-4 w-4 text-[#7ddf8c]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-[#ff5630]/20 bg-[linear-gradient(135deg,rgba(255,86,48,0.16),rgba(255,255,255,0.92))] p-5 text-center dark:bg-[linear-gradient(135deg,rgba(255,86,48,0.14),rgba(17,17,17,0.95))] md:rounded-[30px] md:p-6">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Need help shaping the route?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-white/75">
            Pair your itinerary with Community Guides for local recommendations,
            video consults, or booking confidence on harder multi-stop trips.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
              Find a community guide
            </button>
            <button className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-950 dark:border-white/20 dark:bg-white/10 dark:text-white">
              Learn about Guide+ services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

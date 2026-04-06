import { Bus, Clock3, MapPin, Route } from "lucide-react";

const routes = [
  ["Harare to Bulawayo", "4 to 5 hours", "$8 to $15"],
  ["Harare to Victoria Falls", "7 to 8 hours", "$12 to $20"],
  ["Bulawayo to Victoria Falls", "3 to 4 hours", "$6 to $12"],
  ["Harare to Mutare", "3 to 4 hours", "$5 to $10"],
];

export default function BusTransportPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Bus transport
              </div>
              <h1 className="theme-heading mt-4 text-4xl font-semibold md:text-5xl">
                Intercity movement for practical itinerary building
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Bus travel works best when it is shown as route logic: city pairs,
                duration, and price range that help travelers judge whether it fits
                the pace of the trip.
              </p>
            </div>
            <div className="min-h-[260px] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url('/images/slide1.jpg')" }} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {routes.map(([route, duration, price]) => (
            <div key={route} className="theme-card rounded-[30px] p-6">
              <Bus className="h-6 w-6 text-[#ff7352]" />
              <h2 className="theme-heading mt-4 text-2xl font-semibold">{route}</h2>
              <div className="theme-muted mt-4 space-y-2 text-sm">
                <div className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#5aa7ff]" />{duration}</div>
                <div className="inline-flex items-center gap-2"><Route className="h-4 w-4 text-[#8cf0a1]" />Multiple daily operator options</div>
                <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#ffca74]" />{price}</div>
              </div>
              <button className="mt-6 rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white">Plan this route</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

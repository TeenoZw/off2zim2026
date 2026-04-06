import { Clock3, Plane, Sparkles, Ticket } from "lucide-react";

const flightRoutes = [
  ["Harare to Victoria Falls", "1h 15m", "From $180"],
  ["Harare to Bulawayo", "1h 05m", "From $160"],
  ["Victoria Falls to Johannesburg", "1h 45m", "From $290"],
  ["Harare to Cape Town", "2h 15m", "From $320"],
];

export default function FlightsPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Flights
              </div>
              <h1 className="theme-heading mt-4 text-4xl font-semibold md:text-5xl">
                Faster links between key Zimbabwe and regional stops
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Flights matter when time is the constraint. This page should help
                travelers compare key air links and decide when flying strengthens
                the itinerary.
              </p>
            </div>
            <div className="min-h-[260px] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')" }} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {flightRoutes.map(([route, duration, price]) => (
            <div key={route} className="theme-card rounded-[30px] p-6">
              <Plane className="h-6 w-6 text-[#ff7352]" />
              <h2 className="theme-heading mt-4 text-2xl font-semibold">{route}</h2>
              <div className="theme-muted mt-4 space-y-2 text-sm">
                <div className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#5aa7ff]" />{duration}</div>
                <div className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8cf0a1]" />Useful for compressing long-distance travel</div>
                <div className="inline-flex items-center gap-2"><Ticket className="h-4 w-4 text-[#ffca74]" />{price}</div>
              </div>
              <button className="mt-6 rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white">Search flights</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

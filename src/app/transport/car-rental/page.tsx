import { CarFront, MapPin, ShieldCheck, TimerReset } from "lucide-react";

const carTypes = [
  ["Economy cars", "Fuel-efficient and budget-friendly", "$25/day"],
  ["SUVs and 4x4s", "Better for multi-stop and rural routes", "$65/day"],
  ["Luxury vehicles", "Premium comfort for higher-end travel", "$120/day"],
];

export default function CarRentalPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Car rental
              </div>
              <h1 className="theme-heading mt-4 text-4xl font-semibold md:text-5xl">
                Self-drive freedom for travelers shaping their own pace
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Car rental is strongest when the traveler wants more autonomy across
                multiple destinations, stays, or scenic routes.
              </p>
            </div>
            <div className="min-h-[260px] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url('/images/destinations/eastern-highlands.jpg')" }} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {carTypes.map(([name, description, price]) => (
            <div key={name} className="theme-card rounded-[30px] p-6">
              <CarFront className="h-6 w-6 text-[#ff7352]" />
              <h2 className="theme-heading mt-4 text-2xl font-semibold">{name}</h2>
              <p className="theme-muted mt-3 text-sm leading-6">{description}</p>
              <div className="theme-muted mt-4 space-y-2 text-sm">
                <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#8cf0a1]" />Insurance-led planning</div>
                <div className="inline-flex items-center gap-2"><TimerReset className="h-4 w-4 text-[#5aa7ff]" />Flexible pickup and return</div>
                <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#ffca74]" />{price}</div>
              </div>
              <button className="mt-6 rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white">Browse vehicles</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

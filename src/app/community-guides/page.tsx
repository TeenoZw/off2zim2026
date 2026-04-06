import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

export const metadata = {
  title: "Ask a Local - Community Guides | Off2Zim",
  description:
    "Connect with verified local Community Guides for authentic Zimbabwe insights. Get free advice in our forum or book personalized Guide+ services.",
};

const featuredQuestions = [
  {
    title: "Best sunrise photography spots at Victoria Falls?",
    author: "Sarah C.",
    location: "Victoria Falls",
    replies: 8,
    status: "Answered",
  },
  {
    title: "Local food experiences in Harare worth booking?",
    author: "James W.",
    location: "Harare",
    replies: 15,
    status: "Trending",
  },
  {
    title: "Budget transport advice for Matobo National Park",
    author: "Emma R.",
    location: "Matobo",
    replies: 12,
    status: "Open",
  },
];

const guides = [
  {
    name: "Tendai Mukamuri",
    specialty: "Photography and adventure",
    location: "Victoria Falls",
    rating: 4.9,
    price: "$80",
    service: "Secret sunrise photo tour",
  },
  {
    name: "Chipo Ndoro",
    specialty: "Culture and wildlife",
    location: "Matobo",
    rating: 4.8,
    price: "$95",
    service: "Rock art and rhino discovery",
  },
  {
    name: "Rutendo M.",
    specialty: "City life and culinary routes",
    location: "Harare",
    rating: 4.7,
    price: "$45",
    service: "Local markets and food walk",
  },
];

export default function CommunityGuidesPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[38px]">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Ask a Local
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Ask locals. Book with confidence.
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-base leading-7 md:text-lg">
                Get trusted local insight, practical answers, and Guide+ support in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" />
                  Ask a question
                </button>
                <button className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Browse Guide+ services
                </button>
              </div>
            </div>

            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.42)), url('/images/great-zimbabwe.jpg')",
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="theme-panel rounded-[30px] p-5">
            <div className="theme-label text-sm">Forum questions</div>
            <div className="theme-heading mt-2 text-3xl font-semibold">1,247</div>
          </div>
          <div className="theme-panel rounded-[30px] p-5">
            <div className="theme-label text-sm">Active locals</div>
            <div className="theme-heading mt-2 text-3xl font-semibold">856</div>
          </div>
          <div className="theme-panel rounded-[30px] p-5">
            <div className="theme-label text-sm">Answered rate</div>
            <div className="theme-heading mt-2 text-3xl font-semibold">94%</div>
          </div>
          <div className="theme-panel rounded-[30px] p-5">
            <div className="theme-label text-sm">Avg response</div>
            <div className="theme-heading mt-2 text-3xl font-semibold">2.3h</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Two lanes
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Free advice or premium local help
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="theme-card-soft p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#122116]">
                  <MessageCircle className="h-5 w-5 text-[#8cf0a1]" />
                </div>
                <h3 className="theme-heading mt-4 text-xl font-semibold">Forum</h3>
                <p className="theme-muted mt-2 text-sm leading-6">
                  Community-driven Q&A where verified local voices can stand out
                  and help explorers make better decisions.
                </p>
              </div>
              <div className="rounded-[28px] border border-[#ff5630]/20 bg-[#1a120f] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d1714]">
                  <Star className="h-5 w-5 text-[#ff8a63]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Guide+</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Personalized planning, video consultations, and guided experiences
                  for travelers who want more context and confidence.
                </p>
              </div>
            </div>
          </div>

          <div className="theme-panel rounded-[36px] p-6 md:p-8">
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Trust model
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Why Community Guides matter to the product
            </h2>
            <div className="mt-6 space-y-4">
              <TrustRow
                icon={<BadgeCheck className="h-4 w-4 text-[#5aa7ff]" />}
                title="Verified expertise"
                body="Guides are vetted and highlighted, which reduces uncertainty for travelers."
              />
              <TrustRow
                icon={<ShieldCheck className="h-4 w-4 text-[#7ddf8c]" />}
                title="Safer discovery"
                body="Advice becomes part of the trust system, not just content hidden in a blog."
              />
              <TrustRow
                icon={<Video className="h-4 w-4 text-[#ffc247]" />}
                title="Higher-value support"
                body="Guide+ services create a clear monetizable layer beyond listings and bookings."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="theme-label text-sm uppercase tracking-[0.28em]">
            Forum snapshot
          </p>
          <h2 className="theme-heading mt-2 text-3xl font-semibold">
            Popular traveler questions
          </h2>
        </div>
        <div className="space-y-4">
          {featuredQuestions.map((question) => (
            <article
              key={question.title}
              className="theme-panel rounded-[32px] p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="theme-heading text-xl font-semibold">{question.title}</h3>
                  <div className="theme-muted mt-3 flex flex-wrap gap-3 text-sm">
                    <span>{question.author}</span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#ff7352]" />
                      {question.location}
                    </span>
                    <span>{question.replies} replies</span>
                  </div>
                </div>
                <div className="theme-chip rounded-full px-4 py-2 text-sm">
                  {question.status}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="theme-label text-sm uppercase tracking-[0.28em]">
              Guide+ services
            </p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Featured local experts
            </h2>
          </div>
          <Link
            href="/register"
            className="theme-muted hidden items-center gap-2 text-sm hover:text-slate-950 dark:hover:text-white md:inline-flex"
          >
            Become a guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.name}
              className="theme-panel rounded-[32px] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="theme-heading text-2xl font-semibold">{guide.name}</h3>
                  <p className="theme-muted mt-1 text-sm">{guide.specialty}</p>
                </div>
                <div className="theme-chip rounded-full px-3 py-2 text-sm">
                  <Star className="mr-1 inline h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                  {guide.rating}
                </div>
              </div>

              <div className="theme-muted mt-4 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[#ff7352]" />
                {guide.location}
              </div>

              <div className="theme-card-soft mt-5 rounded-[24px] p-4">
                <div className="theme-label text-sm">Featured service</div>
                <div className="theme-heading mt-2 text-lg font-semibold">{guide.service}</div>
                <div className="theme-muted mt-3 text-sm">From {guide.price}</div>
              </div>

              <button className="mt-5 w-full rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
                View guide profile
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TrustRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="theme-card-soft p-5">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]">
          {icon}
        </div>
        <div>
          <h3 className="theme-heading text-lg font-semibold">{title}</h3>
          <p className="theme-muted mt-2 text-sm leading-6">{body}</p>
        </div>
      </div>
    </div>
  );
}

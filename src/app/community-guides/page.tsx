"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppServiceStrip from "@/components/ui/AppServiceStrip";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
  X,
} from "lucide-react";
import { usePayment } from "@/contexts/PaymentContext";
import { BookingItem } from "@/types/payment";

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

interface Guide {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  pricePerSession: number;
  service: string;
  services: string[];
  bio: string;
}

const guides: Guide[] = [
  {
    id: "tendai-mukamuri",
    name: "Tendai Mukamuri",
    specialty: "Photography and adventure",
    location: "Victoria Falls",
    rating: 4.9,
    pricePerSession: 80,
    service: "Secret sunrise photo tour",
    services: ["Sunrise photography tour", "Waterfall access walk", "Drone footage session"],
    bio: "Victoria Falls-based photographer with 8 years guiding travelers to the best angles and hidden vantage points.",
  },
  {
    id: "chipo-ndoro",
    name: "Chipo Ndoro",
    specialty: "Culture and wildlife",
    location: "Matobo",
    rating: 4.8,
    pricePerSession: 95,
    service: "Rock art and rhino discovery",
    services: ["Rock art and rhino discovery", "Cultural village walk", "Historical cave tour"],
    bio: "Matobo-born guide with deep knowledge of the region's San rock art, rhino conservation, and local traditions.",
  },
  {
    id: "rutendo-m",
    name: "Rutendo M.",
    specialty: "City life and culinary routes",
    location: "Harare",
    rating: 4.7,
    pricePerSession: 45,
    service: "Local markets and food walk",
    services: ["Local markets and food walk", "Street art tour", "Nightlife and dining route"],
    bio: "Harare-based food enthusiast and city guide passionate about connecting visitors to authentic local culture and cuisine.",
  },
];

/* ── Ask a Question Modal ─────────────────────────────────────────────────── */

function AskQuestionModal({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!question.trim()) return;
    // In production this would POST to /api/forum/questions
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="theme-panel w-full max-w-lg rounded-[32px] p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="theme-label text-xs uppercase tracking-[0.22em]">Ask a Local</p>
            <h2 className="theme-heading mt-1 text-xl font-semibold">Post your question</h2>
          </div>
          <button onClick={onClose} className="mt-1 rounded-full p-2 theme-muted hover:bg-white/[0.07] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="rounded-[24px] border border-[#4ade80]/20 bg-[#0f2a1e] p-6 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[#4ade80]/15">
              <MessageCircle className="h-6 w-6 text-[#4ade80]" />
            </div>
            <h3 className="theme-heading mt-4 text-lg font-semibold">Question submitted!</h3>
            <p className="theme-muted mt-2 text-sm">
              Your question has been posted to the forum. Local guides and community
              members will respond shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-full bg-[#ff5630] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs theme-subtle mb-1.5">Your question *</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Best time to visit Victoria Falls? Any hidden gems near Harare?"
                rows={4}
                className="theme-input w-full rounded-[16px] px-4 py-3 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs theme-subtle mb-1.5">Location (optional)</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Victoria Falls, Harare, Matobo..."
                className="theme-input w-full rounded-[14px] px-4 py-2.5 text-sm"
              />
            </div>
            <p className="theme-subtle text-xs">
              Questions are answered by verified Community Guides and fellow travelers.
              Typically within 2–3 hours.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                Post question
              </button>
              <button onClick={onClose} className="theme-button-secondary w-full rounded-full px-6 py-3 text-sm font-semibold">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Guide Profile / Book Modal ───────────────────────────────────────────── */

function GuideProfileModal({ guide, onClose }: { guide: Guide; onClose: () => void }) {
  const router = useRouter();
  const { addToBooking } = usePayment();
  const [selectedService, setSelectedService] = useState(guide.services[0]);
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"profile" | "booked">("profile");

  const total = guide.pricePerSession * people;

  const handleBook = () => {
    const item: BookingItem = {
      id: `guide-${guide.id}-${Date.now()}`,
      type: "activity",
      name: `${guide.name} – ${selectedService}`,
      description: guide.bio,
      price: guide.pricePerSession,
      currency: "USD",
      category: "guide-plus",
      quantity: people,
      checkIn: date,
      metadata: {
        guideName: guide.name,
        guideId: guide.id,
        service: selectedService,
        location: guide.location,
        specialty: guide.specialty,
        notes,
      },
    };
    addToBooking(item);
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="theme-panel w-full max-w-lg rounded-[32px] p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff5630]/15 text-lg font-bold text-[#ff5630]">
              {guide.name.charAt(0)}
            </div>
            <div>
              <h2 className="theme-heading text-xl font-semibold">{guide.name}</h2>
              <p className="theme-muted text-sm">{guide.specialty}</p>
            </div>
          </div>
          <button onClick={onClose} className="mt-1 rounded-full p-2 theme-muted hover:bg-white/[0.07] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 theme-muted">
            <MapPin className="h-4 w-4 text-[#ff7352]" /> {guide.location}
          </span>
          <span className="inline-flex items-center gap-1.5 theme-muted">
            <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" /> {guide.rating}
          </span>
          <span className="theme-heading text-sm font-semibold">${guide.pricePerSession}/session</span>
        </div>

        {/* Bio */}
        <p className="theme-muted text-sm leading-6">{guide.bio}</p>

        {/* Service selector */}
        <div>
          <label className="block text-xs theme-subtle mb-2">Select a service</label>
          <div className="space-y-2">
            {guide.services.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedService(s)}
                className={`w-full text-left rounded-[14px] border px-4 py-3 text-sm transition-colors ${
                  selectedService === s
                    ? "border-[#ff5630] bg-[#ff5630]/10 text-[#ff7352]"
                    : "border-white/[0.08] bg-white/[0.02] theme-muted hover:bg-white/[0.05]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs theme-subtle mb-1.5">Preferred date</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="theme-input w-full rounded-[14px] px-3 py-2.5 text-sm"
          />
        </div>

        {/* People */}
        <div>
          <label className="block text-xs theme-subtle mb-1.5">People in your group</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              disabled={people <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 theme-muted hover:bg-white/[0.07] disabled:opacity-30 transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="theme-heading w-8 text-center text-sm font-semibold">{people}</span>
            <button
              onClick={() => setPeople((p) => p + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 theme-muted hover:bg-white/[0.07] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="theme-subtle text-xs ml-1">person{people !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs theme-subtle mb-1.5">Special requests / notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific interests, accessibility needs, or timing requests..."
            rows={2}
            className="theme-input w-full rounded-[14px] px-3 py-2.5 text-sm resize-none"
          />
        </div>

        {/* Total */}
        <div className="rounded-[18px] border border-white/[0.07] bg-white/[0.04] px-4 py-3 flex items-center justify-between text-sm">
          <span className="theme-muted">${guide.pricePerSession} × {people} person{people !== 1 ? "s" : ""}</span>
          <span className="theme-heading text-lg font-bold">${total}</span>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleBook}
            className="w-full rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
          >
            Add to cart &amp; review
          </button>
          <button onClick={onClose} className="theme-button-secondary w-full rounded-full px-6 py-3 text-sm font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function CommunityGuidesPage() {
  const guidePlusSectionRef = useRef<HTMLElement>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  const scrollToGuides = () => {
    guidePlusSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="theme-page pb-20">
      {showAskModal && <AskQuestionModal onClose={() => setShowAskModal(false)} />}
      {activeGuide && <GuideProfileModal guide={activeGuide} onClose={() => setActiveGuide(null)} />}

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
                <button
                  onClick={() => setShowAskModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask a question
                </button>
                <button
                  onClick={scrollToGuides}
                  className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
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

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <AppServiceStrip activeLabel="Ask a Local" />
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
            <p className="theme-label text-sm uppercase tracking-[0.28em]">Two lanes</p>
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
                  Community-driven Q&amp;A where verified local voices can stand out
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
            <p className="theme-label text-sm uppercase tracking-[0.28em]">Trust model</p>
            <h2 className="theme-heading mt-2 text-3xl font-semibold">
              Why Community Guides matter
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
        <SectionHeader eyebrow="Forum snapshot" title="Popular traveler questions" />
        <div className="mt-5 space-y-4">
          {featuredQuestions.map((question) => (
            <article key={question.title} className="theme-panel rounded-[32px] p-5">
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
                <div className="flex items-center gap-3">
                  <div className="theme-chip rounded-full px-4 py-2 text-sm">{question.status}</div>
                  <button
                    onClick={() => setShowAskModal(true)}
                    className="theme-button-secondary rounded-full px-4 py-2 text-xs font-semibold"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5">
          <button
            onClick={() => setShowAskModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Ask your own question
          </button>
        </div>
      </section>

      <section ref={guidePlusSectionRef} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <SectionHeader eyebrow="Guide+ services" title="Featured local experts" />
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
            <article key={guide.id} className="theme-panel rounded-[32px] p-5 flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff5630]/15 text-base font-bold text-[#ff5630]">
                    {guide.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="theme-heading text-lg font-semibold">{guide.name}</h3>
                    <p className="theme-muted text-xs">{guide.specialty}</p>
                  </div>
                </div>
                <div className="theme-chip rounded-full px-3 py-2 text-sm shrink-0">
                  <Star className="mr-1 inline h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                  {guide.rating}
                </div>
              </div>

              <div className="theme-muted mt-3 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[#ff7352]" />
                {guide.location}
              </div>

              <p className="theme-muted mt-3 flex-1 text-xs leading-5 line-clamp-2">{guide.bio}</p>

              <div className="theme-card-soft mt-4 rounded-[24px] p-4">
                <div className="theme-label text-xs">Featured service</div>
                <div className="theme-heading mt-1.5 text-base font-semibold">{guide.service}</div>
                <div className="theme-heading mt-1 text-lg font-bold">
                  ${guide.pricePerSession}
                  <span className="theme-subtle ml-1 text-xs font-normal">/ session</span>
                </div>
              </div>

              <button
                onClick={() => setActiveGuide(guide)}
                className="mt-4 w-full rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] transition-colors"
              >
                View &amp; book with {guide.name.split(" ")[0]}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TrustRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
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

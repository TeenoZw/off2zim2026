import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import ContactForm from "@/components/contact/ContactForm";

const contactMethods = [
  {
    title: "Call Off2Zim",
    detail: "+263 78 111 4400",
    note: "Trip planning help, urgent travel support, and booking coordination.",
    icon: PhoneIcon,
    accent: "text-[#8cf0a1]",
  },
  {
    title: "Email the team",
    detail: "hello@off2zim.com",
    note: "Best for custom itineraries, partnership requests, and follow-up questions.",
    icon: EnvelopeIcon,
    accent: "text-[#ffca74]",
  },
  {
    title: "WhatsApp support",
    detail: "+263 77 440 2211",
    note: "Quick support for active travelers who need answers while moving.",
    icon: ChatBubbleLeftRightIcon,
    accent: "text-[#5aa7ff]",
  },
];

const officeMoments = [
  {
    city: "Harare",
    label: "Coordination hub",
    address: "Borrowdale, Harare",
    hours: "Mon to Fri, 08:00 to 18:00",
  },
  {
    city: "Victoria Falls",
    label: "Guest support",
    address: "Livingstone Way, Victoria Falls",
    hours: "Daily, 07:00 to 20:00",
  },
  {
    city: "Bulawayo",
    label: "Regional support",
    address: "City Centre, Bulawayo",
    hours: "Mon to Sat, 08:00 to 17:00",
  },
];

const faqs = [
  {
    question: "How does Off2Zim help with trip planning?",
    answer:
      "We bring together stays, experiences, transport, events, and local guidance so you can shape one connected Zimbabwe itinerary instead of juggling separate providers.",
  },
  {
    question: "Can you help with custom group or family travel?",
    answer:
      "Yes. Use the message form to share dates, traveler count, pacing preferences, and must-do experiences, and the team can help shape a more tailored route.",
  },
  {
    question: "Do you only support international travelers?",
    answer:
      "No. Off2Zim is designed for both visitors and local explorers who want easier discovery, booking coordination, and trusted travel information.",
  },
];

export default function ContactPage() {
  return (
    <div className="theme-page pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Contact Off2Zim
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold md:text-5xl">
                Reach the team behind your Zimbabwe journey
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                Use Off2Zim for discovery, planning, and booking support, then reach
                out when you need a clearer route, a faster answer, or help turning
                an idea into a working itinerary.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.title} className="theme-card-soft rounded-[24px] p-4">
                      <Icon className={`h-6 w-6 ${method.accent}`} />
                      <div className="theme-heading mt-3 text-base font-semibold">
                        {method.title}
                      </div>
                      <div className="theme-muted mt-1 text-sm">{method.detail}</div>
                    </div>
                  );
                })}
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
                    Support window
                  </div>
                  <div className="mt-2 text-xl font-semibold">
                    Real people, real route support
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-[#8cf0a1]" />
                      Seven-day support rhythm
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-[#ff7352]" />
                      Zimbabwe-first knowledge
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="theme-panel rounded-[30px] p-6 md:p-8">
            <p className="theme-label text-xs uppercase tracking-[0.24em]">Write to us</p>
            <h2 className="theme-heading mt-2 text-2xl font-semibold">
              Tell us what you are trying to plan
            </h2>
            <p className="theme-muted mt-3 text-sm leading-6">
              This message format mirrors the PRD travel workflow: dates, traveler
              type, trip intent, and what still needs solving.
            </p>

            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="theme-panel rounded-[30px] p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="theme-label text-xs uppercase tracking-[0.24em]">
                    Support points
                  </p>
                  <h2 className="theme-heading mt-2 text-2xl font-semibold">
                    Where the journey is coordinated
                  </h2>
                </div>
                <GlobeAltIcon className="h-6 w-6 text-[#ff7352]" />
              </div>

              <div className="mt-5 space-y-4">
                {officeMoments.map((office) => (
                  <div key={office.city} className="theme-card-soft rounded-[24px] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="theme-heading text-lg font-semibold">{office.city}</div>
                        <div className="theme-muted mt-1 text-sm">{office.label}</div>
                      </div>
                      <div className="theme-chip rounded-full px-3 py-1 text-xs">
                        {office.hours}
                      </div>
                    </div>
                    <div className="theme-muted mt-4 flex items-center gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-[#ff7352]" />
                      {office.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="theme-panel rounded-[30px] p-6 md:p-8">
              <p className="theme-label text-xs uppercase tracking-[0.24em]">FAQs</p>
              <h2 className="theme-heading mt-2 text-2xl font-semibold">
                Questions travelers ask first
              </h2>
              <div className="mt-5 space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="theme-card-soft rounded-[24px] p-4">
                    <summary className="theme-heading cursor-pointer list-none text-base font-semibold">
                      {faq.question}
                    </summary>
                    <p className="theme-muted mt-3 text-sm leading-6">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

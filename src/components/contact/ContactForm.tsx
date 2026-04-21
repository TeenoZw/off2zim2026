"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dates: "",
    travelerType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSending(true);
    // In production: POST to /api/contact
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4ade80]/15">
          <CheckCircle2 className="h-7 w-7 text-[#4ade80]" />
        </div>
        <div>
          <h3 className="theme-heading text-xl font-semibold">Message sent!</h3>
          <p className="theme-muted mt-2 text-sm leading-6">
            The Off2Zim team will get back to you, usually within a few hours
            during operating times.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", dates: "", travelerType: "", message: "" }); }}
          className="theme-button-secondary rounded-full px-6 py-2.5 text-sm font-semibold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="theme-input h-12 rounded-[18px] px-4"
          placeholder="First name"
          value={form.firstName}
          onChange={set("firstName")}
        />
        <input
          className="theme-input h-12 rounded-[18px] px-4"
          placeholder="Last name"
          value={form.lastName}
          onChange={set("lastName")}
        />
      </div>
      <input
        type="email"
        required
        className="theme-input h-12 w-full rounded-[18px] px-4"
        placeholder="Email address *"
        value={form.email}
        onChange={set("email")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="theme-input h-12 rounded-[18px] px-4"
          placeholder="Preferred dates"
          value={form.dates}
          onChange={set("dates")}
        />
        <select
          className="theme-input h-12 rounded-[18px] px-4"
          value={form.travelerType}
          onChange={set("travelerType")}
        >
          <option value="">Traveler type</option>
          <option value="foreign">Foreign explorer</option>
          <option value="local">Local explorer</option>
          <option value="family">Family or group</option>
          <option value="business">Business traveler</option>
        </select>
      </div>
      <textarea
        required
        className="theme-input min-h-[180px] w-full rounded-[24px] px-4 py-3"
        placeholder="Share the route, experiences, budget expectations, or support you need. *"
        value={form.message}
        onChange={set("message")}
      />
      <button
        type="submit"
        disabled={sending || !form.email || !form.message}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff7352] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {sending ? "Sending…" : "Send to Off2Zim support"}
      </button>
    </form>
  );
}

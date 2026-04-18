"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const EXPERTISE_OPTIONS = [
  "Accommodations",
  "Wildlife & Safari",
  "Cultural Experiences",
  "Adventure Activities",
  "Local Cuisine",
  "Budget Travel",
  "Luxury Travel",
  "Photography Spots",
  "Transport & Getting Around",
  "Hidden Gems",
];

const DESTINATION_OPTIONS = [
  "Harare",
  "Bulawayo",
  "Victoria Falls",
  "Hwange National Park",
  "Matobo Hills",
  "Eastern Highlands",
  "Kariba",
  "Great Zimbabwe",
  "Gonarezhou",
  "Mana Pools",
  "Chinhoyi Caves",
  "Nyanga",
];

export default function CommunityGuideApplyPage() {
  return (
    <ProtectedRoute requiredRole="explorer">
      <ApplyContent />
    </ProtectedRoute>
  );
}

function ApplyContent() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const toggle = <T extends string>(
    value: T,
    current: T[],
    set: (v: T[]) => void
  ) => {
    set(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (bio.length < 50) {
      setError("Your bio must be at least 50 characters.");
      return;
    }
    if (expertise.length === 0) {
      setError("Select at least one area of expertise.");
      return;
    }
    if (destinations.length === 0) {
      setError("Select at least one destination you know well.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/guides/apply", {
        method: "POST",
        body: JSON.stringify({ bio, expertise, destinations }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center p-8">
        <div className="theme-panel max-w-lg rounded-[32px] p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#4ade80]" />
          <h1 className="theme-heading mt-5 text-3xl font-semibold">Application submitted</h1>
          <p className="theme-muted mt-4 text-sm leading-7">
            Thank you for applying to become a Community Guide. Our team will review your application
            and get back to you within 3–5 business days.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex h-12 items-center rounded-full bg-[#ff5630] px-6 text-sm font-semibold text-white"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5630]/25 bg-[#ff5630]/8 px-4 py-2 text-sm font-medium text-[#ff5630]">
            <Star className="h-4 w-4" />
            Community Guide Program
          </div>
          <h1 className="theme-heading mt-4 text-4xl font-semibold">Become a guide</h1>
          <p className="theme-muted mt-4 max-w-xl text-sm leading-7">
            Share your knowledge of Zimbabwe with travelers from around the world. Answer questions
            for free in the Ask a Local forum, or offer paid Guide+ services and earn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div className="theme-panel rounded-[28px] p-6">
            <label className="theme-heading text-lg font-semibold" htmlFor="bio">
              About you
            </label>
            <p className="theme-muted mt-1 text-sm">
              Tell us about your connection to Zimbabwe and why you&apos;d be a great guide.
              Minimum 50 characters.
            </p>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              className="theme-input mt-4 w-full rounded-2xl px-4 py-3 text-sm resize-none"
              placeholder="I've lived in Bulawayo my whole life and have guided groups through Matobo Hills many times..."
            />
            <div className={`mt-1 text-right text-xs ${bio.length >= 50 ? "text-[#4ade80]" : "theme-muted"}`}>
              {bio.length} / 50 min
            </div>
          </div>

          {/* Expertise */}
          <div className="theme-panel rounded-[28px] p-6">
            <div className="theme-heading text-lg font-semibold">Areas of expertise</div>
            <p className="theme-muted mt-1 mb-4 text-sm">Select everything that applies.</p>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt, expertise, setExpertise)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    expertise.includes(opt)
                      ? "bg-[#ff5630] text-white"
                      : "border border-black/10 bg-black/[0.03] text-black/70 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65 dark:hover:bg-white/[0.08]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div className="theme-panel rounded-[28px] p-6">
            <div className="flex items-center gap-2 theme-heading text-lg font-semibold">
              <MapPin className="h-5 w-5 text-[#ff5630]" />
              Destinations you know well
            </div>
            <p className="theme-muted mt-1 mb-4 text-sm">Select the places you can confidently guide travelers through.</p>
            <div className="flex flex-wrap gap-2">
              {DESTINATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt, destinations, setDestinations)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    destinations.includes(opt)
                      ? "bg-[#13283a] text-[#8dc9ff] ring-1 ring-[#8dc9ff]/25"
                      : "border border-black/10 bg-black/[0.03] text-black/70 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65 dark:hover:bg-white/[0.08]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#ff5630] py-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}

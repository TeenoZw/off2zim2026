"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import {
  FeaturedSection,
  type FeaturedEntryData,
  type FeaturedPathway,
} from "@/components/featured/FeaturedCard";

interface FeaturedResponse {
  featured: Record<FeaturedPathway, FeaturedEntryData[]>;
  total: number;
}

export default function FeaturedPage() {
  const [data, setData] = useState<FeaturedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<FeaturedResponse>("/api/featured")
      .then((d) => setData(d))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load featured listings.")
      )
      .finally(() => setLoading(false));
  }, []);

  const hasContent =
    data &&
    (data.featured.sponsored.length > 0 ||
      data.featured.top_rated.length > 0 ||
      data.featured.editors_choice.length > 0);

  return (
    <div className="theme-page">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#fbbf24]" />
            <span className="text-sm font-medium text-white/40 uppercase tracking-wider">
              Curated for you
            </span>
          </div>
          <h1 className="theme-heading text-3xl font-bold sm:text-4xl">
            Featured in Zimbabwe
          </h1>
          <p className="theme-muted mt-2 max-w-xl text-sm">
            Hand-picked experiences, top-rated providers, and sponsored listings from across
            Zimbabwe's finest destinations.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-[20px] border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 animate-pulse rounded-full bg-white/8" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="animate-pulse rounded-[24px] bg-white/[0.04]"
                      style={{ aspectRatio: "4/5" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !hasContent ? (
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-16 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-white/15" />
            <p className="font-medium text-white/40">No featured listings right now.</p>
            <p className="mt-1 text-sm text-white/25">Check back soon — we update this regularly.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {/* Editor's Choice first — most editorial weight */}
            <FeaturedSection
              pathway="editors_choice"
              entries={data.featured.editors_choice}
            />
            {/* Top Rated */}
            <FeaturedSection
              pathway="top_rated"
              entries={data.featured.top_rated}
            />
            {/* Sponsored last */}
            <FeaturedSection
              pathway="sponsored"
              entries={data.featured.sponsored}
            />
          </div>
        )}
      </div>
    </div>
  );
}

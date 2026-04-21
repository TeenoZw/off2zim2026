"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client-api";
import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react";

type Pathway = "sponsored" | "top_rated" | "editors_choice";

interface FeaturedEntry {
  id: string;
  pathway: Pathway;
  justification: string | null;
  sortOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    status: string;
    company: {
      id: string;
      companyName: string;
      isVerified: boolean;
      isFeaturedEligible: boolean;
    };
  };
}

interface PromotedListing {
  listingId: string;
  title: string;
  companyName: string;
  completedBookings: number;
  avgRating: number;
  score: number;
  featuredEntryId?: string;
}

const PATHWAY_STYLES: Record<Pathway, { label: string; color: string; icon: typeof Star }> = {
  sponsored: { label: "Sponsored", color: "text-[#8dc9ff] bg-[#8dc9ff]/10", icon: Sparkles },
  top_rated: { label: "Top Rated", color: "text-[#4ade80] bg-[#4ade80]/10", icon: Star },
  editors_choice: { label: "Editor's Choice", color: "text-[#fbbf24] bg-[#fbbf24]/10", icon: Award },
};

function PathwayPill({ pathway }: { pathway: Pathway }) {
  const { label, color, icon: Icon } = PATHWAY_STYLES[pathway];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Add Entry Form ────────────────────────────────────────────────────────────

function AddEntryForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [listingId, setListingId] = useState("");
  const [pathway, setPathway] = useState<Pathway>("sponsored");
  const [justification, setJustification] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!listingId.trim() || !startDate || !endDate) {
      setError("Listing ID, start date, and end date are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/admin/featured", {
        method: "POST",
        body: JSON.stringify({
          listingId: listingId.trim(),
          pathway,
          justification: justification.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          sortOrder,
        }),
      });
      setOpen(false);
      setListingId("");
      setJustification("");
      setStartDate("");
      setEndDate("");
      setSortOrder(0);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create entry.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-[#ff5630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4520]"
      >
        <Plus className="h-4 w-4" />
        Add featured entry
      </button>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#111111] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-white">New featured entry</h3>
        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white/70">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Listing ID</label>
          <input
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            placeholder="cuid..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Pathway</label>
          <select
            value={pathway}
            onChange={(e) => setPathway(e.target.value as Pathway)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
          >
            <option value="sponsored">Sponsored</option>
            <option value="top_rated">Top Rated</option>
            <option value="editors_choice">Editor's Choice</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Sort order</label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Start date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">End date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
          />
        </div>

        {pathway === "editors_choice" && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-white/40">
              Justification <span className="text-[#ff5630]">*</span>
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Why is this listing an Editor's Choice?"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25"
            />
          </div>
        )}

        {error && (
          <p className="sm:col-span-2 text-sm text-[#ff5630]">{error}</p>
        )}

        <div className="sm:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : (<><Check className="h-4 w-4" /> Create entry</>)}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Auto-qualify panel ────────────────────────────────────────────────────────

function AutoQualifyPanel({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [topN, setTopN] = useState(10);
  const [windowDays, setWindowDays] = useState(30);
  const [minBookings, setMinBookings] = useState(3);
  const [minRating, setMinRating] = useState(4.0);
  const [replace, setReplace] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ promoted: PromotedListing[]; skipped: number; message: string } | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const data = await apiFetch<{ promoted: PromotedListing[]; skipped: number; message: string }>(
        "/api/admin/featured/auto-qualify",
        {
          method: "POST",
          body: JSON.stringify({ topN, windowDays, minBookings, minRating, replace }),
        }
      );
      setResult(data);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auto-qualify failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#111111] p-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#fbbf24]" />
          <span className="font-semibold text-white">Auto-qualify top_rated</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>

      {open && (
        <div className="mt-5 space-y-4">
          <p className="text-xs text-white/40">
            Scores all eligible listings (60% avg rating + 40% booking volume) and promotes the
            top N into the <strong className="text-white/60">top_rated</strong> pathway.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/40">Top N listings</span>
              <input
                type="number"
                min={1}
                max={50}
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value, 10) || 10)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/40">Feature window (days)</span>
              <input
                type="number"
                min={1}
                max={365}
                value={windowDays}
                onChange={(e) => setWindowDays(parseInt(e.target.value, 10) || 30)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/40">Min completed bookings</span>
              <input
                type="number"
                min={0}
                value={minBookings}
                onChange={(e) => setMinBookings(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/40">Min avg rating</span>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value) || 4.0)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white"
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 accent-[#ff5630]"
            />
            <span className="text-sm text-white/60">
              Deactivate existing top_rated entries before promoting
            </span>
          </label>

          {error && <p className="text-sm text-[#ff5630]">{error}</p>}

          {result && (
            <div className="rounded-xl border border-[#4ade80]/20 bg-[#4ade80]/5 p-4">
              <p className="mb-3 text-sm font-medium text-[#4ade80]">{result.message}</p>
              {result.promoted.length > 0 && (
                <table className="w-full text-xs text-white/60">
                  <thead>
                    <tr className="text-left text-white/30">
                      <th className="pb-2">Listing</th>
                      <th className="pb-2">Bookings</th>
                      <th className="pb-2">Avg rating</th>
                      <th className="pb-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.promoted.map((p) => (
                      <tr key={p.listingId} className="border-t border-white/5">
                        <td className="py-1.5 pr-4">
                          <span className="text-white/80">{p.title}</span>
                          <br />
                          <span className="text-white/30">{p.companyName}</span>
                        </td>
                        <td className="py-1.5 pr-4">{p.completedBookings}</td>
                        <td className="py-1.5 pr-4">{p.avgRating.toFixed(2)}</td>
                        <td className="py-1.5">{p.score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <button
            onClick={run}
            disabled={running}
            className="flex items-center gap-2 rounded-full bg-[#1a2e1a] px-5 py-2.5 text-sm font-semibold text-[#4ade80] ring-1 ring-[#4ade80]/20 transition hover:bg-[#223322] disabled:opacity-50"
          >
            {running ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {running ? "Running…" : "Run auto-qualify"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminFeaturedPage() {
  const [entries, setEntries] = useState<FeaturedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [togglingId, setTogglingId] = useState("");

  async function loadEntries() {
    setLoading(true);
    try {
      const data = await apiFetch<{ entries: FeaturedEntry[] }>(
        `/api/admin/featured?active=${showAll ? "false" : "true"}`
      );
      setEntries(data.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load entries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  async function toggleActive(entry: FeaturedEntry) {
    setTogglingId(entry.id);
    try {
      await apiFetch(`/api/admin/featured/${entry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !entry.isActive }),
      });
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update entry.");
    } finally {
      setTogglingId("");
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Remove this featured entry?")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/admin/featured/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete entry.");
    } finally {
      setDeletingId("");
    }
  }

  const grouped = entries.reduce<Record<Pathway, FeaturedEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.pathway]) acc[entry.pathway] = [];
      acc[entry.pathway].push(entry);
      return acc;
    },
    { sponsored: [], top_rated: [], editors_choice: [] }
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminShell
        activePath="/admin/featured"
        title="Featured Section"
        description="Manage sponsored, top-rated, and editor's choice listings."
      >
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/50">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#ff5630]"
                />
                Show inactive / expired
              </label>
            </div>
            <AddEntryForm onCreated={loadEntries} />
          </div>

          {/* Auto-qualify */}
          <AutoQualifyPanel onDone={loadEntries} />

          {error && (
            <div className="rounded-[20px] border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
              {error}
            </div>
          )}

          {/* Entries by pathway */}
          {(["sponsored", "top_rated", "editors_choice"] as Pathway[]).map((pathway) => {
            const pathEntries = grouped[pathway];
            const { label } = PATHWAY_STYLES[pathway];

            return (
              <section key={pathway} className="space-y-4">
                <div className="flex items-center gap-2">
                  <PathwayPill pathway={pathway} />
                  <span className="text-sm text-white/35">{pathEntries.length} entr{pathEntries.length === 1 ? "y" : "ies"}</span>
                </div>

                {loading ? (
                  <div className="rounded-[20px] border border-white/10 bg-[#111111] p-5 text-sm text-white/40">
                    Loading {label.toLowerCase()} entries…
                  </div>
                ) : pathEntries.length === 0 ? (
                  <div className="rounded-[20px] border border-white/10 bg-[#111111] p-5 text-sm text-white/30">
                    No {label.toLowerCase()} entries.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pathEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-[20px] border bg-[#111111] p-4 transition ${
                          entry.isActive
                            ? "border-white/10"
                            : "border-white/5 opacity-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-white/85">
                                {entry.listing.title}
                              </span>
                              {!entry.isActive && (
                                <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/30">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-white/35">
                              {entry.listing.company.companyName} · {entry.listing.location}
                            </p>
                            <p className="mt-1 text-xs text-white/25">
                              {new Date(entry.startDate).toLocaleDateString()} –{" "}
                              {new Date(entry.endDate).toLocaleDateString()} · sort {entry.sortOrder}
                            </p>
                            {entry.justification && (
                              <p className="mt-1 text-xs italic text-white/35">
                                "{entry.justification}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              disabled={togglingId === entry.id}
                              onClick={() => toggleActive(entry)}
                              className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                                entry.isActive
                                  ? "bg-white/8 text-white/50 hover:bg-white/12"
                                  : "bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20"
                              }`}
                            >
                              {togglingId === entry.id
                                ? "…"
                                : entry.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              disabled={deletingId === entry.id}
                              onClick={() => deleteEntry(entry.id)}
                              className="rounded-full border border-white/8 p-1.5 text-white/30 transition hover:border-[#ff5630]/30 hover:text-[#ff5630] disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

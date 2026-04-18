"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/client-api";

interface GuideApplicant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface ApplicationRecord {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  destinations: string[];
  status: string;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  applicant: GuideApplicant;
  reviewedBy: { id: string; name: string } | null;
}

const STATUS_FILTERS = ["all", "pending", "approved", "rejected", "more_info"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-[#13283a] text-[#8dc9ff]",
  approved: "bg-[#0f2a1e] text-[#4ade80]",
  rejected: "bg-[#2d1714] text-[#ff8a78]",
  more_info: "bg-[#332913] text-[#ffca74]",
};

export default function AdminGuideApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminGuideApplicationsContent />
    </ProtectedRoute>
  );
}

function AdminGuideApplicationsContent() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    apiFetch<{ applications: ApplicationRecord[] }>("/api/admin/guide-applications")
      .then((payload) => {
        setApplications(payload.applications);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? applications
        : applications.filter((a) => a.status === statusFilter),
    [applications, statusFilter]
  );

  const counts = useMemo(
    () => ({
      all: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      more_info: applications.filter((a) => a.status === "more_info").length,
    }),
    [applications]
  );

  const review = async (
    id: string,
    status: "approved" | "rejected" | "more_info"
  ) => {
    setReviewingId(id);
    try {
      const payload = await apiFetch<{ application: ApplicationRecord }>(
        `/api/admin/guide-applications/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, reviewNotes: reviewNotes[id] ?? null }),
        }
      );
      setApplications((current) =>
        current.map((item) => (item.id === payload.application.id ? payload.application : item))
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review application.");
    } finally {
      setReviewingId("");
    }
  };

  return (
    <AdminShell
      activePath="/admin/guide-applications"
      title="Guide applications"
      description="Review, approve, or reject Community Guide applications. Approved applicants are promoted to the guide role and a public guide profile is created."
    >
      {error ? (
        <div className="mb-4 rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {(["pending", "approved", "rejected", "more_info"] as const).map((s) => (
          <div key={s} className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45 capitalize">{s.replace("_", " ")}</div>
            <div className="mt-2 text-3xl font-semibold">{counts[s]}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              statusFilter === f
                ? "bg-[#ff5630] text-white"
                : "border border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"
            }`}
          >
            <span className="capitalize">{f.replace("_", " ")}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${statusFilter === f ? "bg-white/20" : "bg-white/10"}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
            No {statusFilter === "all" ? "" : statusFilter.replace("_", " ")} applications.
          </div>
        ) : (
          filtered.map((app) => (
            <article
              key={app.id}
              className="rounded-[28px] border border-white/10 bg-[#111111] p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="font-semibold text-white text-lg">{app.applicant.name}</div>
                    <div className="text-sm text-white/50">{app.applicant.email}</div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status] ?? "bg-white/10 text-white/60"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/35 mb-1">Bio</div>
                    <p className="text-sm text-white/70 leading-6">{app.bio}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/35 mb-2">Expertise</div>
                      <div className="flex flex-wrap gap-1.5">
                        {app.expertise.map((e) => (
                          <span key={e} className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/35 mb-2">Destinations</div>
                      <div className="flex flex-wrap gap-1.5">
                        {app.destinations.map((d) => (
                          <span key={d} className="rounded-full bg-[#13283a] px-3 py-1 text-xs text-[#8dc9ff]">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {app.reviewNotes ? (
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                      <span className="text-white/35">Review note: </span>{app.reviewNotes}
                    </div>
                  ) : null}

                  <div className="text-xs text-white/35">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                    {app.reviewedBy ? ` · Reviewed by ${app.reviewedBy.name}` : ""}
                    {app.reviewedAt ? ` on ${new Date(app.reviewedAt).toLocaleDateString()}` : ""}
                  </div>
                </div>

                {app.status === "pending" || app.status === "more_info" ? (
                  <div className="flex flex-col gap-3 xl:w-[280px]">
                    <textarea
                      value={reviewNotes[app.id] ?? ""}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({ ...prev, [app.id]: e.target.value }))
                      }
                      placeholder="Review notes (optional)"
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-white/35 resize-none"
                    />
                    <button
                      disabled={reviewingId === app.id}
                      onClick={() => review(app.id, "approved")}
                      className="rounded-full bg-[#153220] px-4 py-3 text-sm font-semibold text-[#4ade80] ring-1 ring-[#4ade80]/20 disabled:opacity-50"
                    >
                      Approve — promote to guide
                    </button>
                    <button
                      disabled={reviewingId === app.id}
                      onClick={() => review(app.id, "more_info")}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 disabled:opacity-50"
                    >
                      Request more information
                    </button>
                    <button
                      disabled={reviewingId === app.id}
                      onClick={() => review(app.id, "rejected")}
                      className="rounded-full bg-[#2d1714] px-4 py-3 text-sm font-medium text-[#ff8a78] disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}

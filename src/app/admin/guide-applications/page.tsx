"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ActionButton from "@/components/admin/ActionButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatGrid from "@/components/admin/AdminStatGrid";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetch } from "@/lib/client-api";
import {
  CheckCircle2,
  Clock3,
  Mail,
  Search,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

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

function applicationTone(status: string) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "danger" as const;
  if (status === "more_info") return "warning" as const;
  return "pending" as const;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function AdminGuideApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="admin" surface="admin">
      <AdminGuideApplicationsContent />
    </ProtectedRoute>
  );
}

function AdminGuideApplicationsContent() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("pending");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    apiFetch<{ applications: ApplicationRecord[] }>("/api/admin/guide-applications")
      .then((payload) => {
        setApplications(payload.applications);
        setSelectedId((current) => current || payload.applications[0]?.id || "");
        setReviewNotes((current) => {
          const next = { ...current };
          payload.applications.forEach((application) => {
            next[application.id] = current[application.id] ?? application.reviewNotes ?? "";
          });
          return next;
        });
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "all" ? true : application.status === statusFilter;
      const matchesQuery = [
        application.applicant.name,
        application.applicant.email,
        application.bio,
        application.expertise.join(" "),
        application.destinations.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);

      return matchesStatus && matchesQuery;
    });
  }, [applications, query, statusFilter]);

  const counts = useMemo(
    () => ({
      all: applications.length,
      pending: applications.filter((application) => application.status === "pending").length,
      approved: applications.filter((application) => application.status === "approved").length,
      rejected: applications.filter((application) => application.status === "rejected").length,
      more_info: applications.filter((application) => application.status === "more_info").length,
    }),
    [applications]
  );

  const selectedApplication = useMemo(
    () => filtered.find((application) => application.id === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  );

  async function review(id: string, status: "approved" | "rejected" | "more_info") {
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
      setReviewNotes((current) => ({
        ...current,
        [payload.application.id]: payload.application.reviewNotes ?? current[payload.application.id] ?? "",
      }));
      setSelectedId(payload.application.id);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review application.");
    } finally {
      setReviewingId("");
    }
  }

  return (
    <AdminShell
      activePath="/admin/guide-applications"
      title="Guide applications"
      description="Review community guide applications, capture review notes, and approve or reject candidates."
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <AdminStatGrid>
        <AdminCard label="Pending review" value={loading ? "—" : counts.pending} icon={Clock3} tone="warning" />
        <AdminCard label="Approved" value={loading ? "—" : counts.approved} icon={CheckCircle2} tone="success" />
        <AdminCard label="Need more info" value={loading ? "—" : counts.more_info} icon={Mail} tone="info" />
        <AdminCard label="Rejected" value={loading ? "—" : counts.rejected} icon={XCircle} tone="danger" />
      </AdminStatGrid>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
          <div className="px-6 pt-5">
            <AdminSectionHeader
              title="Application queue"
              description="Filter by status, search applicants, and open a record for review."
            />
          </div>

          <div className="grid gap-4 px-6 py-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/25" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search applicant, expertise, destination, or bio"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white dark:placeholder:text-white/25"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <ActionButton
                  key={filter}
                  type="button"
                  size="sm"
                  variant={statusFilter === filter ? "primary" : "secondary"}
                  onClick={() => setStatusFilter(filter)}
                >
                  {formatStatus(filter)}
                  <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px] dark:bg-white/10">
                    {counts[filter]}
                  </span>
                </ActionButton>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            <AdminTable
              rows={filtered}
              rowKey={(row) => row.id}
              emptyState={
                loading ? (
                  "Loading applications..."
                ) : (
                  <AdminEmptyState
                    title="No applications found"
                    body="Try a different status filter or search term."
                  />
                )
              }
              columns={[
                {
                  key: "applicant",
                  header: "Applicant",
                  cell: (application: ApplicationRecord) => (
                    <div>
                      <div className="font-medium text-slate-950 dark:text-white">
                        {application.applicant.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-white/45">
                        {application.applicant.email}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "coverage",
                  header: "Coverage",
                  cell: (application: ApplicationRecord) => (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {application.destinations.slice(0, 2).map((destination) => (
                          <StatusBadge key={destination} tone="info">
                            {destination}
                          </StatusBadge>
                        ))}
                        {application.destinations.length > 2 ? (
                          <StatusBadge tone="neutral">
                            +{application.destinations.length - 2} more
                          </StatusBadge>
                        ) : null}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-white/45">
                        {application.expertise.slice(0, 2).join(" · ")}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "submitted",
                  header: "Submitted",
                  cell: (application: ApplicationRecord) =>
                    new Date(application.createdAt).toLocaleDateString(),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (application: ApplicationRecord) => (
                    <StatusBadge tone={applicationTone(application.status)}>
                      {formatStatus(application.status)}
                    </StatusBadge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (application: ApplicationRecord) => (
                    <ActionButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedId(application.id)}
                    >
                      Review
                    </ActionButton>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
          <div className="px-6 py-5">
            <AdminSectionHeader
              title={selectedApplication ? selectedApplication.applicant.name : "Review panel"}
              description={
                selectedApplication
                  ? "Use this panel to review the applicant profile and record a decision."
                  : "Select an application from the queue to review it."
              }
            />
          </div>

          <div className="border-t border-slate-200 px-6 py-6 dark:border-white/10">
            {!selectedApplication ? (
              <AdminEmptyState
                title="No application selected"
                body="Choose a record from the application queue to start review."
              />
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge tone={applicationTone(selectedApplication.status)}>
                      {formatStatus(selectedApplication.status)}
                    </StatusBadge>
                    <span className="text-sm text-slate-500 dark:text-white/45">
                      Applied {new Date(selectedApplication.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 dark:text-white/80">
                    {selectedApplication.bio}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                    Expertise
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.expertise.map((item) => (
                      <StatusBadge key={item} tone="neutral">
                        {item}
                      </StatusBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                    Destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.destinations.map((item) => (
                      <StatusBadge key={item} tone="info">
                        {item}
                      </StatusBadge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                      Applicant email
                    </div>
                    <div className="mt-1">{selectedApplication.applicant.email}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                      Last review
                    </div>
                    <div className="mt-1">
                      {selectedApplication.reviewedBy
                        ? `${selectedApplication.reviewedBy.name} · ${
                            selectedApplication.reviewedAt
                              ? new Date(selectedApplication.reviewedAt).toLocaleDateString()
                              : "Not dated"
                          }`
                        : "Not reviewed yet"}
                    </div>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-white/40">
                    Review notes
                  </span>
                  <textarea
                    value={reviewNotes[selectedApplication.id] ?? ""}
                    onChange={(event) =>
                      setReviewNotes((current) => ({
                        ...current,
                        [selectedApplication.id]: event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Add internal notes for this decision."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white dark:placeholder:text-white/25"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    type="button"
                    variant="primary"
                    disabled={reviewingId === selectedApplication.id}
                    onClick={() => review(selectedApplication.id, "approved")}
                  >
                    <UserRoundCheck className="h-4 w-4" />
                    {reviewingId === selectedApplication.id ? "Saving..." : "Approve"}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="secondary"
                    disabled={reviewingId === selectedApplication.id}
                    onClick={() => review(selectedApplication.id, "more_info")}
                  >
                    Request more info
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="danger"
                    disabled={reviewingId === selectedApplication.id}
                    onClick={() => review(selectedApplication.id, "rejected")}
                  >
                    Reject
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

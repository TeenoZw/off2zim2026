"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiFetch } from "@/lib/client-api";
import type { DisputeRecord } from "@/types/platform";

export default function AdminDisputesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDisputesContent />
    </ProtectedRoute>
  );
}

function AdminDisputesContent() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});

  const loadDisputes = async () => {
    try {
      const payload = await apiFetch<{ disputes: DisputeRecord[] }>("/api/admin/disputes");
      setDisputes(payload.disputes);
      setResolutionDrafts((current) => {
        const next = { ...current };
        payload.disputes.forEach((dispute) => {
          next[dispute.id] = current[dispute.id] ?? dispute.resolution ?? "";
        });
        return next;
      });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load disputes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const filteredDisputes = useMemo(() => {
    const normalized = query.toLowerCase();
    return disputes.filter((dispute) =>
      [
        dispute.bookingConfirmationNumber,
        dispute.reason,
        dispute.status,
        dispute.openedBy.name,
        dispute.openedBy.email,
        dispute.provider?.companyName || "",
        dispute.listing?.title || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [disputes, query]);

  const openCount = disputes.filter((dispute) =>
    ["open", "under_review"].includes(dispute.status)
  ).length;

  const resolvedCount = disputes.filter((dispute) =>
    ["resolved", "closed"].includes(dispute.status)
  ).length;

  const handleUpdateDispute = async (
    dispute: DisputeRecord,
    status: "open" | "under_review" | "resolved" | "closed",
    assignToMe = false
  ) => {
    setUpdatingId(dispute.id);
    try {
      const payload = await apiFetch<{ dispute: DisputeRecord }>(
        `/api/admin/disputes/${dispute.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            resolution: resolutionDrafts[dispute.id] || null,
            assignToMe,
          }),
        }
      );
      setDisputes((current) =>
        current.map((item) => (item.id === payload.dispute.id ? payload.dispute : item))
      );
      setResolutionDrafts((current) => ({
        ...current,
        [payload.dispute.id]: payload.dispute.resolution ?? "",
      }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update dispute.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dispute operations</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/60">
              Trust-and-safety queue for booking escalations, provider conflicts,
              and traveler resolution work tied directly to live booking records.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/providers"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
            >
              Provider reviews
            </Link>
            <Link
              href="/admin/bookings"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
            >
              Bookings
            </Link>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Disputes
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Open queue</div>
            <div className="mt-2 text-3xl font-semibold">{openCount}</div>
            <div className="mt-2 text-sm text-white/55">
              Waiting for review or still in progress
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Resolved</div>
            <div className="mt-2 text-3xl font-semibold">{resolvedCount}</div>
            <div className="mt-2 text-sm text-white/55">
              Fully documented and closed out
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <div className="text-sm text-white/45">Total disputes</div>
            <div className="mt-2 text-3xl font-semibold">{disputes.length}</div>
            <div className="mt-2 text-sm text-white/55">
              All escalations linked to bookings
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/10 bg-[#111111] p-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search disputes, booking refs, providers, or travelers"
            className="w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-white/35"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              Loading dispute queue...
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white/60">
              No disputes match the current search.
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <article
                key={dispute.id}
                className="rounded-[28px] border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">{dispute.reason}</h2>
                      <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                        {dispute.status.replace(/_/g, " ")}
                      </span>
                      <span className="rounded-full bg-[#13283a] px-3 py-1 text-xs font-medium text-[#8dc9ff]">
                        {dispute.bookingConfirmationNumber}
                      </span>
                    </div>

                    <div className="mt-3 text-sm leading-6 text-white/65">
                      {dispute.details || "No additional details were provided."}
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-white/55 md:grid-cols-4">
                      <div>
                        <div className="text-white/35">Traveler</div>
                        <div>{dispute.openedBy.name}</div>
                        <div>{dispute.openedBy.email}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Provider</div>
                        <div>{dispute.provider?.companyName || "Off2Zim"}</div>
                        <div>{dispute.listing?.title || "General booking issue"}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Assigned admin</div>
                        <div>{dispute.assignedAdmin?.name || "Unassigned"}</div>
                        <div>{dispute.assignedAdmin?.email || "Claim this case below"}</div>
                      </div>
                      <div>
                        <div className="text-white/35">Created</div>
                        <div>{new Date(dispute.createdAt).toLocaleDateString()}</div>
                        <div>
                          {dispute.resolvedAt
                            ? `Resolved ${new Date(dispute.resolvedAt).toLocaleDateString()}`
                            : "Still active"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 text-sm text-white/45">Resolution notes</div>
                      <textarea
                        value={resolutionDrafts[dispute.id] || ""}
                        onChange={(event) =>
                          setResolutionDrafts((current) => ({
                            ...current,
                            [dispute.id]: event.target.value,
                          }))
                        }
                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white"
                        placeholder="Capture findings, refund decisions, follow-up actions, and closure notes."
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:w-[320px] xl:grid-cols-1">
                    <button
                      type="button"
                      disabled={updatingId === dispute.id}
                      onClick={() =>
                        handleUpdateDispute(dispute, dispute.status as "open" | "under_review" | "resolved" | "closed", true)
                      }
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75 disabled:opacity-60"
                    >
                      {dispute.assignedAdmin ? "Reassign to me" : "Assign to me"}
                    </button>
                    <select
                      value={dispute.status}
                      disabled={updatingId === dispute.id}
                      onChange={(event) =>
                        handleUpdateDispute(
                          dispute,
                          event.target.value as "open" | "under_review" | "resolved" | "closed"
                        )
                      }
                      className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white"
                    >
                      <option value="open">Open</option>
                      <option value="under_review">Under review</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      type="button"
                      disabled={updatingId === dispute.id}
                      onClick={() => handleUpdateDispute(dispute, "under_review", true)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75 disabled:opacity-60"
                    >
                      Start review
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === dispute.id}
                      onClick={() => handleUpdateDispute(dispute, "resolved")}
                      className="rounded-full border border-[#8cf0a1]/20 bg-[#153220] px-4 py-3 text-sm font-medium text-[#8cf0a1] disabled:opacity-60"
                    >
                      Resolve case
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

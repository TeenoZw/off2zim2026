"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ActionButton, {
  actionButtonVariants,
} from "@/components/admin/ActionButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatGrid from "@/components/admin/AdminStatGrid";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetch } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { ProviderCompanyRecord } from "@/types/platform";
import { BadgeCheck, Building2, FileText, ShieldCheck } from "lucide-react";

function providerTone(status: string) {
  if (status === "basic_approved") return "success" as const;
  if (status === "changes_requested") return "danger" as const;
  if (status === "submitted") return "pending" as const;
  return "neutral" as const;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function AdminProvidersPage() {
  return (
    <ProtectedRoute requiredRole="admin" surface="admin">
      <AdminProvidersContent />
    </ProtectedRoute>
  );
}

function AdminProvidersContent() {
  const [providers, setProviders] = useState<ProviderCompanyRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [internalSummary, setInternalSummary] = useState("");
  const [status, setStatus] = useState<
    "basic_approved" | "changes_requested" | "verified_premium"
  >("basic_approved");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProviders = async () => {
    try {
      const payload = await apiFetch<{ providers: ProviderCompanyRecord[] }>(
        "/api/admin/providers"
      );
      setProviders(payload.providers);
      setSelectedId((current) => current || payload.providers[0]?.id || "");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === selectedId) || null,
    [providers, selectedId]
  );

  const stats = useMemo(
    () => ({
      total: providers.length,
      pending: providers.filter((provider) => provider.onboardingStatus === "submitted")
        .length,
      approved: providers.filter((provider) => provider.onboardingStatus === "basic_approved")
        .length,
      changesRequested: providers.filter(
        (provider) => provider.onboardingStatus === "changes_requested"
      ).length,
    }),
    [providers]
  );

  const submitReview = async () => {
    if (!selectedProvider || !notes.trim()) {
      setError("Add review notes before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = await apiFetch<{ company: ProviderCompanyRecord }>(
        `/api/admin/providers/${selectedProvider.id}/review`,
        {
          method: "POST",
          body: JSON.stringify({
            status,
            notes,
            internalSummary,
          }),
        }
      );

      setProviders((current) =>
        current.map((provider) =>
          provider.id === payload.company.id ? payload.company : provider
        )
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      activePath="/admin/providers"
      title="Providers"
      description="Review onboarding submissions, verify company details, and approve or reject provider access."
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <AdminStatGrid>
        <AdminCard label="Total providers" value={loading ? "—" : stats.total} icon={Building2} />
        <AdminCard
          label="Pending"
          value={loading ? "—" : stats.pending}
          icon={FileText}
          tone="warning"
        />
        <AdminCard
          label="Approved"
          value={loading ? "—" : stats.approved}
          icon={BadgeCheck}
          tone="success"
        />
        <AdminCard
          label="Changes requested"
          value={loading ? "—" : stats.changesRequested}
          icon={ShieldCheck}
          tone="danger"
        />
      </AdminStatGrid>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#101010]">
          <div className="px-6 pt-5">
            <AdminSectionHeader
              title="Provider verification queue"
              description="Company submissions, onboarding status, and verification readiness."
            />
          </div>
          <div className="px-6 pb-6 pt-4">
            <AdminTable
              columns={[
                {
                  key: "company",
                  header: "Company name",
                  cell: (provider: ProviderCompanyRecord) => (
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedId(provider.id)}
                        className="font-medium text-slate-950 hover:text-[#ff5630] dark:text-white"
                      >
                        {provider.companyName}
                      </button>
                      <div className="mt-1 text-xs text-slate-500 dark:text-white/45">
                        {provider.businessCategory || "Category pending"}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (provider: ProviderCompanyRecord) => (
                    <StatusBadge tone={providerTone(provider.onboardingStatus)}>
                      {formatStatus(provider.onboardingStatus)}
                    </StatusBadge>
                  ),
                },
                {
                  key: "submitted",
                  header: "Date submitted",
                  cell: (provider: ProviderCompanyRecord) =>
                    provider.reviewSubmittedAt
                      ? new Date(provider.reviewSubmittedAt).toLocaleDateString()
                      : "Not submitted",
                },
                {
                  key: "actions",
                  header: "Actions",
                  cell: (provider: ProviderCompanyRecord) => (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(provider.id)}
                        className={cn(actionButtonVariants({ variant: "secondary", size: "sm" }))}
                      >
                        View details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(provider.id);
                          setStatus("basic_approved");
                        }}
                        className={cn(actionButtonVariants({ variant: "primary", size: "sm" }))}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(provider.id);
                          setStatus("changes_requested");
                        }}
                        className={cn(actionButtonVariants({ variant: "danger", size: "sm" }))}
                      >
                        Reject
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={providers}
              rowKey={(provider) => provider.id}
              emptyState="No provider submissions found."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101010]">
          <AdminSectionHeader
            title="Provider details"
            description="Selected provider profile, documents, and review decision."
          />

          <div className="mt-4">
            {!selectedProvider ? (
              <AdminEmptyState
                title="No provider selected"
                body="Select a provider from the table to review documents and submit a decision."
              />
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-slate-950 dark:text-white">
                        {selectedProvider.companyName}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-white/45">
                        {selectedProvider.businessDescription || "No business description provided."}
                      </div>
                    </div>
                    <StatusBadge tone={providerTone(selectedProvider.onboardingStatus)}>
                      {formatStatus(selectedProvider.onboardingStatus)}
                    </StatusBadge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail label="Contact person" value={selectedProvider.mainContactPerson} />
                  <Detail label="Business email" value={selectedProvider.businessEmail} />
                  <Detail label="Business phone" value={selectedProvider.businessPhone} />
                  <Detail label="Registration number" value={selectedProvider.businessRegistrationNumber} />
                  <Detail label="Address" value={selectedProvider.physicalAddress} />
                  <Detail label="Verification tier" value={formatStatus(selectedProvider.verificationTier)} />
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-700 dark:text-white/80">
                    Documents
                  </div>
                  {selectedProvider.documents.length === 0 ? (
                    <AdminEmptyState title="No documents uploaded" />
                  ) : (
                    selectedProvider.documents.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium text-slate-950 dark:text-white">
                              {document.type}
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-white/45">
                              {document.fileName}
                            </div>
                          </div>
                          <StatusBadge tone={providerTone(document.status)}>
                            {formatStatus(document.status)}
                          </StatusBadge>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="text-sm font-medium text-slate-700 dark:text-white/80">
                    Review decision
                  </div>
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as
                          | "basic_approved"
                          | "changes_requested"
                          | "verified_premium"
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white"
                  >
                    <option value="basic_approved">Approve</option>
                    <option value="changes_requested">Reject / request changes</option>
                    <option value="verified_premium">Approve verified / premium</option>
                  </select>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white"
                    placeholder="Review notes"
                  />
                  <textarea
                    value={internalSummary}
                    onChange={(event) => setInternalSummary(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white"
                    placeholder="Internal summary"
                  />
                  <div className="flex flex-wrap gap-2">
                    <ActionButton variant="primary" onClick={submitReview} disabled={saving}>
                      {saving ? "Saving..." : "Save decision"}
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={() => {
                        setNotes("");
                        setInternalSummary("");
                      }}
                      disabled={saving}
                    >
                      Clear notes
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-white/35">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-900 dark:text-white">{value || "Not provided"}</div>
    </div>
  );
}

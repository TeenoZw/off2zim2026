"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { apiFetch } from "@/lib/client-api";
import type { ProviderCompanyRecord } from "@/types/platform";

export default function AdminProvidersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
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
      setNotes("");
      setInternalSummary("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Provider onboarding review</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/60">
                Internal operations workspace for Off2Zim to verify legitimacy, approve
                suppliers, and manage the PRD’s provider onboarding pipeline.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                Provider reviews
              </div>
              <Link
                href="/admin/bookings"
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
              >
                Bookings
              </Link>
              <Link
                href="/admin/disputes"
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
              >
                Disputes
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <h2 className="text-xl font-semibold">Submitted providers</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                  Loading provider submissions...
                </div>
              ) : providers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                  No provider submissions found yet.
                </div>
              ) : (
                providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedId(provider.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      provider.id === selectedId
                        ? "border-[#ff5630]/60 bg-[#201411]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{provider.companyName}</h3>
                        <p className="mt-1 text-sm text-white/55">
                          {provider.businessCategory || "Category pending"}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/55">
                        {provider.onboardingStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-white/40">
                      {provider.documents.length} docs, {provider.listingStats?.total || 0} listings
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
            {selectedProvider ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedProvider.companyName}</h2>
                    <p className="mt-2 text-sm text-white/60">
                      {selectedProvider.businessDescription || "No business description submitted yet."}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55">
                    {selectedProvider.verificationTier.replace(/_/g, " ")}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Info label="Contact person" value={selectedProvider.mainContactPerson} />
                  <Info label="Business email" value={selectedProvider.businessEmail} />
                  <Info label="Business phone" value={selectedProvider.businessPhone} />
                  <Info label="Address" value={selectedProvider.physicalAddress} />
                  <Info
                    label="Registration number"
                    value={selectedProvider.businessRegistrationNumber}
                  />
                  <Info label="Submitted docs" value={`${selectedProvider.documents.length}`} />
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold">Documents</h3>
                    <div className="mt-3 space-y-2">
                      {selectedProvider.documents.length > 0 ? (
                        selectedProvider.documents.map((document) => (
                          <div
                            key={document.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/65"
                          >
                            {document.type}: {document.fileName}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/45">
                          No documents uploaded.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Services</h3>
                    <div className="mt-3 space-y-2">
                      {selectedProvider.servicesOffered.length > 0 ? (
                        selectedProvider.servicesOffered.map((service) => (
                          <div
                            key={service}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/65"
                          >
                            {service}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/45">
                          No service categories added.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-lg font-semibold">Review decision</h3>
                  <div className="mt-4 grid gap-4">
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
                      className="rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white"
                    >
                      <option value="basic_approved">Approve basic review</option>
                      <option value="changes_requested">Request changes</option>
                      <option value="verified_premium">Approve verified / premium</option>
                    </select>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="min-h-28 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white"
                      placeholder="Notes visible to internal operators and future reviewers."
                    />
                    <textarea
                      value={internalSummary}
                      onChange={(event) => setInternalSummary(event.target.value)}
                      className="min-h-24 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white"
                      placeholder="Optional internal summary for compliance, fairness, and audit history."
                    />
                    <button
                      onClick={submitReview}
                      disabled={saving}
                      className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving review..." : "Save review decision"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/55">
                Select a provider submission to review.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-2 text-sm text-white/70">{value}</p>
    </div>
  );
}

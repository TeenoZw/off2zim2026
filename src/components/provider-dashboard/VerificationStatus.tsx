"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Badge,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Shield,
} from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { ProviderCompanyRecord } from "@/types/platform";

export default function VerificationStatus() {
  const [company, setCompany] = useState<ProviderCompanyRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCompany = async () => {
    try {
      const payload = await apiFetch<{ company: ProviderCompanyRecord }>(
        "/api/provider/company"
      );
      setCompany(payload.company);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load verification status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const steps = useMemo(() => {
    if (!company) {
      return [];
    }

    const hasDocuments = company.documents.length > 0;
    const reviewStatus = company.verificationReviews[0]?.status;

    return [
      {
        title: "Core company profile",
        description: "Required company identity and contact information is stored.",
        status: company.companyName && company.businessEmail ? "completed" : "not-started",
        tier: "Basic",
      },
      {
        title: "Business documents",
        description: "Registration, tax, insurance, or other legitimacy documents uploaded.",
        status: hasDocuments ? "completed" : "pending",
        tier: "Basic",
      },
      {
        title: "Internal legitimacy review",
        description: "Off2Zim admin review before any listing is fully trusted.",
        status:
          company.onboardingStatus === "basic_approved"
            ? "completed"
            : company.onboardingStatus === "submitted"
              ? "in-review"
              : reviewStatus === "changes_requested"
                ? "pending"
                : "not-started",
        tier: "Basic",
      },
      {
        title: "Verified / Premium Partner badge",
        description: "Enhanced vetting for featured placement and premium trust signals.",
        status: company.verificationTier === "verified_premium" ? "completed" : "not-started",
        tier: "Premium",
      },
    ];
  }, [company]);

  const progress = useMemo(() => {
    if (steps.length === 0) return 0;
    const completed = steps.filter((step) => step.status === "completed").length;
    return Math.round((completed / steps.length) * 100);
  }, [steps]);

  const submitForReview = async () => {
    setSubmitting(true);
    try {
      const payload = await apiFetch<{ company: ProviderCompanyRecord }>(
        "/api/provider/company/review",
        {
          method: "POST",
        }
      );
      setCompany(payload.company);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit for review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white">
        Loading verification status...
      </section>
    );
  }

  if (error && !company) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white">
        {error}
      </section>
    );
  }

  const statusUI = (status: string) => {
    if (status === "completed") {
      return {
        icon: <CheckCircle className="h-4 w-4 text-[#8cf0a1]" />,
        pill: "bg-[#153220] text-[#8cf0a1]",
        label: "Completed",
      };
    }
    if (status === "in-review") {
      return {
        icon: <Clock className="h-4 w-4 text-[#ffca74]" />,
        pill: "bg-[#332913] text-[#ffca74]",
        label: "In review",
      };
    }
    if (status === "pending") {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-[#ff8a63]" />,
        pill: "bg-[#2d1714] text-[#ff8a63]",
        label: "Pending",
      };
    }
    return {
      icon: <FileText className="h-4 w-4 text-white/45" />,
      pill: "bg-white/10 text-white/60",
      label: "Not started",
    };
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#13283a] p-3">
                <Badge className="h-5 w-5 text-[#8dc9ff]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Verification status</h2>
                <p className="text-sm text-white/50">Provider onboarding aligned to the PRD</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm text-white/55">
                <span>Overall progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#ff5630]" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Metric label="Uploaded docs" value={`${company?.documents.length || 0}`} />
              <Metric
                label="Reviews"
                value={`${company?.verificationReviews.length || 0}`}
              />
              <Metric label="Tier" value={company?.verificationTier === "verified_premium" ? "Premium" : "Basic"} />
            </div>

            <button
              onClick={submitForReview}
              disabled={submitting || company?.onboardingStatus === "submitted"}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {company?.onboardingStatus === "submitted"
                ? "Review submitted"
                : submitting
                  ? "Submitting..."
                  : "Submit for admin review"}
              <ChevronRight className="h-4 w-4" />
            </button>
            {error ? <p className="mt-3 text-sm text-[#ff8a63]">{error}</p> : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-lg font-semibold text-white">What the next tier unlocks</h3>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>Eligibility for featured listings and promotional campaigns</p>
              <p>Stronger trust signal on public listing pages</p>
              <p>Better visibility across curated Off2Zim placements</p>
              <p>A clearer internal review trail for compliance and auditability</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <h2 className="text-2xl font-semibold text-white">Tier progress</h2>
          <div className="mt-6 space-y-5">
            <TierRow
              label="Basic"
              value={Math.min(progress, 75)}
              tone="bg-[#8cf0a1]"
              icon={<FileText className="h-4 w-4 text-[#8cf0a1]" />}
            />
            <TierRow
              label="Verified"
              value={company?.onboardingStatus === "basic_approved" ? 100 : progress}
              tone="bg-[#8dc9ff]"
              icon={<Badge className="h-4 w-4 text-[#8dc9ff]" />}
            />
            <TierRow
              label="Premium"
              value={company?.verificationTier === "verified_premium" ? 100 : 0}
              tone="bg-[#ff8a63]"
              icon={<Shield className="h-4 w-4 text-[#ff8a63]" />}
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <h2 className="text-2xl font-semibold text-white">Verification steps</h2>
          <div className="mt-6 space-y-3">
            {steps.map((step) => {
              const ui = statusUI(step.status);
              return (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.05]">
                        {ui.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <p className="mt-1 text-sm text-white/55">{step.description}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/35">
                          {step.tier}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${ui.pill}`}>
                      {ui.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-center">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/45">{label}</div>
    </div>
  );
}

function TierRow({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-white/75">
          {icon}
          {label}
        </div>
        <span className="text-white/55">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  AlertTriangle,
  Badge,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Shield,
} from "lucide-react";

export default function VerificationStatus() {
  const steps = [
    {
      title: "Business registration",
      description: "Valid business registration documents",
      status: "completed",
      tier: "Basic",
    },
    {
      title: "Identity verification",
      description: "Government-issued ID verification",
      status: "completed",
      tier: "Basic",
    },
    {
      title: "Insurance coverage",
      description: "Public liability insurance documentation",
      status: "completed",
      tier: "Verified",
    },
    {
      title: "Location verification",
      description: "Physical location and premises verification",
      status: "in-review",
      tier: "Verified",
    },
    {
      title: "Safety certification",
      description: "Tourism safety and quality standards",
      status: "pending",
      tier: "Verified",
    },
    {
      title: "Quality assessment",
      description: "Professional quality evaluation and premium review",
      status: "not-started",
      tier: "Premium",
    },
  ];

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
                <h2 className="text-2xl font-semibold text-white">Verified status</h2>
                <p className="text-sm text-white/50">Your current verification level</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm text-white/55">
                <span>Overall progress</span>
                <span>75%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[75%] rounded-full bg-[#ff5630]" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Metric label="Uploaded" value="5" />
              <Metric label="Pending" value="2" />
              <Metric label="Required" value="7" />
            </div>

            <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
              Upgrade to Premium
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-lg font-semibold text-white">What you unlock next</h3>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>Priority search placement</p>
              <p>Featured listing eligibility</p>
              <p>Advanced analytics and insights</p>
              <p>Priority customer support</p>
              <p>Revenue optimization tools</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <h2 className="text-2xl font-semibold text-white">Tier progress</h2>
          <div className="mt-6 space-y-5">
            <TierRow label="Basic" value={100} tone="bg-[#8cf0a1]" icon={<FileText className="h-4 w-4 text-[#8cf0a1]" />} />
            <TierRow label="Verified" value={75} tone="bg-[#8dc9ff]" icon={<Badge className="h-4 w-4 text-[#8dc9ff]" />} />
            <TierRow label="Premium" value={0} tone="bg-[#ff8a63]" icon={<Shield className="h-4 w-4 text-[#ff8a63]" />} />
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

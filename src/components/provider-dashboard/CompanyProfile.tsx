"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  Tag,
} from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { ProviderCompanyRecord } from "@/types/platform";

export default function CompanyProfile() {
  const [company, setCompany] = useState<ProviderCompanyRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const payload = await apiFetch<{ company: ProviderCompanyRecord }>(
          "/api/provider/company"
        );
        setCompany(payload.company);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load company profile.");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  if (loading) {
    return <PanelMessage title="Loading company profile" body="Pulling the latest onboarding and company details." />;
  }

  if (error || !company) {
    return (
      <PanelMessage
        title="Company profile unavailable"
        body={error || "No provider company profile was found for this account."}
      />
    );
  }

  const profileSignals = [
    company.businessCategory || "No category selected yet",
    company.onboardingStatus.replace(/_/g, " "),
    company.verificationTier.replace(/_/g, " "),
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{company.companyName}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              {company.businessDescription ||
                "Complete the business description in onboarding to explain what makes this service provider trustworthy and distinctive."}
            </p>
          </div>
          <div className="rounded-full border border-[#ff5630]/30 bg-[#2d1714] px-4 py-2 text-sm font-medium text-[#ffb09c]">
            {company.verificationTier === "verified_premium"
              ? "Verified / Premium Partner"
              : "Basic Review Track"}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#13283a]">
                <Building2 className="h-7 w-7 text-[#8dc9ff]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white">
                  {company.tradingName || company.companyName}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileSignals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={<MapPin className="h-4 w-4 text-[#ff7352]" />}
                text={company.physicalAddress}
              />
              <InfoTile
                icon={<Phone className="h-4 w-4 text-[#8cf0a1]" />}
                text={company.businessPhone}
              />
              <InfoTile
                icon={<Mail className="h-4 w-4 text-[#ffca74]" />}
                text={company.businessEmail}
              />
              <InfoTile
                icon={<Globe className="h-4 w-4 text-[#8dc9ff]" />}
                text={company.websiteUrl || "Website not set"}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat
              label="Listings"
              value={`${company.listingStats?.total || 0}`}
              icon={<Tag className="h-4 w-4 text-[#ffc247]" />}
            />
            <Stat
              label="Active listings"
              value={`${company.listingStats?.active || 0}`}
              icon={<Shield className="h-4 w-4 text-[#8dc9ff]" />}
            />
            <Stat
              label="Bookings"
              value={`${company.bookingStats?.total || 0}`}
              icon={<FileText className="h-4 w-4 text-[#8cf0a1]" />}
            />
            <Stat
              label="Documents"
              value={`${company.documents.length}`}
              icon={<Building2 className="h-4 w-4 text-[#ff8a63]" />}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <CardBlock title="Services offered">
          {company.servicesOffered.length > 0 ? (
            company.servicesOffered.map((item) => (
              <p key={item} className="text-sm text-white/60">
                {item}
              </p>
            ))
          ) : (
            <p className="text-sm text-white/45">No services added yet.</p>
          )}
        </CardBlock>
        <CardBlock title="Coverage">
          {company.serviceAreas.length > 0 ? (
            company.serviceAreas.map((item) => (
              <p key={item} className="text-sm text-white/60">
                {item}
              </p>
            ))
          ) : (
            <p className="text-sm text-white/45">Service areas have not been defined yet.</p>
          )}
        </CardBlock>
        <CardBlock title="Documents on file">
          {company.documents.length > 0 ? (
            company.documents.map((document) => (
              <p key={document.id} className="text-sm text-white/60">
                {document.type}: {document.status}
              </p>
            ))
          ) : (
            <p className="text-sm text-white/45">No verification documents uploaded yet.</p>
          )}
        </CardBlock>
      </section>
    </div>
  );
}

function PanelMessage({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{body}</p>
    </section>
  );
}

function InfoTile({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#141414] p-4 text-sm text-white/70">
      <div className="flex items-center gap-3">
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#111111] p-5">
      <div className="flex items-center gap-2 text-sm text-white/45">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function CardBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

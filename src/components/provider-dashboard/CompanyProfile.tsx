"use client";

import React from "react";
import {
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
} from "lucide-react";

export default function CompanyProfile() {
  const highlights = [
    "Adventure tours",
    "Scenic flights",
    "River cruises",
    "Wildlife safaris",
  ];

  const certifications = [
    "Tourism Operator License",
    "Aviation Safety Certificate",
    "First Aid Certification",
  ];

  const policies = [
    "Free cancellation up to 24 hours before start time",
    "Full refund for weather-related cancellations",
    "Safety equipment provided where required",
    "Insurance coverage included",
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Company profile</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              This view now presents the provider profile more like a polished business
              storefront rather than a raw admin form.
            </p>
          </div>
          <button className="rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
            Edit profile
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#13283a]">
                <Building2 className="h-7 w-7 text-[#8dc9ff]" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Victoria Falls Adventure Co.
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  Premier adventure tour operator specializing in Victoria Falls
                  experiences with a focus on safety, sustainability, and memorable
                  traveler moments.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={<MapPin className="h-4 w-4 text-[#ff7352]" />} text="Victoria Falls, Matabeleland North" />
              <InfoTile icon={<Phone className="h-4 w-4 text-[#8cf0a1]" />} text="+263 13 44321" />
              <InfoTile icon={<Mail className="h-4 w-4 text-[#ffca74]" />} text="info@vfadventure.co.zw" />
              <InfoTile icon={<Globe className="h-4 w-4 text-[#8dc9ff]" />} text="vfadventure.co.zw" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Rating" value="4.8" icon={<Star className="h-4 w-4 text-[#ffc247]" />} />
            <Stat label="Reviews" value="156" icon={<Users className="h-4 w-4 text-[#8dc9ff]" />} />
            <Stat label="Bookings completed" value="892" icon={<FileText className="h-4 w-4 text-[#8cf0a1]" />} />
            <Stat label="Verification" value="Verified" icon={<Shield className="h-4 w-4 text-[#ff8a63]" />} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <CardBlock title="Service focus">
          {highlights.map((item) => (
            <p key={item} className="text-sm text-white/60">
              {item}
            </p>
          ))}
        </CardBlock>
        <CardBlock title="Certifications">
          {certifications.map((item) => (
            <p key={item} className="text-sm text-white/60">
              {item}
            </p>
          ))}
        </CardBlock>
        <CardBlock title="Policies">
          {policies.map((item) => (
            <p key={item} className="text-sm text-white/60">
              {item}
            </p>
          ))}
        </CardBlock>
      </section>
    </div>
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

"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { portalLinks, portalMeta } from "@/lib/surface-config";

const adminMeta = portalMeta.admin;
const adminLinks = portalLinks.admin;

export default function AdminShell({
  activePath,
  title,
  description,
  actions,
  children,
}: {
  activePath: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="theme-panel rounded-[32px] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="theme-label text-xs uppercase tracking-[0.24em]">
                {adminMeta.label}
              </div>
              <h1 className="theme-heading mt-3 text-3xl font-semibold">{title}</h1>
              <p className="theme-muted mt-3 max-w-3xl text-sm leading-6">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </section>

        <nav className="theme-panel rounded-[28px] p-3">
          <div className="flex flex-wrap gap-2">
            {adminLinks.map((link) => {
              const isActive =
                activePath === link.href || activePath.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#ff5630] text-white"
                      : "border border-black/10 bg-black/[0.03] text-black/72 hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/78 dark:hover:bg-white/[0.08]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}

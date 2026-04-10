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
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="theme-panel h-fit rounded-[32px] p-5 xl:sticky xl:top-24">
          <div className="border-b border-black/8 pb-5 dark:border-white/8">
            <div className="theme-label text-xs uppercase tracking-[0.24em]">
              {adminMeta.label}
            </div>
            <h2 className="theme-heading mt-3 text-2xl font-semibold">
              {adminMeta.title}
            </h2>
            <p className="theme-muted mt-3 text-sm leading-6">{adminMeta.description}</p>
          </div>

          <nav className="mt-5 space-y-5">
            {Array.from(new Set(adminLinks.map((link) => link.section || "Workspace"))).map(
              (section) => (
                <div key={section}>
                  <div className="theme-label px-2 text-[11px] uppercase tracking-[0.22em]">
                    {section}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {adminLinks
                      .filter((link) => (link.section || "Workspace") === section)
                      .map((link) => {
                        const isActive =
                          activePath === link.href || activePath.startsWith(`${link.href}/`);
                        const Icon = link.icon;

                        return (
                          <Link
                            key={`${section}-${link.href}`}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                              isActive
                                ? "bg-[#ff5630] text-white shadow-[0_18px_40px_-28px_rgba(255,86,48,0.8)]"
                                : "text-black/72 hover:bg-black/[0.05] dark:text-white/78 dark:hover:bg-white/[0.07]"
                            }`}
                          >
                            {Icon ? <Icon className="h-4 w-4" /> : null}
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )
            )}
          </nav>
        </aside>

        <div className="space-y-6">
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

          {children}
        </div>
      </div>
    </div>
  );
}

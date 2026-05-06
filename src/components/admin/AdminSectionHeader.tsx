"use client";

import { ReactNode } from "react";

type AdminSectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function AdminSectionHeader({
  title,
  description,
  action,
}: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-white/45">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}

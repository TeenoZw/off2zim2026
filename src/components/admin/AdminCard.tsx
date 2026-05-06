"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
};

const toneMap = {
  default: "bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-white/80",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-500/12 dark:text-rose-300",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-500/12 dark:text-sky-300",
};

export default function AdminCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
  className,
}: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101010]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-500 dark:text-white/45">
            {label}
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </div>
          {detail ? (
            <div className="text-sm text-slate-500 dark:text-white/45">{detail}</div>
          ) : null}
        </div>
        {Icon ? (
          <div className={cn("rounded-xl p-2.5", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

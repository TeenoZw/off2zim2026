"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        success:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300",
        pending:
          "bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300",
        danger:
          "bg-rose-50 text-rose-700 dark:bg-rose-500/12 dark:text-rose-300",
        warning:
          "bg-orange-50 text-orange-700 dark:bg-orange-500/12 dark:text-orange-300",
        info:
          "bg-sky-50 text-sky-700 dark:bg-sky-500/12 dark:text-sky-300",
        neutral:
          "bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-white/70",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

export default function StatusBadge({
  className,
  tone,
  ...props
}: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ tone }), className)} {...props} />;
}

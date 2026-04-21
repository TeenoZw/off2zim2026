"use client";

import { cn } from "@/lib/utils";

// ── Base shimmer ──────────────────────────────────────────────────────────────

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-black/[0.06] dark:bg-white/[0.07]",
        className
      )}
    />
  );
}

// ── Text line variants ────────────────────────────────────────────────────────

export function SkeletonLine({ className }: { className?: string }) {
  return <Shimmer className={cn("h-4 w-full", className)} />;
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <Shimmer className={cn("h-7 w-2/3", className)} />;
}

// ── Card skeleton ─────────────────────────────────────────────────────────────

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-black/[0.06] bg-white dark:border-white/[0.07] dark:bg-white/[0.04]",
        className
      )}
    >
      <Shimmer className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Shimmer className="h-6 w-16 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── List item skeleton (for table / list views) ───────────────────────────────

export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[20px] border border-black/[0.06] bg-white p-4 dark:border-white/[0.07] dark:bg-white/[0.04]",
        className
      )}
    >
      <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2 py-1">
        <Shimmer className="h-4 w-1/2" />
        <Shimmer className="h-3.5 w-4/5" />
        <Shimmer className="h-3.5 w-1/3" />
      </div>
    </div>
  );
}

// ── Hero / detail skeleton ────────────────────────────────────────────────────

export function SkeletonDetail() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <Shimmer className="aspect-[16/9] w-full rounded-[28px]" />
        <div className="space-y-3 rounded-[28px] border border-black/[0.06] bg-white p-6 dark:border-white/[0.07] dark:bg-white/[0.04]">
          <Shimmer className="h-7 w-2/3" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
          <Shimmer className="h-4 w-4/6" />
        </div>
      </div>
      <div className="space-y-4 rounded-[28px] border border-black/[0.06] bg-white p-6 dark:border-white/[0.07] dark:bg-white/[0.04]">
        <Shimmer className="h-8 w-1/2" />
        <Shimmer className="h-12 w-full rounded-2xl" />
        <Shimmer className="h-12 w-full rounded-2xl" />
        <Shimmer className="h-12 w-full rounded-2xl" />
        <Shimmer className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

// ── Grid of cards ─────────────────────────────────────────────────────────────

export function SkeletonGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

export interface FilterChipOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Horizontal scrollable filter chip bar.
 * Active chip uses the mobile app contrast-inversion pattern:
 *   light mode → dark fill + white label
 *   dark mode  → white/85 fill + dark label
 */
export default function FilterChips({
  options,
  selected,
  onSelect,
  className,
}: FilterChipsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.id === selected;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? // Contrast-inversion — matches mobile FilterBar active state
                  "bg-slate-900 text-white dark:bg-white/85 dark:text-slate-950"
                : "bg-black/[0.06] text-slate-700 hover:bg-black/[0.10] dark:bg-white/[0.08] dark:text-white/70 dark:hover:bg-white/[0.14]"
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs",
                  isActive
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-950"
                    : "bg-black/[0.06] text-slate-500 dark:bg-white/[0.10] dark:text-white/50"
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type EntryAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export default function SurfaceEntryPage({
  eyebrow,
  title,
  body,
  icon: Icon,
  actions,
  points,
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  actions: EntryAction[];
  points: string[];
}) {
  return (
    <div className="theme-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="theme-panel-strong overflow-hidden rounded-[36px]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-label text-xs uppercase tracking-[0.28em]">
                {eyebrow}
              </div>
              <h1 className="theme-heading mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                {body}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {actions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={
                      action.variant === "secondary"
                        ? "theme-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                        : "inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6f4d]"
                    }
                  >
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 bg-black/[0.03] p-6 dark:bg-white/[0.02] md:grid-cols-2 md:p-8">
              {points.map((point, index) => (
                <div key={point} className="theme-card-soft rounded-[26px] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] dark:bg-white/8">
                    <Icon className="h-5 w-5 text-[#ff5630]" />
                  </div>
                  <p className="theme-heading mt-4 text-base font-semibold">
                    {point}
                  </p>
                  <div className="theme-subtle mt-2 text-xs">
                    {index === 0 ? "Primary access" : index === 1 ? "Workspace flow" : "Shared backend"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

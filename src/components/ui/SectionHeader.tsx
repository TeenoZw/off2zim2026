import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionLabel,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="theme-label text-sm uppercase tracking-[0.28em]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="theme-heading mt-2 text-2xl font-semibold md:text-3xl">
          {title}
        </h2>
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#2a1614] px-4 py-2 text-sm font-semibold text-[#ff8f75] transition hover:bg-[#351b18]"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

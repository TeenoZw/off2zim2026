import { BadgeCheck } from "lucide-react";

type VerifiedBadgeSize = "sm" | "md" | "lg";

interface VerifiedBadgeProps {
  size?: VerifiedBadgeSize;
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { icon: "h-3.5 w-3.5", text: "text-xs", container: "gap-1 px-2 py-0.5" },
  md: { icon: "h-4 w-4", text: "text-xs", container: "gap-1.5 px-2.5 py-1" },
  lg: { icon: "h-5 w-5", text: "text-sm", container: "gap-2 px-3 py-1.5" },
};

export default function VerifiedBadge({
  size = "md",
  showLabel = true,
  className = "",
}: VerifiedBadgeProps) {
  const cfg = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#0f2a1e] text-[#4ade80] ring-1 ring-[#4ade80]/20 ${cfg.container} ${cfg.text} ${className}`}
      title="Verified Premium Partner"
    >
      <BadgeCheck className={`${cfg.icon} shrink-0`} />
      {showLabel ? <span className="font-medium">Verified</span> : null}
    </span>
  );
}

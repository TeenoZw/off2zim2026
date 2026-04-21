"use client";

import { AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { type LogisticsGap } from "@/lib/trip-planner/planner";

interface LogisticsWarningProps {
  gaps: LogisticsGap[];
}

export default function LogisticsWarning({ gaps }: LogisticsWarningProps) {
  const [expanded, setExpanded] = useState(true);

  if (gaps.length === 0) return null;

  const warnings = gaps.filter((g) => g.severity === "warning");
  const infos = gaps.filter((g) => g.severity === "info");

  const summaryColor = warnings.length > 0 ? "text-[#ff5630]" : "text-[#fbbf24]";
  const borderColor = warnings.length > 0 ? "border-[#ff5630]/25" : "border-[#fbbf24]/25";
  const bgColor = warnings.length > 0 ? "bg-[#ff5630]/6" : "bg-[#fbbf24]/6";

  return (
    <div className={`rounded-[18px] border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className={`h-4 w-4 shrink-0 ${summaryColor}`} />
          <span className={`text-sm font-semibold ${summaryColor}`}>
            {gaps.length === 1
              ? "1 logistics issue detected"
              : `${gaps.length} logistics issues detected`}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-white/30" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/30" />
        )}
      </button>

      {/* Detail rows */}
      {expanded && (
        <div className="border-t border-white/8 divide-y divide-white/5 px-5 pb-4 pt-1">
          {warnings.map((gap, i) => (
            <div key={`w-${i}`} className="flex gap-3 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5630]" />
              <div>
                <p className="text-xs font-semibold text-[#ff5630]">{gap.dayLabel}</p>
                <p className="mt-0.5 text-sm text-white/65">{gap.message}</p>
              </div>
            </div>
          ))}
          {infos.map((gap, i) => (
            <div key={`i-${i}`} className="flex gap-3 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#fbbf24]" />
              <div>
                <p className="text-xs font-semibold text-[#fbbf24]">{gap.dayLabel}</p>
                <p className="mt-0.5 text-sm text-white/65">{gap.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { parseExplorerScore, scoreLabel } from "@/lib/explorer-score";

interface ExplorerScoreBadgeProps {
  explorerScore: string | null | undefined;
  showBreakdown?: boolean;
  className?: string;
}

export default function ExplorerScoreBadge({
  explorerScore,
  showBreakdown = false,
  className = "",
}: ExplorerScoreBadgeProps) {
  const score = parseExplorerScore(explorerScore);
  const label = scoreLabel(score.total);

  const colorConfig = {
    Excellent: "bg-[#0f2a1e] text-[#4ade80] ring-[#4ade80]/20",
    Good: "bg-[#132a3a] text-[#7dd3fc] ring-[#7dd3fc]/20",
    Fair: "bg-[#2a2010] text-[#fbbf24] ring-[#fbbf24]/20",
    New: "bg-white/8 text-white/55 ring-white/10",
  };

  const colors = colorConfig[label as keyof typeof colorConfig] ?? colorConfig.New;

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${colors}`}
        title={`Explorer Score: ${score.total} points`}
      >
        <span className="font-semibold tabular-nums">{score.total}</span>
        <span>{label}</span>
      </span>

      {showBreakdown ? (
        <div className="ml-1 space-y-0.5 text-xs text-white/45">
          <div>+{score.completedBookings * 10} completed bookings</div>
          {score.lastMinuteCancellations > 0 ? (
            <div className="text-[#ff8a78]">
              -{score.lastMinuteCancellations * 15} late cancellations
            </div>
          ) : null}
          <div>+{score.reviewsWritten * 3} reviews written</div>
          {score.disputesLost > 0 ? (
            <div className="text-[#ff8a78]">-{score.disputesLost * 5} disputes lost</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

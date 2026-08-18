import type { WinLossDistribution } from "@rs-flow/shared";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface Segment {
  label: string;
  count: number;
  totalPnl?: number;
  className: string;
}

export function WinLossDistributionCard({ distribution }: { distribution: WinLossDistribution }) {
  const total = distribution.winners.count + distribution.losers.count + distribution.breakEven.count;

  const segments: Segment[] = [
    { label: "Winners", count: distribution.winners.count, totalPnl: distribution.winners.totalPnl, className: "bg-profit" },
    { label: "Losers", count: distribution.losers.count, totalPnl: distribution.losers.totalPnl, className: "bg-loss" },
    { label: "Breakeven", count: distribution.breakEven.count, className: "bg-muted-foreground" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        Win / loss distribution
      </h3>

      {total === 0 ? (
        <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
          No closed trades for the selected filters.
        </div>
      ) : (
        <>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {segments
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.label}
                  className={cn(s.className, "h-full")}
                  style={{ width: `${(s.count / total) * 100}%` }}
                  title={`${s.label}: ${s.count}`}
                />
              ))}
          </div>

          <div className="flex flex-wrap gap-6">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.className)} aria-hidden />
                <span className="font-medium text-foreground">
                  {s.label}: {s.count}
                </span>
                {s.totalPnl != null ? (
                  <span className="text-muted-foreground">({formatCurrency(s.totalPnl)})</span>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

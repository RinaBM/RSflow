import { StatTile } from "@/components/ui/stat-tile";
import { ApiError } from "@/lib/api-client";
import { useDashboardMetrics } from "@/features/analytics/hooks";
import { EquityCurveChart } from "@/features/analytics/equity-curve-chart";

function formatCurrency(value: number | null) {
  if (value == null) return "—";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function formatPercent(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(1)}%`;
}

function formatRatio(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(2);
}

function formatHoldingTime(minutes: number | null) {
  if (minutes == null) return "—";
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function formatDay(value: { date: string; netPnl: number } | null) {
  if (!value) return "—";
  const date = new Date(value.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${date} (${formatCurrency(value.netPnl)})`;
}

function formatTradeRef(value: { symbol: string; netPnl: number } | null) {
  if (!value) return "—";
  return `${value.symbol} (${formatCurrency(value.netPnl)})`;
}

export function DashboardPage() {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">A quick snapshot of your trading performance.</p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading metrics…
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : "Failed to load dashboard metrics"}
        </div>
      ) : metrics && metrics.totalTrades === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Log your first trade in the Journal to see your metrics here.
        </div>
      ) : metrics ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <StatTile label="Net P&L" value={formatCurrency(metrics.netPnl)} tone="auto" numericValue={metrics.netPnl} />
            <StatTile label="Win rate" value={formatPercent(metrics.winRate)} />
            <StatTile label="Profit factor" value={formatRatio(metrics.profitFactor)} />
            <StatTile label="Total trades" value={String(metrics.totalTrades)} sublabel={`${metrics.openTrades} open`} />

            <StatTile label="Winning trades" value={String(metrics.winningTrades)} tone="profit" />
            <StatTile label="Losing trades" value={String(metrics.losingTrades)} tone="loss" />
            <StatTile label="Average winner" value={formatCurrency(metrics.averageWinner)} tone="profit" />
            <StatTile label="Average loser" value={formatCurrency(metrics.averageLoser)} tone="loss" />

            <StatTile
              label="Average trade"
              value={formatCurrency(metrics.averageTrade)}
              tone="auto"
              numericValue={metrics.averageTrade}
            />
            <StatTile label="Average risk/reward" value={formatRatio(metrics.averageRiskReward)} />
            <StatTile
              label="Best trade"
              value={formatTradeRef(metrics.bestTrade)}
              tone="profit"
            />
            <StatTile
              label="Worst trade"
              value={formatTradeRef(metrics.worstTrade)}
              tone="loss"
            />

            <StatTile label="Best trading day" value={formatDay(metrics.bestTradingDay)} tone="profit" />
            <StatTile label="Worst trading day" value={formatDay(metrics.worstTradingDay)} tone="loss" />
            <StatTile label="Average holding time" value={formatHoldingTime(metrics.averageHoldingTimeMinutes)} />
            <StatTile
              label="Max drawdown"
              value={formatCurrency(metrics.maxDrawdown)}
              tone={metrics.maxDrawdown > 0 ? "loss" : "neutral"}
            />

            <StatTile label="Max consecutive wins" value={String(metrics.maxConsecutiveWins)} tone="profit" />
            <StatTile label="Max consecutive losses" value={String(metrics.maxConsecutiveLosses)} tone="loss" />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Equity curve</h2>
            <EquityCurveChart data={metrics.equityCurve} />
          </div>
        </>
      ) : null}
    </div>
  );
}

import { LineChart } from "lucide-react";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api-client";
import { formatCurrency, formatHoldingTime, formatPercent } from "@/lib/format";
import { useAnalyticsFilterValues } from "@/store/analytics-filters-store";
import { useDashboardMetrics } from "@/features/analytics/hooks";
import { EquityCurveChart } from "@/features/analytics/equity-curve-chart";
import { AnalyticsFilterBar } from "@/features/analytics/analytics-filter-bar";

function formatRatio(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(2);
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
  const filters = useAnalyticsFilterValues();
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">A quick snapshot of your trading performance.</p>
      </div>

      <AnalyticsFilterBar />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading metrics…
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : "Failed to load dashboard metrics"}
        </div>
      ) : metrics && metrics.totalTrades === 0 ? (
        <EmptyState
          icon={LineChart}
          title="No performance data yet"
          description="Log your first trade in the Journal and your metrics will show up here."
        />
      ) : metrics ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              size="hero"
              label="Net P&L"
              value={formatCurrency(metrics.netPnl)}
              tone="auto"
              numericValue={metrics.netPnl}
            />
            <StatTile size="hero" label="Win rate" value={formatPercent(metrics.winRate)} />
            <StatTile size="hero" label="Profit factor" value={formatRatio(metrics.profitFactor)} />
            <StatTile
              size="hero"
              label="Total trades"
              value={String(metrics.totalTrades)}
              sublabel={`${metrics.openTrades} open`}
            />
          </div>

          <div>
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Breakdown
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
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
              <StatTile label="Best trade" value={formatTradeRef(metrics.bestTrade)} tone="profit" />
              <StatTile label="Worst trade" value={formatTradeRef(metrics.worstTrade)} tone="loss" />
              <StatTile label="Best trading day" value={formatDay(metrics.bestTradingDay)} tone="profit" />
              <StatTile label="Worst trading day" value={formatDay(metrics.worstTradingDay)} tone="loss" />
              <StatTile label="Avg holding time" value={formatHoldingTime(metrics.averageHoldingTimeMinutes)} />
              <StatTile
                label="Max drawdown"
                value={formatCurrency(metrics.maxDrawdown)}
                tone={metrics.maxDrawdown > 0 ? "loss" : "neutral"}
              />
              <StatTile label="Max consecutive wins" value={String(metrics.maxConsecutiveWins)} tone="profit" />
              <StatTile label="Max consecutive losses" value={String(metrics.maxConsecutiveLosses)} tone="loss" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Equity curve
            </h2>
            <EquityCurveChart data={metrics.equityCurve} />
          </div>
        </>
      ) : null}
    </div>
  );
}

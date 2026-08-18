import { ApiError } from "@/lib/api-client";
import { useAnalyticsFilterValues } from "@/store/analytics-filters-store";
import { useAnalyticsBreakdowns } from "@/features/analytics/hooks";
import { AnalyticsFilterBar } from "@/features/analytics/analytics-filter-bar";
import { PerformanceTable } from "@/features/analytics/performance-table";
import { WinLossDistributionCard } from "@/features/analytics/win-loss-distribution";
import { PeriodPnlChart } from "@/features/analytics/period-pnl-chart";

export function AnalyticsPage() {
  const filters = useAnalyticsFilterValues();
  const { data, isLoading, isError, error } = useAnalyticsBreakdowns(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Understand where your edge comes from — and where it doesn't.
        </p>
      </div>

      <AnalyticsFilterBar />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading analytics…
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : "Failed to load analytics"}
        </div>
      ) : data ? (
        <>
          <WinLossDistributionCard distribution={data.winLossDistribution} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PeriodPnlChart title="Weekly P&L" data={data.weekly} />
            <PeriodPnlChart title="Monthly P&L" data={data.monthly} />
          </div>

          <PerformanceTable title="Long vs short" data={data.bySide} />
          <PerformanceTable title="Performance by symbol" data={data.bySymbol} />
          <PerformanceTable
            title="Performance by strategy"
            data={data.byStrategy}
            emptyLabel="No closed trades yet — tag trades with a strategy in their Review page."
          />
          <PerformanceTable
            title="Performance by setup"
            data={data.bySetup}
            emptyLabel="No closed trades yet — tag trades with a setup in their Review page."
          />

          <div>
            <PerformanceTable title="Performance by hour" data={data.byHour} />
            <p className="mt-1 text-xs text-muted-foreground">
              Hours are in UTC — per-user timezone support hasn't been decided yet.
            </p>
          </div>

          <PerformanceTable title="Performance by day of week" data={data.byDayOfWeek} />
        </>
      ) : null}
    </div>
  );
}

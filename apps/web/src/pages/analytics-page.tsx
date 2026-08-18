import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api-client";
import { useAnalyticsFilterValues } from "@/store/analytics-filters-store";
import { useAnalyticsBreakdowns } from "@/features/analytics/hooks";
import { AnalyticsFilterBar } from "@/features/analytics/analytics-filter-bar";
import { PerformanceTable } from "@/features/analytics/performance-table";
import { WinLossDistributionCard } from "@/features/analytics/win-loss-distribution";
import { PeriodPnlChart } from "@/features/analytics/period-pnl-chart";

export function AnalyticsPage() {
  const { t } = useTranslation();
  const filters = useAnalyticsFilterValues();
  const { data, isLoading, isError, error } = useAnalyticsBreakdowns(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("analyticsPage.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("analyticsPage.subtitle")}</p>
      </div>

      <AnalyticsFilterBar />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("analyticsPage.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : t("analyticsPage.loadFailed")}
        </div>
      ) : data ? (
        <>
          <WinLossDistributionCard distribution={data.winLossDistribution} />

          <PeriodPnlChart title={t("analyticsPage.dailyPnl")} data={data.daily} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PeriodPnlChart title={t("analyticsPage.weeklyPnl")} data={data.weekly} />
            <PeriodPnlChart title={t("analyticsPage.monthlyPnl")} data={data.monthly} />
          </div>

          <PerformanceTable title={t("analyticsPage.longVsShort")} data={data.bySide} />
          <PerformanceTable title={t("analyticsPage.bySymbol")} data={data.bySymbol} />
          <PerformanceTable
            title={t("analyticsPage.byStrategy")}
            data={data.byStrategy}
            emptyLabel={t("analyticsPage.byStrategyEmpty")}
          />
          <PerformanceTable
            title={t("analyticsPage.bySetup")}
            data={data.bySetup}
            emptyLabel={t("analyticsPage.bySetupEmpty")}
          />

          <div>
            <PerformanceTable title={t("analyticsPage.byHour")} data={data.byHour} />
            <p className="mt-1 text-xs text-muted-foreground">{t("analyticsPage.byHourCaveat")}</p>
          </div>

          <PerformanceTable title={t("analyticsPage.byDayOfWeek")} data={data.byDayOfWeek} />
        </>
      ) : null}
    </div>
  );
}

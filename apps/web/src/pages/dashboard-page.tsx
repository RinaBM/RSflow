import { useMemo } from "react";
import { LineChart, Moon, Sun, Sunrise } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api-client";
import { formatCurrency, formatHoldingTime, formatPercent } from "@/lib/format";
import { getTimeOfDay, firstName } from "@/lib/greeting";
import { pickMotivation } from "@/lib/motivation";
import { useMe } from "@/features/auth/hooks";
import { useAnalyticsFilterValues } from "@/store/analytics-filters-store";
import { useDashboardMetrics } from "@/features/analytics/hooks";
import { EquityCurveChart } from "@/features/analytics/equity-curve-chart";
import { AnalyticsFilterBar } from "@/features/analytics/analytics-filter-bar";
import { RecentTradesCard } from "@/features/trades/recent-trades-card";

const TIME_ICONS = { morning: Sunrise, afternoon: Sun, evening: Moon };

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

function GreetingBanner({ hasTrades, netPnl }: { hasTrades: boolean; netPnl: number | null }) {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const tone = netPnl != null && netPnl >= 0 ? "positive" : "negative";
  const pool = t(`dashboard.motivation.${tone}`, { returnObjects: true }) as string[];
  const name = me?.user ? firstName(me.user.name) : "";
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-picks only when the tone (win/loss) flips, not on every render
  const message = useMemo(() => (hasTrades && name ? pickMotivation(pool, name) : ""), [tone, hasTrades, name]);

  if (!me?.user) return null;
  const greeting = t(`dashboard.greeting.${timeOfDay}`);
  const Icon = TIME_ICONS[timeOfDay];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">
          {greeting}, {name}!
        </div>
        {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const filters = useAnalyticsFilterValues();
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <GreetingBanner hasTrades={Boolean(metrics && metrics.totalTrades > 0)} netPnl={metrics?.netPnl ?? null} />

      <AnalyticsFilterBar />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("dashboard.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : "Failed to load dashboard metrics"}
        </div>
      ) : metrics && metrics.totalTrades === 0 ? (
        <EmptyState icon={LineChart} title={t("dashboard.emptyTitle")} description={t("dashboard.emptyDescription")} />
      ) : metrics ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              size="hero"
              label={t("dashboard.stats.netPnl")}
              value={formatCurrency(metrics.netPnl)}
              tone="auto"
              numericValue={metrics.netPnl}
            />
            <StatTile size="hero" label={t("dashboard.stats.winRate")} value={formatPercent(metrics.winRate)} />
            <StatTile size="hero" label={t("dashboard.stats.profitFactor")} value={formatRatio(metrics.profitFactor)} />
            <StatTile
              size="hero"
              label={t("dashboard.stats.totalTrades")}
              value={String(metrics.totalTrades)}
              sublabel={t("dashboard.stats.openSuffix", { count: metrics.openTrades })}
            />
          </div>

          <RecentTradesCard />

          <div>
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {t("dashboard.breakdown")}
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              <StatTile label={t("dashboard.stats.winningTrades")} value={String(metrics.winningTrades)} tone="profit" />
              <StatTile label={t("dashboard.stats.losingTrades")} value={String(metrics.losingTrades)} tone="loss" />
              <StatTile label={t("dashboard.stats.averageWinner")} value={formatCurrency(metrics.averageWinner)} tone="profit" />
              <StatTile label={t("dashboard.stats.averageLoser")} value={formatCurrency(metrics.averageLoser)} tone="loss" />
              <StatTile
                label={t("dashboard.stats.averageTrade")}
                value={formatCurrency(metrics.averageTrade)}
                tone="auto"
                numericValue={metrics.averageTrade}
              />
              <StatTile label={t("dashboard.stats.averageRiskReward")} value={formatRatio(metrics.averageRiskReward)} />
              <StatTile label={t("dashboard.stats.bestTrade")} value={formatTradeRef(metrics.bestTrade)} tone="profit" />
              <StatTile label={t("dashboard.stats.worstTrade")} value={formatTradeRef(metrics.worstTrade)} tone="loss" />
              <StatTile label={t("dashboard.stats.bestTradingDay")} value={formatDay(metrics.bestTradingDay)} tone="profit" />
              <StatTile label={t("dashboard.stats.worstTradingDay")} value={formatDay(metrics.worstTradingDay)} tone="loss" />
              <StatTile label={t("dashboard.stats.avgHoldingTime")} value={formatHoldingTime(metrics.averageHoldingTimeMinutes)} />
              <StatTile
                label={t("dashboard.stats.maxDrawdown")}
                value={formatCurrency(metrics.maxDrawdown)}
                tone={metrics.maxDrawdown > 0 ? "loss" : "neutral"}
              />
              <StatTile label={t("dashboard.stats.maxConsecutiveWins")} value={String(metrics.maxConsecutiveWins)} tone="profit" />
              <StatTile label={t("dashboard.stats.maxConsecutiveLosses")} value={String(metrics.maxConsecutiveLosses)} tone="loss" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {t("dashboard.equityCurve")}
            </h2>
            <EquityCurveChart data={metrics.equityCurve} />
          </div>
        </>
      ) : null}
    </div>
  );
}

import { useMemo } from "react";
import { LineChart, Moon, Sun, Sunrise } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api-client";
import { formatCurrency, formatHoldingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getTimeOfDay, firstName } from "@/lib/greeting";
import { pickMotivation } from "@/lib/motivation";
import { FUN_COLOR_BADGE_CLASSES, pickFunColor } from "@/lib/fun-colors";
import { useMe } from "@/features/auth/hooks";
import { useAnalyticsFilterValues } from "@/store/analytics-filters-store";
import { useDashboardMetrics } from "@/features/analytics/hooks";
import { DashboardHero } from "@/features/analytics/dashboard-hero";
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
  const genderKey = me?.user?.gender === "MALE" ? "male" : me?.user?.gender === "FEMALE" ? "female" : "neutral";
  const pool = t(`dashboard.motivation.${tone}.${genderKey}`, { returnObjects: true }) as string[];
  const name = me?.user ? firstName(me.user.name) : "";
  const greetingText = t(`dashboard.greeting.${timeOfDay}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pickFunColor() is intentionally random; tone/genderKey are just the recompute trigger
  const funColor = useMemo(() => pickFunColor(), [tone, genderKey]);
  // Shows either the time-of-day greeting OR a motivational quip -- picked once per tone/gender
  // change, never both stacked together.
  const bigMessage = useMemo(() => {
    if (hasTrades && Math.random() < 0.5) return pickMotivation(pool, name);
    return `${greetingText}, ${name}!`;
  }, [hasTrades, name, pool, greetingText]);

  if (!me?.user) return null;
  const Icon = TIME_ICONS[timeOfDay];

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", FUN_COLOR_BADGE_CLASSES[funColor])}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 text-xl font-bold leading-snug text-foreground sm:text-2xl">{bigMessage}</div>
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
          <DashboardHero metrics={metrics} />

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
        </>
      ) : null}
    </div>
  );
}

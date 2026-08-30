import type { ReactNode } from "react";
import { BarChart3, Target, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DashboardMetrics } from "@rs-flow/shared";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/format";
import { EquityCurveChart } from "./equity-curve-chart";

function formatRatio(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(2);
}

function HeroMiniStat({
  icon,
  label,
  value,
  sublabel,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  accent: "primary" | "violet" | "neutral";
}) {
  return (
    <div
      className={cn(
        "min-w-[104px] rounded-xl border px-4 py-2.5",
        accent === "primary" && "border-primary/30 bg-primary/5",
        accent === "violet" && "border-violet/30 bg-violet/5",
        accent === "neutral" && "border-border bg-background/40",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest",
          accent === "primary" && "text-primary",
          accent === "violet" && "text-violet",
          accent === "neutral" && "text-muted-foreground",
        )}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-mono text-xl font-extrabold" dir="ltr">
        {value}
      </div>
      {sublabel ? <div className="mt-0.5 text-[10px] font-semibold text-status-open">{sublabel}</div> : null}
    </div>
  );
}

export function DashboardHero({ metrics }: { metrics: DashboardMetrics }) {
  const { t } = useTranslation();
  const isProfit = metrics.netPnl >= 0;

  return (
    <div className="gradient-border">
      <div className="overflow-hidden rounded-[calc(var(--radius-xl)-1.5px)] bg-card">
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/60 via-card to-secondary/30 px-6 py-6">
          <div
            className="pointer-events-none absolute -top-32 start-[-40px] h-64 w-64 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 end-[60px] h-56 w-56 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.16), transparent 70%)" }}
          />

          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-glow-primary text-[11px] font-bold uppercase tracking-widest text-primary">
                {t("dashboard.stats.netPnl")}
              </div>
              <div
                dir="ltr"
                className={cn(
                  "mt-2 font-mono text-4xl font-extrabold tracking-tight sm:text-5xl",
                  isProfit
                    ? "gradient-text-profit drop-shadow-[0_0_22px_rgba(20,226,143,0.35)]"
                    : "gradient-text-loss drop-shadow-[0_0_22px_rgba(255,61,113,0.3)]",
                )}
              >
                {isProfit ? "+" : ""}
                {formatCurrency(metrics.netPnl)}
              </div>
            </div>

            <div className="flex flex-wrap items-stretch gap-2.5">
              <HeroMiniStat
                icon={<Target className="h-3 w-3" />}
                label={t("dashboard.stats.winRate")}
                value={formatPercent(metrics.winRate)}
                accent="primary"
              />
              <HeroMiniStat
                icon={<Zap className="h-3 w-3" />}
                label={t("dashboard.stats.profitFactor")}
                value={formatRatio(metrics.profitFactor)}
                accent="violet"
              />
              <HeroMiniStat
                icon={<BarChart3 className="h-3 w-3" />}
                label={t("dashboard.stats.totalTrades")}
                value={String(metrics.totalTrades)}
                sublabel={t("dashboard.stats.openSuffix", { count: metrics.openTrades })}
                accent="neutral"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <h2 className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            {t("dashboard.equityCurve")}
          </h2>
          <EquityCurveChart data={metrics.equityCurve} bare />
        </div>
      </div>
    </div>
  );
}

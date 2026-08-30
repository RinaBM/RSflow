import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTrades } from "./hooks";

function formatEntryDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function RecentTradesCard() {
  const { t } = useTranslation();
  const { data } = useTrades({ page: 1, pageSize: 5, sort: "entryTime", order: "desc" });
  const trades = data?.items ?? [];

  return (
    <div>
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {t("dashboard.recentTrades")}
      </h2>
      {trades.length === 0 ? (
        <div className="rounded-lg border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          {t("dashboard.noRecentTrades")}
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {trades.map((trade) => (
            <Link
              key={trade.id}
              to={`/journal/${trade.id}`}
              className="flex items-center justify-between gap-3 border-s-2 border-transparent px-4 py-2.5 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                    trade.side === "LONG"
                      ? "border-profit/50 bg-profit/10 text-profit shadow-[0_0_10px_-4px_rgba(20,226,143,0.6)]"
                      : "border-loss/50 bg-loss/10 text-loss shadow-[0_0_10px_-4px_rgba(255,61,113,0.55)]",
                  )}
                >
                  {trade.side}
                </span>
                <span className="truncate font-medium">{trade.symbol}</span>
                <span className="shrink-0 text-xs text-muted-foreground" dir="ltr">
                  {formatEntryDateTime(trade.entryTime)}
                </span>
                {trade.status === "OPEN" ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-status-open/50 bg-status-open/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-status-open">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-open shadow-[0_0_6px_1px_rgba(255,176,32,0.8)]" />
                    {t("journal.open")}
                  </span>
                ) : null}
              </div>
              <span
                dir="ltr"
                className={cn(
                  "shrink-0 font-mono text-sm font-semibold",
                  trade.netPnl == null ? "text-muted-foreground" : trade.netPnl >= 0 ? "text-profit" : "text-loss",
                )}
              >
                {trade.netPnl == null ? "—" : `${trade.netPnl >= 0 ? "+" : ""}${formatCurrency(trade.netPnl)}`}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

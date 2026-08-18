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
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {trades.map((trade) => (
            <Link
              key={trade.id}
              to={`/journal/${trade.id}`}
              className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-accent/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                    trade.side === "LONG"
                      ? "border-profit/40 bg-profit/10 text-profit"
                      : "border-loss/40 bg-loss/10 text-loss",
                  )}
                >
                  {trade.side}
                </span>
                <span className="truncate font-medium">{trade.symbol}</span>
                <span className="shrink-0 text-xs text-muted-foreground" dir="ltr">
                  {formatEntryDateTime(trade.entryTime)}
                </span>
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

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useCalendarSummary } from "@/features/calendar/hooks";
import { useTrades } from "@/features/trades/hooks";

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarPage() {
  const { t } = useTranslation();
  const weekdays = t("calendar.weekdays", { returnObjects: true }) as string[];
  const today = new Date();
  const [year, setYear] = useState(today.getUTCFullYear());
  const [month, setMonth] = useState(today.getUTCMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useCalendarSummary(year, month);
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const dayMap = useMemo(() => {
    const map = new Map<string, { netPnl: number; tradeCount: number }>();
    data?.days.forEach((d) => map.set(d.date, d));
    return map;
  }, [data]);

  function goToPreviousMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("calendar.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="w-36 text-center text-sm font-medium">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          {t("calendar.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : t("calendar.loadFailed")}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6 rounded-lg border border-border bg-card p-4">
            <div>
              <div className="text-xs text-muted-foreground">{t("calendar.monthlyPnl")}</div>
              <div
                dir="ltr"
                className={cn(
                  "text-xl font-semibold",
                  (data?.monthlyNetPnl ?? 0) >= 0 ? "text-profit" : "text-loss",
                )}
              >
                {formatCurrency(data?.monthlyNetPnl ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("calendar.trades")}</div>
              <div className="text-xl font-semibold">{data?.monthlyTradeCount ?? 0}</div>
            </div>
            {data?.monthlyTradeCount === 0 ? (
              <div className="text-sm text-muted-foreground">{t("calendar.noTradesMonth")}</div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-7 border-b border-border bg-card">
              {weekdays.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                if (day == null) {
                  return <div key={`empty-${i}`} className="h-24 border-b border-e border-border bg-card/40" />;
                }
                const dateKey = toDateKey(year, month, day);
                const summary = dayMap.get(dateKey);
                const hasTrades = summary != null && summary.tradeCount > 0;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    disabled={!hasTrades}
                    onClick={() => setSelectedDate(dateKey)}
                    className={cn(
                      "flex h-24 flex-col items-start gap-1 border-b border-e border-border p-2 text-start transition-colors",
                      hasTrades ? "cursor-pointer hover:bg-accent" : "cursor-default",
                      summary && summary.netPnl > 0 && "bg-profit/10",
                      summary && summary.netPnl < 0 && "bg-loss/10",
                    )}
                  >
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {day}
                    </span>
                    {hasTrades ? (
                      <>
                        <span
                          dir="ltr"
                          className={cn(
                            "text-sm font-semibold",
                            summary!.netPnl > 0 ? "text-profit" : summary!.netPnl < 0 ? "text-loss" : "",
                          )}
                        >
                          {formatCurrency(summary!.netPnl)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {summary!.tradeCount}{" "}
                          {summary!.tradeCount === 1 ? t("calendar.tradeCountSuffix") : t("calendar.tradeCountSuffixPlural")}
                        </span>
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <DayTradesDialog date={selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)} />
    </div>
  );
}

function DayTradesDialog({ date, onOpenChange }: { date: string | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const dateFrom = date ? new Date(`${date}T00:00:00.000Z`) : undefined;
  const dateTo = date ? new Date(`${date}T23:59:59.999Z`) : undefined;

  const { data, isLoading } = useTrades(
    {
      exitDateFrom: dateFrom,
      exitDateTo: dateTo,
      pageSize: 50,
      sort: "entryTime",
      order: "asc",
    },
    { enabled: date != null },
  );

  return (
    <Dialog open={date != null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date ? new Date(`${date}T00:00:00`).toLocaleDateString() : ""}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">{t("calendar.loadingTrades")}</div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {data?.items.map((trade) => (
              <Link
                key={trade.id}
                to={`/journal/${trade.id}`}
                className="flex items-center justify-between py-2 text-sm hover:text-primary"
              >
                <span>
                  {trade.symbol} · {trade.side}
                </span>
                <span dir="ltr" className={cn("font-medium", (trade.netPnl ?? 0) >= 0 ? "text-profit" : "text-loss")}>
                  {trade.netPnl != null ? formatCurrency(trade.netPnl) : "—"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

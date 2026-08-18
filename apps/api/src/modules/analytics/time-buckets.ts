import { isClosed, type AnalyticsTrade, type ClosedTrade } from "./metrics.js";

export interface PeriodSummary {
  period: string;
  netPnl: number;
  tradeCount: number;
}

function summarizeByPeriod(closed: ClosedTrade[], periodKeyOf: (trade: ClosedTrade) => string): PeriodSummary[] {
  const byPeriod = new Map<string, PeriodSummary>();

  for (const trade of closed) {
    const period = periodKeyOf(trade);
    const existing = byPeriod.get(period);
    if (existing) {
      existing.netPnl += trade.netPnl;
      existing.tradeCount += 1;
    } else {
      byPeriod.set(period, { period, netPnl: trade.netPnl, tradeCount: 1 });
    }
  }

  return [...byPeriod.values()].sort((a, b) => a.period.localeCompare(b.period));
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7); // YYYY-MM (UTC)
}

/** ISO-8601 week key ("2026-W33"), UTC-based — same timezone caveat as grouping.ts's
 * hour/day-of-week breakdowns: there is no timezone setting in the data model yet. */
function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const isoDayNum = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - isoDayNum + 3); // Thursday of this ISO week

  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3);

  const weekNum = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function summarizeByDay(trades: AnalyticsTrade[]): PeriodSummary[] {
  return summarizeByPeriod(trades.filter(isClosed), (t) => dayKey(t.exitTime));
}

export function summarizeByWeek(trades: AnalyticsTrade[]): PeriodSummary[] {
  return summarizeByPeriod(trades.filter(isClosed), (t) => isoWeekKey(t.exitTime));
}

export function summarizeByMonth(trades: AnalyticsTrade[]): PeriodSummary[] {
  return summarizeByPeriod(trades.filter(isClosed), (t) => monthKey(t.exitTime));
}

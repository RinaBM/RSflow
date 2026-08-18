import type { TradeSide } from "@rs-flow/shared";

export interface AnalyticsTrade {
  id: string;
  symbol: string;
  side: TradeSide;
  status: "OPEN" | "CLOSED";
  entryTime: Date;
  exitTime: Date | null;
  netPnl: number | null;
  strategyId: string | null;
  strategyName: string | null;
  setupId: string | null;
  setupName: string | null;
}

export interface ClosedTrade extends AnalyticsTrade {
  exitTime: Date;
  netPnl: number;
}

export function isClosed(trade: AnalyticsTrade): trade is ClosedTrade {
  return trade.status === "CLOSED" && trade.exitTime != null && trade.netPnl != null;
}

function sortByExitTime(trades: ClosedTrade[]): ClosedTrade[] {
  return [...trades].sort((a, b) => a.exitTime.getTime() - b.exitTime.getTime());
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculateWinRate(winningCount: number, closedCount: number): number | null {
  if (closedCount === 0) return null;
  return (winningCount / closedCount) * 100;
}

export function calculateProfitFactor(grossProfit: number, grossLoss: number): number | null {
  if (grossLoss === 0) return null;
  return grossProfit / grossLoss;
}

export function calculateAverageRiskReward(
  averageWinner: number | null,
  averageLoser: number | null,
): number | null {
  if (averageWinner == null || averageLoser == null || averageLoser === 0) return null;
  return averageWinner / Math.abs(averageLoser);
}

export function calculateAverageHoldingTimeMinutes(trades: ClosedTrade[]): number | null {
  if (trades.length === 0) return null;
  const totalMinutes = trades.reduce(
    (sum, t) => sum + (t.exitTime.getTime() - t.entryTime.getTime()) / 60000,
    0,
  );
  return totalMinutes / trades.length;
}

/** Longest run of consecutive trades (in chronological order) matching `predicate`. Any trade that
 * matches neither win nor loss (predicate false for both) breaks the streak. */
export function calculateMaxConsecutive(
  chronologicalTrades: ClosedTrade[],
  predicate: (trade: ClosedTrade) => boolean,
): number {
  let max = 0;
  let current = 0;
  for (const trade of chronologicalTrades) {
    if (predicate(trade)) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function groupNetPnlByTradingDay(chronologicalTrades: ClosedTrade[]): Map<string, number> {
  const byDay = new Map<string, number>();
  for (const trade of chronologicalTrades) {
    const key = dayKey(trade.exitTime);
    byDay.set(key, (byDay.get(key) ?? 0) + trade.netPnl);
  }
  return byDay;
}

export interface TradingDaySummary {
  date: string;
  netPnl: number;
  tradeCount: number;
}

/** Per-day P&L and trade count for closed trades, sorted chronologically. Used by the calendar view. */
export function summarizeTradingDays(trades: AnalyticsTrade[]): TradingDaySummary[] {
  const closed = trades.filter(isClosed);
  const byDay = new Map<string, TradingDaySummary>();

  for (const trade of closed) {
    const date = dayKey(trade.exitTime);
    const existing = byDay.get(date);
    if (existing) {
      existing.netPnl += trade.netPnl;
      existing.tradeCount += 1;
    } else {
      byDay.set(date, { date, netPnl: trade.netPnl, tradeCount: 1 });
    }
  }

  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function findExtremeDay(
  byDay: Map<string, number>,
  compare: (a: number, b: number) => boolean,
): { date: string; netPnl: number } | null {
  let result: { date: string; netPnl: number } | null = null;
  for (const [date, netPnl] of byDay) {
    if (!result || compare(netPnl, result.netPnl)) {
      result = { date, netPnl };
    }
  }
  return result;
}

export function buildEquityCurve(chronologicalTrades: ClosedTrade[]): {
  tradeId: string;
  date: string;
  cumulativePnl: number;
}[] {
  let cumulative = 0;
  return chronologicalTrades.map((trade) => {
    cumulative += trade.netPnl;
    return { tradeId: trade.id, date: trade.exitTime.toISOString(), cumulativePnl: cumulative };
  });
}

export function calculateMaxDrawdown(equityCurve: { cumulativePnl: number }[]): number {
  let peak = 0;
  let maxDrawdown = 0;
  for (const point of equityCurve) {
    peak = Math.max(peak, point.cumulativePnl);
    maxDrawdown = Math.max(maxDrawdown, peak - point.cumulativePnl);
  }
  return maxDrawdown;
}

export function computeDashboardMetrics(trades: AnalyticsTrade[]) {
  const closed = sortByExitTime(trades.filter(isClosed));
  const open = trades.filter((t) => t.status === "OPEN");

  const winners = closed.filter((t) => t.netPnl > 0);
  const losers = closed.filter((t) => t.netPnl < 0);
  const breakEven = closed.filter((t) => t.netPnl === 0);

  const grossProfit = winners.reduce((sum, t) => sum + t.netPnl, 0);
  const grossLoss = Math.abs(losers.reduce((sum, t) => sum + t.netPnl, 0));
  const netPnl = grossProfit - grossLoss;

  const averageWinner = average(winners.map((t) => t.netPnl));
  const averageLoser = average(losers.map((t) => t.netPnl));
  const averageTrade = average(closed.map((t) => t.netPnl));

  const bestTrade = closed.reduce<ClosedTrade | null>(
    (best, t) => (!best || t.netPnl > best.netPnl ? t : best),
    null,
  );
  const worstTrade = closed.reduce<ClosedTrade | null>(
    (worst, t) => (!worst || t.netPnl < worst.netPnl ? t : worst),
    null,
  );

  const byDay = groupNetPnlByTradingDay(closed);
  const equityCurve = buildEquityCurve(closed);

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    openTrades: open.length,
    winningTrades: winners.length,
    losingTrades: losers.length,
    breakEvenTrades: breakEven.length,
    winRate: calculateWinRate(winners.length, closed.length),
    netPnl,
    grossProfit,
    grossLoss,
    profitFactor: calculateProfitFactor(grossProfit, grossLoss),
    averageWinner,
    averageLoser,
    averageTrade,
    averageRiskReward: calculateAverageRiskReward(averageWinner, averageLoser),
    bestTrade: bestTrade
      ? { id: bestTrade.id, symbol: bestTrade.symbol, side: bestTrade.side, netPnl: bestTrade.netPnl, exitTime: bestTrade.exitTime.toISOString() }
      : null,
    worstTrade: worstTrade
      ? { id: worstTrade.id, symbol: worstTrade.symbol, side: worstTrade.side, netPnl: worstTrade.netPnl, exitTime: worstTrade.exitTime.toISOString() }
      : null,
    bestTradingDay: findExtremeDay(byDay, (a, b) => a > b),
    worstTradingDay: findExtremeDay(byDay, (a, b) => a < b),
    averageHoldingTimeMinutes: calculateAverageHoldingTimeMinutes(closed),
    maxConsecutiveWins: calculateMaxConsecutive(closed, (t) => t.netPnl > 0),
    maxConsecutiveLosses: calculateMaxConsecutive(closed, (t) => t.netPnl < 0),
    maxDrawdown: calculateMaxDrawdown(equityCurve),
    equityCurve,
  };
}

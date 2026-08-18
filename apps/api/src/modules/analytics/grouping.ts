import { calculateProfitFactor, calculateWinRate, isClosed, type AnalyticsTrade, type ClosedTrade } from "./metrics.js";

export interface GroupPerformance {
  key: string;
  label: string;
  tradeCount: number;
  netPnl: number;
  winRate: number | null;
  averageTrade: number | null;
  profitFactor: number | null;
}

/** Groups closed trades by an arbitrary key and computes the same performance shape for
 * every group, so every "Performance by X" breakdown shares one implementation. */
function computeGroupPerformance(
  trades: ClosedTrade[],
  keyOf: (trade: ClosedTrade) => string,
  labelOf: (key: string, groupTrades: ClosedTrade[]) => string,
): GroupPerformance[] {
  const groups = new Map<string, ClosedTrade[]>();
  for (const trade of trades) {
    const key = keyOf(trade);
    const list = groups.get(key);
    if (list) {
      list.push(trade);
    } else {
      groups.set(key, [trade]);
    }
  }

  return [...groups.entries()].map(([key, groupTrades]) => {
    const winners = groupTrades.filter((t) => t.netPnl > 0);
    const losers = groupTrades.filter((t) => t.netPnl < 0);
    const grossProfit = winners.reduce((sum, t) => sum + t.netPnl, 0);
    const grossLoss = Math.abs(losers.reduce((sum, t) => sum + t.netPnl, 0));
    const netPnl = groupTrades.reduce((sum, t) => sum + t.netPnl, 0);

    return {
      key,
      label: labelOf(key, groupTrades),
      tradeCount: groupTrades.length,
      netPnl,
      winRate: calculateWinRate(winners.length, groupTrades.length),
      averageTrade: netPnl / groupTrades.length,
      profitFactor: calculateProfitFactor(grossProfit, grossLoss),
    };
  });
}

function sortByNetPnlDesc(groups: GroupPerformance[]): GroupPerformance[] {
  return [...groups].sort((a, b) => b.netPnl - a.netPnl);
}

export function performanceBySymbol(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return sortByNetPnlDesc(computeGroupPerformance(closed, (t) => t.symbol, (key) => key));
}

export function performanceByStrategy(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return sortByNetPnlDesc(
    computeGroupPerformance(
      closed,
      (t) => t.strategyId ?? "none",
      (key, groupTrades) => (key === "none" ? "No strategy" : (groupTrades[0]?.strategyName ?? "Unknown")),
    ),
  );
}

export function performanceBySetup(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return sortByNetPnlDesc(
    computeGroupPerformance(
      closed,
      (t) => t.setupId ?? "none",
      (key, groupTrades) => (key === "none" ? "No setup" : (groupTrades[0]?.setupName ?? "Unknown")),
    ),
  );
}

export function performanceBySide(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return computeGroupPerformance(closed, (t) => t.side, (key) => key);
}

// Hour-of-day and day-of-week are derived from exitTime in UTC. There is no timezone concept
// anywhere in the data model yet (no per-user or per-account timezone setting), so this is a
// clearly-provisional choice, not a hidden assumption baked into the schema — swapping it for a
// real timezone later only means changing these two key functions.
export function performanceByHour(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return computeGroupPerformance(
    closed,
    (t) => String(t.exitTime.getUTCHours()),
    (key) => `${key.padStart(2, "0")}:00`,
  ).sort((a, b) => Number(a.key) - Number(b.key));
}

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function performanceByDayOfWeek(trades: AnalyticsTrade[]): GroupPerformance[] {
  const closed = trades.filter(isClosed);
  return computeGroupPerformance(
    closed,
    (t) => String(t.exitTime.getUTCDay()),
    (key) => WEEKDAY_LABELS[Number(key)] as string,
  ).sort((a, b) => Number(a.key) - Number(b.key));
}

export interface WinLossDistribution {
  winners: { count: number; totalPnl: number };
  losers: { count: number; totalPnl: number };
  breakEven: { count: number };
}

export function computeWinLossDistribution(trades: AnalyticsTrade[]): WinLossDistribution {
  const closed = trades.filter(isClosed);
  const winners = closed.filter((t) => t.netPnl > 0);
  const losers = closed.filter((t) => t.netPnl < 0);
  const breakEven = closed.filter((t) => t.netPnl === 0);

  return {
    winners: { count: winners.length, totalPnl: winners.reduce((sum, t) => sum + t.netPnl, 0) },
    losers: { count: losers.length, totalPnl: losers.reduce((sum, t) => sum + t.netPnl, 0) },
    breakEven: { count: breakEven.length },
  };
}

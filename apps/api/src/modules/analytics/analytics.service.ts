import { prisma } from "../../db/prisma.js";
import { computeDashboardMetrics, summarizeTradingDays, type AnalyticsTrade } from "./metrics.js";

const tradeProjection = {
  id: true,
  symbol: true,
  side: true,
  status: true,
  entryTime: true,
  exitTime: true,
  netPnl: true,
} as const;

type ProjectedTrade = {
  id: string;
  symbol: string;
  side: AnalyticsTrade["side"];
  status: AnalyticsTrade["status"];
  entryTime: Date;
  exitTime: Date | null;
  netPnl: unknown;
};

function toAnalyticsTrade(trade: ProjectedTrade): AnalyticsTrade {
  return {
    id: trade.id,
    symbol: trade.symbol,
    side: trade.side,
    status: trade.status,
    entryTime: trade.entryTime,
    exitTime: trade.exitTime,
    netPnl: trade.netPnl != null ? Number(trade.netPnl) : null,
  };
}

export async function getDashboardMetrics(userId: string) {
  const trades = await prisma.trade.findMany({ where: { userId }, select: tradeProjection });
  return computeDashboardMetrics(trades.map(toAnalyticsTrade));
}

export async function getCalendarSummary(userId: string, year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const trades = await prisma.trade.findMany({
    where: { userId, status: "CLOSED", exitTime: { gte: start, lt: end } },
    select: tradeProjection,
  });

  const days = summarizeTradingDays(trades.map(toAnalyticsTrade));
  const monthlyNetPnl = days.reduce((sum, d) => sum + d.netPnl, 0);
  const monthlyTradeCount = days.reduce((sum, d) => sum + d.tradeCount, 0);

  return { days, monthlyNetPnl, monthlyTradeCount };
}

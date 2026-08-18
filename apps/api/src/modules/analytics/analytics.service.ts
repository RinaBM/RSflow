import type { Prisma } from "@prisma/client";
import type { AnalyticsFilterQuery } from "@rs-flow/shared";
import { prisma } from "../../db/prisma.js";
import { computeDashboardMetrics, summarizeTradingDays, type AnalyticsTrade } from "./metrics.js";
import {
  computeWinLossDistribution,
  performanceByDayOfWeek,
  performanceByHour,
  performanceBySetup,
  performanceBySide,
  performanceByStrategy,
  performanceBySymbol,
} from "./grouping.js";
import { summarizeByDay, summarizeByMonth, summarizeByWeek } from "./time-buckets.js";

const tradeProjection = {
  id: true,
  symbol: true,
  side: true,
  status: true,
  entryTime: true,
  exitTime: true,
  netPnl: true,
  strategyId: true,
  setupId: true,
  strategy: { select: { name: true } },
  setup: { select: { name: true } },
} as const;

type ProjectedTrade = {
  id: string;
  symbol: string;
  side: AnalyticsTrade["side"];
  status: AnalyticsTrade["status"];
  entryTime: Date;
  exitTime: Date | null;
  netPnl: unknown;
  strategyId: string | null;
  setupId: string | null;
  strategy: { name: string } | null;
  setup: { name: string } | null;
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
    strategyId: trade.strategyId,
    strategyName: trade.strategy?.name ?? null,
    setupId: trade.setupId,
    setupName: trade.setup?.name ?? null,
  };
}

/** dateFrom/dateTo filter on exitTime (when P&L realizes) — distinct from the Journal's
 * entryTime-based date filter. Shared by the dashboard and the breakdowns endpoint so both
 * respect the same filter bar. */
function buildAnalyticsWhere(userId: string, filters: AnalyticsFilterQuery): Prisma.TradeWhereInput {
  return {
    userId,
    ...(filters.tradingAccountId ? { tradingAccountId: filters.tradingAccountId } : {}),
    ...(filters.symbol ? { symbol: { contains: filters.symbol.toUpperCase() } } : {}),
    ...(filters.side ? { side: filters.side } : {}),
    ...(filters.strategyId ? { strategyId: filters.strategyId } : {}),
    ...(filters.setupId ? { setupId: filters.setupId } : {}),
    ...(filters.tagIds && filters.tagIds.length > 0
      ? { tags: { some: { tagId: { in: filters.tagIds } } } }
      : {}),
    ...(filters.dateFrom || filters.dateTo
      ? {
          exitTime: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
  };
}

export async function getDashboardMetrics(userId: string, filters: AnalyticsFilterQuery) {
  const trades = await prisma.trade.findMany({
    where: buildAnalyticsWhere(userId, filters),
    select: tradeProjection,
  });
  return computeDashboardMetrics(trades.map(toAnalyticsTrade));
}

export async function getAnalyticsBreakdowns(userId: string, filters: AnalyticsFilterQuery) {
  const trades = await prisma.trade.findMany({
    where: buildAnalyticsWhere(userId, filters),
    select: tradeProjection,
  });
  const analyticsTrades = trades.map(toAnalyticsTrade);

  return {
    bySymbol: performanceBySymbol(analyticsTrades),
    byStrategy: performanceByStrategy(analyticsTrades),
    bySetup: performanceBySetup(analyticsTrades),
    bySide: performanceBySide(analyticsTrades),
    byHour: performanceByHour(analyticsTrades),
    byDayOfWeek: performanceByDayOfWeek(analyticsTrades),
    daily: summarizeByDay(analyticsTrades),
    weekly: summarizeByWeek(analyticsTrades),
    monthly: summarizeByMonth(analyticsTrades),
    winLossDistribution: computeWinLossDistribution(analyticsTrades),
  };
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

import { prisma } from "../../db/prisma.js";
import { computeDashboardMetrics, type AnalyticsTrade } from "./metrics.js";

export async function getDashboardMetrics(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId },
    select: {
      id: true,
      symbol: true,
      side: true,
      status: true,
      entryTime: true,
      exitTime: true,
      netPnl: true,
    },
  });

  const analyticsTrades: AnalyticsTrade[] = trades.map((t) => ({
    id: t.id,
    symbol: t.symbol,
    side: t.side,
    status: t.status,
    entryTime: t.entryTime,
    exitTime: t.exitTime,
    netPnl: t.netPnl != null ? Number(t.netPnl) : null,
  }));

  return computeDashboardMetrics(analyticsTrades);
}

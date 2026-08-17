import { z } from "zod";
import { TRADE_SIDES } from "../types/enums.js";

const tradeSideSchema = z.enum(TRADE_SIDES);

export const tradeRefSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  side: tradeSideSchema,
  netPnl: z.number(),
  exitTime: z.string(),
});
export type TradeRef = z.infer<typeof tradeRefSchema>;

export const tradingDayRefSchema = z.object({
  date: z.string(),
  netPnl: z.number(),
});
export type TradingDayRef = z.infer<typeof tradingDayRefSchema>;

export const equityCurvePointSchema = z.object({
  tradeId: z.string(),
  date: z.string(),
  cumulativePnl: z.number(),
});
export type EquityCurvePoint = z.infer<typeof equityCurvePointSchema>;

export const dashboardMetricsSchema = z.object({
  totalTrades: z.number(),
  closedTrades: z.number(),
  openTrades: z.number(),
  winningTrades: z.number(),
  losingTrades: z.number(),
  breakEvenTrades: z.number(),
  winRate: z.number().nullable(),
  netPnl: z.number(),
  grossProfit: z.number(),
  grossLoss: z.number(),
  profitFactor: z.number().nullable(),
  averageWinner: z.number().nullable(),
  averageLoser: z.number().nullable(),
  averageTrade: z.number().nullable(),
  averageRiskReward: z.number().nullable(),
  bestTrade: tradeRefSchema.nullable(),
  worstTrade: tradeRefSchema.nullable(),
  bestTradingDay: tradingDayRefSchema.nullable(),
  worstTradingDay: tradingDayRefSchema.nullable(),
  averageHoldingTimeMinutes: z.number().nullable(),
  maxConsecutiveWins: z.number(),
  maxConsecutiveLosses: z.number(),
  maxDrawdown: z.number(),
  equityCurve: z.array(equityCurvePointSchema),
});
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;

export const calendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});
export type CalendarQuery = z.infer<typeof calendarQuerySchema>;

export const tradingDaySummarySchema = z.object({
  date: z.string(),
  netPnl: z.number(),
  tradeCount: z.number(),
});
export type TradingDaySummary = z.infer<typeof tradingDaySummarySchema>;

export const calendarSummarySchema = z.object({
  days: z.array(tradingDaySummarySchema),
  monthlyNetPnl: z.number(),
  monthlyTradeCount: z.number(),
});
export type CalendarSummary = z.infer<typeof calendarSummarySchema>;

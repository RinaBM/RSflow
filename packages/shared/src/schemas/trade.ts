import { z } from "zod";
import { TRADE_SIDES, TRADE_STATUSES } from "../types/enums.js";
import { paginationQuerySchema } from "./common.js";

const tradeSideSchema = z.enum(TRADE_SIDES);
const tradeStatusSchema = z.enum(TRADE_STATUSES);

export const createTradeSchema = z
  .object({
    tradingAccountId: z.string().min(1),
    symbol: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .transform((s) => s.toUpperCase()),
    side: tradeSideSchema,
    entryTime: z.coerce.date(),
    exitTime: z.coerce.date().optional(),
    entryPrice: z.number().positive(),
    exitPrice: z.number().positive().optional(),
    quantity: z.number().positive(),
    fees: z.number().min(0).default(0),
    notes: z.string().max(5000).optional(),
    mistakesNotes: z.string().max(5000).optional(),
    tradingPlan: z.string().max(5000).optional(),
    followedPlan: z.boolean().optional(),
    emotionalState: z.string().max(200).optional(),
  })
  .refine((data) => !data.exitTime || data.exitTime >= data.entryTime, {
    message: "exitTime must be after entryTime",
    path: ["exitTime"],
  })
  .refine((data) => (data.exitPrice == null) === (data.exitTime == null), {
    message: "exitPrice and exitTime must be provided together",
    path: ["exitPrice"],
  });
export type CreateTradeInput = z.infer<typeof createTradeSchema>;

export const updateTradeSchema = z
  .object({
    tradingAccountId: z.string().min(1).optional(),
    symbol: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .transform((s) => s.toUpperCase())
      .optional(),
    side: tradeSideSchema.optional(),
    entryTime: z.coerce.date().optional(),
    exitTime: z.coerce.date().nullable().optional(),
    entryPrice: z.number().positive().optional(),
    exitPrice: z.number().positive().nullable().optional(),
    quantity: z.number().positive().optional(),
    fees: z.number().min(0).optional(),
    notes: z.string().max(5000).nullable().optional(),
    mistakesNotes: z.string().max(5000).nullable().optional(),
    tradingPlan: z.string().max(5000).nullable().optional(),
    followedPlan: z.boolean().nullable().optional(),
    emotionalState: z.string().max(200).nullable().optional(),
  })
  .refine((data) => !data.exitTime || !data.entryTime || data.exitTime >= data.entryTime, {
    message: "exitTime must be after entryTime",
    path: ["exitTime"],
  });
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;

export const tradeListQuerySchema = paginationQuerySchema.extend({
  tradingAccountId: z.string().optional(),
  symbol: z.string().optional(),
  side: tradeSideSchema.optional(),
  status: tradeStatusSchema.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
export type TradeListQuery = z.infer<typeof tradeListQuerySchema>;

export const tradeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tradingAccountId: z.string(),
  symbol: z.string(),
  side: tradeSideSchema,
  entryTime: z.string(),
  exitTime: z.string().nullable(),
  entryPrice: z.number(),
  exitPrice: z.number().nullable(),
  quantity: z.number(),
  fees: z.number(),
  grossPnl: z.number().nullable(),
  netPnl: z.number().nullable(),
  returnPct: z.number().nullable(),
  status: tradeStatusSchema,
  notes: z.string().nullable(),
  mistakesNotes: z.string().nullable(),
  tradingPlan: z.string().nullable(),
  followedPlan: z.boolean().nullable(),
  emotionalState: z.string().nullable(),
  source: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Trade = z.infer<typeof tradeSchema>;

import { z } from "zod";

export const createTradingAccountSchema = z.object({
  name: z.string().trim().min(1).max(120),
  broker: z.string().trim().min(1).max(120),
  currency: z.string().trim().length(3).default("USD"),
  startingBalance: z.number().finite().default(0),
});
export type CreateTradingAccountInput = z.infer<typeof createTradingAccountSchema>;

export const updateTradingAccountSchema = createTradingAccountSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateTradingAccountInput = z.infer<typeof updateTradingAccountSchema>;

export const tradingAccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  broker: z.string(),
  currency: z.string(),
  startingBalance: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type TradingAccount = z.infer<typeof tradingAccountSchema>;

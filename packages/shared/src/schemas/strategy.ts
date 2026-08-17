import { z } from "zod";

export const createStrategySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional(),
});
export type CreateStrategyInput = z.infer<typeof createStrategySchema>;

export const updateStrategySchema = createStrategySchema.partial();
export type UpdateStrategyInput = z.infer<typeof updateStrategySchema>;

export const strategySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
});
export type Strategy = z.infer<typeof strategySchema>;

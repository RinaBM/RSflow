import { z } from "zod";

export const createSetupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional(),
});
export type CreateSetupInput = z.infer<typeof createSetupSchema>;

export const updateSetupSchema = createSetupSchema.partial();
export type UpdateSetupInput = z.infer<typeof updateSetupSchema>;

export const setupSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
});
export type Setup = z.infer<typeof setupSchema>;

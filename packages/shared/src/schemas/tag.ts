import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(60),
  color: z.string().trim().max(20).optional(),
});
export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();
export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const tagSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  createdAt: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

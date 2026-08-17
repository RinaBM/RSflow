import { z } from "zod";

export const createMistakeCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
});
export type CreateMistakeCategoryInput = z.infer<typeof createMistakeCategorySchema>;

export const updateMistakeCategorySchema = createMistakeCategorySchema.partial();
export type UpdateMistakeCategoryInput = z.infer<typeof updateMistakeCategorySchema>;

export const mistakeCategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  createdAt: z.string(),
});
export type MistakeCategory = z.infer<typeof mistakeCategorySchema>;

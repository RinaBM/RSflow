import { z } from "zod";

export const genderSchema = z.enum(["MALE", "FEMALE"]);
export type Gender = z.infer<typeof genderSchema>;

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(1).max(120),
  gender: genderSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  gender: genderSchema.nullable(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

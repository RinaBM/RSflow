import { z } from "zod";
import { ATTACHMENT_TYPES } from "../types/enums.js";

export const createAttachmentSchema = z.object({
  url: z.string().trim().url().max(2000),
  type: z.enum(ATTACHMENT_TYPES),
  caption: z.string().trim().max(200).optional(),
});
export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>;

export const attachmentSchema = z.object({
  id: z.string(),
  tradeId: z.string(),
  url: z.string(),
  type: z.enum(ATTACHMENT_TYPES),
  caption: z.string().nullable(),
  createdAt: z.string(),
});
export type Attachment = z.infer<typeof attachmentSchema>;

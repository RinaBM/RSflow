import type { Request, Response } from "express";
import { createAttachment, deleteAttachment, listAttachments } from "./trade-attachment.service.js";

export async function list(req: Request, res: Response) {
  const items = await listAttachments(req.userId as string, req.params.tradeId as string);
  res.status(200).json({ items });
}

export async function create(req: Request, res: Response) {
  const attachment = await createAttachment(req.userId as string, req.params.tradeId as string, req.body);
  res.status(201).json({ attachment });
}

export async function remove(req: Request, res: Response) {
  await deleteAttachment(req.userId as string, req.params.tradeId as string, req.params.attachmentId as string);
  res.status(204).send();
}

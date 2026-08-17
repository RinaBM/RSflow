import type { Request, Response } from "express";
import { createTag, deleteTag, listTags, updateTag } from "./tag.service.js";

export async function list(req: Request, res: Response) {
  const items = await listTags(req.userId as string);
  res.status(200).json({ items });
}

export async function create(req: Request, res: Response) {
  const tag = await createTag(req.userId as string, req.body);
  res.status(201).json({ tag });
}

export async function update(req: Request, res: Response) {
  const tag = await updateTag(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ tag });
}

export async function remove(req: Request, res: Response) {
  await deleteTag(req.userId as string, req.params.id as string);
  res.status(204).send();
}

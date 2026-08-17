import type { Request, Response } from "express";
import {
  createMistakeCategory,
  deleteMistakeCategory,
  listMistakeCategories,
  updateMistakeCategory,
} from "./mistake-category.service.js";

export async function list(req: Request, res: Response) {
  const items = await listMistakeCategories(req.userId as string);
  res.status(200).json({ items });
}

export async function create(req: Request, res: Response) {
  const mistakeCategory = await createMistakeCategory(req.userId as string, req.body);
  res.status(201).json({ mistakeCategory });
}

export async function update(req: Request, res: Response) {
  const mistakeCategory = await updateMistakeCategory(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ mistakeCategory });
}

export async function remove(req: Request, res: Response) {
  await deleteMistakeCategory(req.userId as string, req.params.id as string);
  res.status(204).send();
}

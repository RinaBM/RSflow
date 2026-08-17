import type { Request, Response } from "express";
import { createStrategy, deleteStrategy, listStrategies, updateStrategy } from "./strategy.service.js";

export async function list(req: Request, res: Response) {
  const items = await listStrategies(req.userId as string);
  res.status(200).json({ items });
}

export async function create(req: Request, res: Response) {
  const strategy = await createStrategy(req.userId as string, req.body);
  res.status(201).json({ strategy });
}

export async function update(req: Request, res: Response) {
  const strategy = await updateStrategy(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ strategy });
}

export async function remove(req: Request, res: Response) {
  await deleteStrategy(req.userId as string, req.params.id as string);
  res.status(204).send();
}

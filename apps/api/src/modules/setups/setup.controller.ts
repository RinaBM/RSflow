import type { Request, Response } from "express";
import { createSetup, deleteSetup, listSetups, updateSetup } from "./setup.service.js";

export async function list(req: Request, res: Response) {
  const items = await listSetups(req.userId as string);
  res.status(200).json({ items });
}

export async function create(req: Request, res: Response) {
  const setup = await createSetup(req.userId as string, req.body);
  res.status(201).json({ setup });
}

export async function update(req: Request, res: Response) {
  const setup = await updateSetup(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ setup });
}

export async function remove(req: Request, res: Response) {
  await deleteSetup(req.userId as string, req.params.id as string);
  res.status(204).send();
}

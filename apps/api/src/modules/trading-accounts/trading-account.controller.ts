import type { Request, Response } from "express";
import {
  createTradingAccount,
  deleteTradingAccount,
  listTradingAccounts,
  updateTradingAccount,
} from "./trading-account.service.js";

export async function list(req: Request, res: Response) {
  const accounts = await listTradingAccounts(req.userId as string);
  res.status(200).json({ items: accounts });
}

export async function create(req: Request, res: Response) {
  const account = await createTradingAccount(req.userId as string, req.body);
  res.status(201).json({ account });
}

export async function update(req: Request, res: Response) {
  const account = await updateTradingAccount(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ account });
}

export async function remove(req: Request, res: Response) {
  await deleteTradingAccount(req.userId as string, req.params.id as string);
  res.status(204).send();
}

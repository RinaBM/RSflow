import type { Request, Response } from "express";
import type { TradeListQuery } from "@rs-flow/shared";
import { createTrade, deleteTrade, getTradeById, listRecentSymbols, listTrades, updateTrade } from "./trade.service.js";

export async function list(req: Request, res: Response) {
  const result = await listTrades(req.userId as string, req.query as unknown as TradeListQuery);
  res.status(200).json(result);
}

export async function recentSymbols(req: Request, res: Response) {
  const symbols = await listRecentSymbols(req.userId as string);
  res.status(200).json({ symbols });
}

export async function getOne(req: Request, res: Response) {
  const trade = await getTradeById(req.userId as string, req.params.id as string);
  res.status(200).json({ trade });
}

export async function create(req: Request, res: Response) {
  const trade = await createTrade(req.userId as string, req.body);
  res.status(201).json({ trade });
}

export async function update(req: Request, res: Response) {
  const trade = await updateTrade(req.userId as string, req.params.id as string, req.body);
  res.status(200).json({ trade });
}

export async function remove(req: Request, res: Response) {
  await deleteTrade(req.userId as string, req.params.id as string);
  res.status(204).send();
}

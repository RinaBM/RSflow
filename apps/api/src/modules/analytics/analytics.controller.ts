import type { Request, Response } from "express";
import { getDashboardMetrics } from "./analytics.service.js";

export async function dashboard(req: Request, res: Response) {
  const metrics = await getDashboardMetrics(req.userId as string);
  res.status(200).json(metrics);
}

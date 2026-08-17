import type { Request, Response } from "express";
import type { CalendarQuery } from "@rs-flow/shared";
import { getCalendarSummary, getDashboardMetrics } from "./analytics.service.js";

export async function dashboard(req: Request, res: Response) {
  const metrics = await getDashboardMetrics(req.userId as string);
  res.status(200).json(metrics);
}

export async function calendar(req: Request, res: Response) {
  const { year, month } = req.query as unknown as CalendarQuery;
  const summary = await getCalendarSummary(req.userId as string, year, month);
  res.status(200).json(summary);
}

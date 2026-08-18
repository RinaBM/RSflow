import type { Request, Response } from "express";
import type { AnalyticsFilterQuery, CalendarQuery } from "@rs-flow/shared";
import { getAnalyticsBreakdowns, getCalendarSummary, getDashboardMetrics } from "./analytics.service.js";

export async function dashboard(req: Request, res: Response) {
  const metrics = await getDashboardMetrics(req.userId as string, req.query as unknown as AnalyticsFilterQuery);
  res.status(200).json(metrics);
}

export async function breakdowns(req: Request, res: Response) {
  const result = await getAnalyticsBreakdowns(req.userId as string, req.query as unknown as AnalyticsFilterQuery);
  res.status(200).json(result);
}

export async function calendar(req: Request, res: Response) {
  const { year, month } = req.query as unknown as CalendarQuery;
  const summary = await getCalendarSummary(req.userId as string, year, month);
  res.status(200).json(summary);
}

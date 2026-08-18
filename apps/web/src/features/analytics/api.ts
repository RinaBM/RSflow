import type { AnalyticsBreakdowns, DashboardMetrics } from "@rs-flow/shared";
import { api } from "@/lib/api-client";
import type { AnalyticsFilters } from "@/store/analytics-filters-store";

function buildFilterQueryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.tradingAccountId) params.set("tradingAccountId", filters.tradingAccountId);
  if (filters.symbol) params.set("symbol", filters.symbol);
  if (filters.side) params.set("side", filters.side);
  if (filters.strategyId) params.set("strategyId", filters.strategyId);
  if (filters.setupId) params.set("setupId", filters.setupId);
  filters.tagIds.forEach((tagId) => params.append("tagIds", tagId));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const analyticsApi = {
  dashboard: (filters: AnalyticsFilters) =>
    api.get<DashboardMetrics>(`/analytics/dashboard${buildFilterQueryString(filters)}`),
  breakdowns: (filters: AnalyticsFilters) =>
    api.get<AnalyticsBreakdowns>(`/analytics/breakdowns${buildFilterQueryString(filters)}`),
};

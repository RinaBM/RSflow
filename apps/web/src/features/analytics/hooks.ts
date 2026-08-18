import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "./api";
import type { AnalyticsFilters } from "@/store/analytics-filters-store";

export function useDashboardMetrics(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["analytics", "dashboard", filters],
    queryFn: () => analyticsApi.dashboard(filters),
  });
}

export function useAnalyticsBreakdowns(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["analytics", "breakdowns", filters],
    queryFn: () => analyticsApi.breakdowns(filters),
  });
}

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "./api";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: analyticsApi.dashboard,
  });
}

import type { DashboardMetrics } from "@rs-flow/shared";
import { api } from "@/lib/api-client";

export const analyticsApi = {
  dashboard: () => api.get<DashboardMetrics>("/analytics/dashboard"),
};

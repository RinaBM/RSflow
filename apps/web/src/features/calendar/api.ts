import type { CalendarSummary } from "@rs-flow/shared";
import { api } from "@/lib/api-client";

export const calendarApi = {
  getSummary: (year: number, month: number) =>
    api.get<CalendarSummary>(`/analytics/calendar?year=${year}&month=${month}`),
};

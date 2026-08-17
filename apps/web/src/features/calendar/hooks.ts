import { useQuery } from "@tanstack/react-query";
import { calendarApi } from "./api";

export function useCalendarSummary(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => calendarApi.getSummary(year, month),
  });
}

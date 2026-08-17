import type { CreateTradeInput, Paginated, Trade, TradeListQuery, UpdateTradeInput } from "@rs-flow/shared";
import { api } from "@/lib/api-client";

function buildQueryString(query: Partial<TradeListQuery>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, value instanceof Date ? value.toISOString() : String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const tradesApi = {
  list: (query: Partial<TradeListQuery>) => api.get<Paginated<Trade>>(`/trades${buildQueryString(query)}`),
  create: (input: CreateTradeInput) => api.post<{ trade: Trade }>("/trades", input),
  update: (id: string, input: UpdateTradeInput) => api.patch<{ trade: Trade }>(`/trades/${id}`, input),
  remove: (id: string) => api.delete<void>(`/trades/${id}`),
};

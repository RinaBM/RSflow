import type {
  Attachment,
  CreateAttachmentInput,
  CreateTradeInput,
  Paginated,
  Trade,
  TradeDetail,
  TradeListQuery,
  UpdateTradeInput,
} from "@rs-flow/shared";
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
  getById: (id: string) => api.get<{ trade: TradeDetail }>(`/trades/${id}`),
  create: (input: CreateTradeInput) => api.post<{ trade: Trade }>("/trades", input),
  update: (id: string, input: UpdateTradeInput) => api.patch<{ trade: Trade }>(`/trades/${id}`, input),
  remove: (id: string) => api.delete<void>(`/trades/${id}`),
};

export const tradeAttachmentsApi = {
  list: (tradeId: string) => api.get<{ items: Attachment[] }>(`/trades/${tradeId}/attachments`),
  create: (tradeId: string, input: CreateAttachmentInput) =>
    api.post<{ attachment: Attachment }>(`/trades/${tradeId}/attachments`, input),
  remove: (tradeId: string, attachmentId: string) =>
    api.delete<void>(`/trades/${tradeId}/attachments/${attachmentId}`),
};

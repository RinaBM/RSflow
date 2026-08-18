import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { CreateAttachmentInput, TradeListQuery, UpdateTradeInput } from "@rs-flow/shared";
import { tradeAttachmentsApi, tradesApi } from "./api";

export const TRADES_QUERY_KEY = ["trades"] as const;

export function useTrades(query: Partial<TradeListQuery>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...TRADES_QUERY_KEY, query],
    queryFn: () => tradesApi.list(query),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}

export function useRecentSymbols() {
  return useQuery({
    queryKey: [...TRADES_QUERY_KEY, "symbols"],
    queryFn: tradesApi.recentSymbols,
    staleTime: 60_000,
  });
}

export function useTrade(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...TRADES_QUERY_KEY, "detail", id],
    queryFn: () => tradesApi.getById(id),
    enabled: (options?.enabled ?? true) && Boolean(id),
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tradesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADES_QUERY_KEY }),
  });
}

export function useUpdateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & UpdateTradeInput) => tradesApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADES_QUERY_KEY }),
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tradesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADES_QUERY_KEY }),
  });
}

export function useAddAttachment(tradeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAttachmentInput) => tradeAttachmentsApi.create(tradeId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...TRADES_QUERY_KEY, "detail", tradeId] }),
  });
}

export function useDeleteAttachment(tradeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: string) => tradeAttachmentsApi.remove(tradeId, attachmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...TRADES_QUERY_KEY, "detail", tradeId] }),
  });
}

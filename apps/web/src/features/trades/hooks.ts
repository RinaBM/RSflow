import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { TradeListQuery, UpdateTradeInput } from "@rs-flow/shared";
import { tradesApi } from "./api";

export const TRADES_QUERY_KEY = ["trades"] as const;

export function useTrades(query: Partial<TradeListQuery>) {
  return useQuery({
    queryKey: [...TRADES_QUERY_KEY, query],
    queryFn: () => tradesApi.list(query),
    placeholderData: keepPreviousData,
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

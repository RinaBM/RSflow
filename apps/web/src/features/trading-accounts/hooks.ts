import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tradingAccountsApi } from "./api";

export const TRADING_ACCOUNTS_QUERY_KEY = ["trading-accounts"] as const;

export function useTradingAccounts() {
  return useQuery({
    queryKey: TRADING_ACCOUNTS_QUERY_KEY,
    queryFn: tradingAccountsApi.list,
  });
}

export function useCreateTradingAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tradingAccountsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADING_ACCOUNTS_QUERY_KEY }),
  });
}

export function useUpdateTradingAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof tradingAccountsApi.update>[1]) =>
      tradingAccountsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADING_ACCOUNTS_QUERY_KEY }),
  });
}

export function useDeleteTradingAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tradingAccountsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRADING_ACCOUNTS_QUERY_KEY }),
  });
}

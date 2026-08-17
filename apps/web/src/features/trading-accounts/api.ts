import type {
  CreateTradingAccountInput,
  TradingAccount,
  UpdateTradingAccountInput,
} from "@rs-flow/shared";
import { api } from "@/lib/api-client";

export const tradingAccountsApi = {
  list: () => api.get<{ items: TradingAccount[] }>("/trading-accounts"),
  create: (input: CreateTradingAccountInput) =>
    api.post<{ account: TradingAccount }>("/trading-accounts", input),
  update: (id: string, input: UpdateTradingAccountInput) =>
    api.patch<{ account: TradingAccount }>(`/trading-accounts/${id}`, input),
  remove: (id: string) => api.delete<void>(`/trading-accounts/${id}`),
};

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  tradingAccountId?: string;
  symbol?: string;
  side?: "LONG" | "SHORT";
  strategyId?: string;
  setupId?: string;
  tagIds: string[];
}

interface AnalyticsFiltersStore extends AnalyticsFilters {
  setFilter: <K extends keyof AnalyticsFilters>(key: K, value: AnalyticsFilters[K]) => void;
  toggleTag: (tagId: string) => void;
  reset: () => void;
}

const initialFilters: AnalyticsFilters = { tagIds: [] };

/** Shared filter state for the Dashboard and Analytics pages — set a filter on one page and it
 * stays applied when navigating to the other, per the "shared filters" requirement. */
export const useAnalyticsFiltersStore = create<AnalyticsFiltersStore>((set) => ({
  ...initialFilters,
  setFilter: (key, value) => set({ [key]: value }),
  toggleTag: (tagId) =>
    set((state) => ({
      tagIds: state.tagIds.includes(tagId) ? state.tagIds.filter((t) => t !== tagId) : [...state.tagIds, tagId],
    })),
  reset: () => set(initialFilters),
}));

/** Selects only the filter data (no action functions) — pass this straight to the analytics
 * query hooks so the query key stays a clean, stable data snapshot. */
export function useAnalyticsFilterValues(): AnalyticsFilters {
  return useAnalyticsFiltersStore(
    useShallow((s) => ({
      dateFrom: s.dateFrom,
      dateTo: s.dateTo,
      tradingAccountId: s.tradingAccountId,
      symbol: s.symbol,
      side: s.side,
      strategyId: s.strategyId,
      setupId: s.setupId,
      tagIds: s.tagIds,
    })),
  );
}

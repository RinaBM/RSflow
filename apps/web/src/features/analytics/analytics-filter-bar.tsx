import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTradingAccounts } from "@/features/trading-accounts/hooks";
import { strategyHooks } from "@/features/strategies/hooks";
import { setupHooks } from "@/features/setups/hooks";
import { tagHooks } from "@/features/tags/hooks";
import { useAnalyticsFiltersStore } from "@/store/analytics-filters-store";

export function AnalyticsFilterBar() {
  const { t } = useTranslation();
  const filters = useAnalyticsFiltersStore();
  const { data: accounts } = useTradingAccounts();
  const { data: strategies } = strategyHooks.useList();
  const { data: setups } = setupHooks.useList();
  const { data: tags } = tagHooks.useList();

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.tradingAccountId ||
    filters.symbol ||
    filters.side ||
    filters.strategyId ||
    filters.setupId ||
    filters.tagIds.length > 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.from")}</label>
          <Input
            type="date"
            className="w-36"
            value={filters.dateFrom ?? ""}
            onChange={(e) => filters.setFilter("dateFrom", e.target.value || undefined)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.to")}</label>
          <Input
            type="date"
            className="w-36"
            value={filters.dateTo ?? ""}
            onChange={(e) => filters.setFilter("dateTo", e.target.value || undefined)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.account")}</label>
          <Select
            className="w-40"
            value={filters.tradingAccountId ?? ""}
            onChange={(e) => filters.setFilter("tradingAccountId", e.target.value || undefined)}
          >
            <option value="">{t("filters.allAccounts")}</option>
            {accounts?.items.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.symbol")}</label>
          <Input
            className="w-28"
            value={filters.symbol ?? ""}
            onChange={(e) => filters.setFilter("symbol", e.target.value.toUpperCase() || undefined)}
            placeholder="AAPL"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.side")}</label>
          <Select
            className="w-28"
            value={filters.side ?? ""}
            onChange={(e) => filters.setFilter("side", (e.target.value || undefined) as "LONG" | "SHORT" | undefined)}
          >
            <option value="">{t("filters.longShort")}</option>
            <option value="LONG">{t("filters.long")}</option>
            <option value="SHORT">{t("filters.short")}</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.strategy")}</label>
          <Select
            className="w-36"
            value={filters.strategyId ?? ""}
            onChange={(e) => filters.setFilter("strategyId", e.target.value || undefined)}
          >
            <option value="">{t("filters.allStrategies")}</option>
            {strategies?.items.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{t("filters.setup")}</label>
          <Select
            className="w-36"
            value={filters.setupId ?? ""}
            onChange={(e) => filters.setFilter("setupId", e.target.value || undefined)}
          >
            <option value="">{t("filters.allSetups")}</option>
            {setups?.items.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={() => filters.reset()}>
            {t("filters.clearFilters")}
          </Button>
        ) : null}
      </div>

      {tags?.items.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("filters.tags")}</span>
          {tags.items.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => filters.toggleTag(tag.id)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                filters.tagIds.includes(tag.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { TaxonomyManager } from "@/features/taxonomies/taxonomy-manager";
import { strategyHooks } from "@/features/strategies/hooks";
import { setupHooks } from "@/features/setups/hooks";
import { tagHooks } from "@/features/tags/hooks";
import { mistakeCategoryHooks } from "@/features/mistake-categories/hooks";

const TABS = ["Strategies", "Setups", "Tags", "Mistakes"] as const;
type Tab = (typeof TABS)[number];

export function StrategiesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("Strategies");

  const tabLabels: Record<Tab, string> = {
    Strategies: t("strategiesPage.tabs.strategies"),
    Setups: t("strategiesPage.tabs.setups"),
    Tags: t("strategiesPage.tabs.tags"),
    Mistakes: t("strategiesPage.tabs.mistakes"),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("strategiesPage.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("strategiesPage.subtitle")}</p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab === "Strategies" ? (
        <TaxonomyManager
          title={tabLabels.Strategies}
          singularLabel={t("strategiesPage.strategySingular")}
          hooks={strategyHooks}
          withDescription
        />
      ) : null}
      {activeTab === "Setups" ? (
        <TaxonomyManager
          title={tabLabels.Setups}
          singularLabel={t("strategiesPage.setupSingular")}
          hooks={setupHooks}
          withDescription
        />
      ) : null}
      {activeTab === "Tags" ? (
        <TaxonomyManager title={tabLabels.Tags} singularLabel={t("strategiesPage.tagSingular")} hooks={tagHooks} withColor />
      ) : null}
      {activeTab === "Mistakes" ? (
        <TaxonomyManager
          title={t("strategiesPage.mistakesTitle")}
          singularLabel={t("strategiesPage.mistakeSingular")}
          hooks={mistakeCategoryHooks}
        />
      ) : null}
    </div>
  );
}

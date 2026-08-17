import { useState } from "react";
import { cn } from "@/lib/utils";
import { TaxonomyManager } from "@/features/taxonomies/taxonomy-manager";
import { strategyHooks } from "@/features/strategies/hooks";
import { setupHooks } from "@/features/setups/hooks";
import { tagHooks } from "@/features/tags/hooks";
import { mistakeCategoryHooks } from "@/features/mistake-categories/hooks";

const TABS = ["Strategies", "Setups", "Tags", "Mistakes"] as const;
type Tab = (typeof TABS)[number];

export function StrategiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Strategies");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Strategies</h1>
        <p className="text-sm text-muted-foreground">
          Manage the Strategies, Setups, Tags and Mistake Categories you use to tag trades.
        </p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Strategies" ? (
        <TaxonomyManager title="Strategies" singularLabel="strategy" hooks={strategyHooks} withDescription />
      ) : null}
      {activeTab === "Setups" ? (
        <TaxonomyManager title="Setups" singularLabel="setup" hooks={setupHooks} withDescription />
      ) : null}
      {activeTab === "Tags" ? (
        <TaxonomyManager title="Tags" singularLabel="tag" hooks={tagHooks} withColor />
      ) : null}
      {activeTab === "Mistakes" ? (
        <TaxonomyManager title="Mistake categories" singularLabel="mistake category" hooks={mistakeCategoryHooks} />
      ) : null}
    </div>
  );
}

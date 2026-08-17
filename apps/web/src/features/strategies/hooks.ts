import type { Strategy } from "@rs-flow/shared";
import { createTaxonomyApi } from "@/features/taxonomies/api";
import { createTaxonomyHooks } from "@/features/taxonomies/hooks";

const strategiesApi = createTaxonomyApi<Strategy>("strategies", "strategy");
export const strategyHooks = createTaxonomyHooks("strategies", strategiesApi);

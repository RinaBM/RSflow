import type { Setup } from "@rs-flow/shared";
import { createTaxonomyApi } from "@/features/taxonomies/api";
import { createTaxonomyHooks } from "@/features/taxonomies/hooks";

const setupsApi = createTaxonomyApi<Setup>("setups", "setup");
export const setupHooks = createTaxonomyHooks("setups", setupsApi);

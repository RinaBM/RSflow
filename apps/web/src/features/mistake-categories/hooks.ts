import type { MistakeCategory } from "@rs-flow/shared";
import { createTaxonomyApi } from "@/features/taxonomies/api";
import { createTaxonomyHooks } from "@/features/taxonomies/hooks";

const mistakeCategoriesApi = createTaxonomyApi<MistakeCategory>("mistake-categories", "mistakeCategory");
export const mistakeCategoryHooks = createTaxonomyHooks("mistake-categories", mistakeCategoriesApi);

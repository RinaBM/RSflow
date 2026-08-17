import type { Tag } from "@rs-flow/shared";
import { createTaxonomyApi } from "@/features/taxonomies/api";
import { createTaxonomyHooks } from "@/features/taxonomies/hooks";

const tagsApi = createTaxonomyApi<Tag>("tags", "tag");
export const tagHooks = createTaxonomyHooks("tags", tagsApi);

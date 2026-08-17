import { api } from "@/lib/api-client";

export interface TaxonomyItem {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

export function createTaxonomyApi<T extends TaxonomyItem>(resourcePath: string, itemKey: string) {
  return {
    list: () => api.get<{ items: T[] }>(`/${resourcePath}`),
    create: (input: Record<string, unknown>) =>
      api.post<Record<string, T>>(`/${resourcePath}`, input).then((res) => res[itemKey] as T),
    update: (id: string, input: Record<string, unknown>) =>
      api.patch<Record<string, T>>(`/${resourcePath}/${id}`, input).then((res) => res[itemKey] as T),
    remove: (id: string) => api.delete<void>(`/${resourcePath}/${id}`),
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { createTaxonomyApi, TaxonomyItem } from "./api";

export function createTaxonomyHooks<T extends TaxonomyItem>(
  queryKeyRoot: string,
  resourceApi: ReturnType<typeof createTaxonomyApi<T>>,
) {
  const queryKey = [queryKeyRoot] as const;

  function useList() {
    return useQuery({ queryKey, queryFn: resourceApi.list });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: resourceApi.create,
      onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, ...input }: { id: string } & Record<string, unknown>) =>
        resourceApi.update(id, input),
      onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: resourceApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });
  }

  return { useList, useCreate, useUpdate, useRemove };
}

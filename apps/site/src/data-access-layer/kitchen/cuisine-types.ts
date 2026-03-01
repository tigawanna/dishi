import { honoClient } from "@/lib/api/client";
import { queryOptions } from "@tanstack/react-query";
import { queryKeyPrefixes } from "../query-keys";

export const cuisineTypesQueryOptions = (params?: { page?: number; perPage?: number }) =>
  queryOptions({
    queryKey: [queryKeyPrefixes.cuisineTypes, params?.page ?? 1, params?.perPage ?? 100] as const,
    queryFn: async () => {
      const response = await (honoClient as any)["api/kitchen/cuisines"].$get({
        query: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 100,
          sortBy: "name",
          sortOrder: "asc",
        },
      });
      if (!response.ok) throw new Error(String(response.error));
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });

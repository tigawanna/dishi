import { treatyClient } from "@/lib/elysia/eden-treaty";
import { queryOptions } from "@tanstack/react-query";
import { queryKeyPrefixes } from "../query-keys";

export const cuisineTypesQueryOptions = (params?: { page?: number; perPage?: number }) =>
  queryOptions({
    queryKey: [queryKeyPrefixes.cuisineTypes, params?.page ?? 1, params?.perPage ?? 100] as const,
    queryFn: async () => {
      const { data, error } = await treatyClient.kitchen.cuisines.get({
        query: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 100,
          sortBy: "name",
          sortOrder: "asc",
        },
      });
      if (error) throw new Error(String(error));
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });

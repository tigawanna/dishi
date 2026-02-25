/**
 * Admin Users Collection using TanStack DB Query Collection
 * Fetches all users for admin management
 * Filtering and sorting done client-side via TanStack DB select/where syntax
 */

import { authClient } from "@/lib/better-auth/client";
import { treatyClient } from "@/lib/elysia/eden-treaty";
import { parseParameterizedSorts, parseWhereWithHandlers } from "@/lib/tanstack/db/utils";
import { queryClient } from "@/lib/tanstack/query/queryclient";

import { createCollection, parseLoadSubsetOptions } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

type OrganizationMembersWhereClause = {
  page?: { _eq: number };
  _and?: OrganizationMembersWhereClause[];
  [key: string]: any;
};
export const adminUsersCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["users"],
    queryFn: async (ctx) => {
      const loadedSubs = ctx.meta?.loadSubsetOptions;
      const { sorts } = parseLoadSubsetOptions(ctx.meta?.loadSubsetOptions);
      const { asc, desc } = parseParameterizedSorts(sorts);
      const where = parseWhereWithHandlers<OrganizationMembersWhereClause>(loadedSubs?.where);

      const page = (where?.page?._eq as number) || 1;
      const response = await treatyClient.admin.users.get({
        query: {
          page: page,
          perPage: loadedSubs?.limit ?? 24,
          sortBy: asc?.length ? asc[0] : desc?.length ? desc[0] : undefined,
          sortOrder: asc?.length ? "asc" : desc?.length ? "desc" : "desc",
        },
      });
      ctx.client.setQueriesData(
        {
          queryKey: ["users", page],
        },
        () => {
          if (!response?.data) {
            return {
              page,
              perPage: 0,
              totalItems: 0,
              totalPages: 0,
              status: "error",
            };
          }
          const { items, ...metadata } = response?.data;
          return metadata;
        },
      );
      const members = response.data?.items;
      return members?.map((member) => ({ ...member, page })) ?? [];
    },
    queryClient,
    getKey: (item) => item.id,
  }),
);

/**
 * Organization Members Collection using TanStack DB Query Collection
 * Fetches all members for a specific organization
 * Filtering and sorting done client-side via TanStack DB select/where syntax
 */

import { authClient } from "@/lib/better-auth/client";
import { treatyClient } from "@/lib/elysia/eden-treaty";
import { parseParameterizedSorts, parseWhereWithHandlers } from "@/lib/tanstack/db/utils";
import { queryClient } from "@/lib/tanstack/query/queryclient";
import { createCollection, parseLoadSubsetOptions } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

type OrganizationMembersWhereClause = {
  organizationId?: { _eq: string };
  page?: { _eq: number };
  _and?: OrganizationMembersWhereClause[];
  [key: string]: any;
};

export const organizationMembersCollection = createCollection(
  queryCollectionOptions({
    syncMode: "on-demand", // ← New!
    queryKey: ["organizations", "members"],
    queryFn: async (ctx) => {
      const loadedSubs = ctx.meta?.loadSubsetOptions;
      const { sorts } = parseLoadSubsetOptions(ctx.meta?.loadSubsetOptions);
      const { asc, desc } = parseParameterizedSorts(sorts);
      const where = parseWhereWithHandlers<OrganizationMembersWhereClause>(loadedSubs?.where);

      const organizationId = where?.organizationId?._eq as string;
      const page = (where?.page?._eq as number) || 1;
      const response = await treatyClient.admin
        .organizations({
          id: organizationId,
        })
        .members.get({
          query: {
            page: page,
            perPage: loadedSubs?.limit ?? 24,
            sortBy: asc?.length ? asc[0] : desc?.length ? desc[0] : undefined,
            sortOrder: asc?.length ? "asc" : desc?.length ? "desc" : "desc",
          },
        });

      ctx.client.setQueriesData(
        {
          queryKey: ["organizations", "members", organizationId, page, "metadata"],
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
    getKey: (item) => item.userId,
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            const { data, error } = await authClient.organization.updateMemberRole({
              organizationId: m.modified.organizationId,
              role: m.modified.role,
              memberId: m.key,
            });
            if (error) throw error;
            return data;
          };
        }),
      );
      return { refetch: true };
    },
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            const { error } = await authClient.organization.removeMember({
              organizationId: m.original.organizationId,
              memberIdOrEmail: m.key,
            });
            if (error) throw error;
          };
        }),
      );
      return { refetch: true };
    },
  }),
);

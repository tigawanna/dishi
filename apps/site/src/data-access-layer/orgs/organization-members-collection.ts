/**
 * Organization Members Collection using TanStack DB Query Collection
 * Fetches all members for a specific organization
 * Filtering and sorting done client-side via TanStack DB select/where syntax
 */

import { db } from "@/db/client";
import {
  buildOrderBy,
  buildPaginatedResponse,
  calculateOffset,
  listQueryParamsSchema,
} from "@/db/helpers/QueryEngine";
import { member, user } from "@/db/schema";
import { authClient } from "@/lib/better-auth/client";
import { parseParameterizedSorts, parseWhereWithHandlers } from "@/lib/tanstack/db/utils";
import { queryClient } from "@/lib/tanstack/query/queryclient";
import { createCollection, parseLoadSubsetOptions } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, ilike, SQL } from "drizzle-orm";
import z from "zod";

type OrganizationMembersWhereClause = {
  organizationId?: { _eq: string };
  page?: { _eq: number };
  _and?: OrganizationMembersWhereClause[];
  [key: string]: any;
};

const organizationMembersServerFn = createServerFn()
  .inputValidator(
    listQueryParamsSchema.extend({
      organizationId: z.string(),
    }),
  )
  .handler(async (ctx) => {
    try {
      const { searchTerm, searchOn, page, perPage, sortBy, sortOrder, organizationId } = ctx.data;
      const offset = calculateOffset(page, perPage);

      // Build where conditions
      const conditions: SQL<unknown>[] = [eq(member.organizationId, organizationId)];

      // Add search conditions if provided
      if (searchTerm && searchOn && searchOn.length > 0) {
        const searchConditions = searchOn
          .map((field) => {
            // Search in member fields
            if (field === "role") {
              return ilike(member.role, `%${searchTerm}%`);
            }
            // Search in user fields
            if (field === "name") {
              return ilike(user.name, `%${searchTerm}%`);
            }
            if (field === "email") {
              return ilike(user.email, `%${searchTerm}%`);
            }
            return null;
          })
          .filter((cond): cond is ReturnType<typeof ilike> => cond !== null);

        if (searchConditions && searchConditions.length > 0) {
          // @ts-expect-error: SQL type
          conditions.push(or(...searchConditions));
        }
      }

      // Get total count with join
      const [{ count: totalItems }] = await db
        .select({ count: count() })
        .from(member)
        .leftJoin(user, eq(member.userId, user.id))
        .where(and(...conditions));

      // Fetch members with pagination using query builder for proper join
      const membersData = await db
        .select({
          member: member,
          user: user,
        })
        .from(member)
        .leftJoin(user, eq(member.userId, user.id))
        .where(and(...conditions))
        .limit(perPage)
        .offset(offset)
        .orderBy(
          buildOrderBy({
            sortBy,
            sortOrder,
            columnMap: {
              role: member.role,
              createdAt: member.createdAt,
            },
            defaultColumn: member.createdAt,
          }),
        );

      // Transform to match the expected structure
      const members = membersData.map((row) => ({
        ...row.member,
        user: row.user,
      }));

      return buildPaginatedResponse({
        items: members,
        page,
        perPage,
        totalItems,
      });
    } catch (error) {
      return {
        items: [],
        page: 0,
        perPage: 0,
        totalItems: 0,
        totalPages: 0,
        status: "error",
      };
    }
  });

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
      const response = await organizationMembersServerFn({
        data: {
          organizationId,
          page,
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
          if (response.status !== "success") {
            return {
              page,
              perPage: 0,
              totalItems: 0,
              totalPages: 0,
              status: "error",
            };
          }
          const { items, ...metadata } = response;
          return metadata;
        },
      );
      const members = response?.items;
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

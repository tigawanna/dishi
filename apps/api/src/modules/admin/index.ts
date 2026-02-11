import { db } from "@backend/db/client";
import {
  buildOrderBy,
  buildPaginatedResponse,
  calculateOffset,
  listQueryParamsSchema,
  SimpleQueryEngine,
} from "@backend/db/helpers/QueryEngine";
import { member, organization, user } from "@backend/db/schema";
import { auth } from "@backend/lib/auth";
import { adminRoleSchema } from "@backend/lib/extras";
import { betterAuthZMiddleware } from "@backend/middleware/better-auth-authz";
import { and, count, eq, ilike, or, SQL } from "drizzle-orm";

import { Elysia, status } from "elysia";
import { z } from "zod";

/**
 * Payload schema for adding a member to an organization.
 * Used for type inference and runtime validation.
 */
const addMemberRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
  role: adminRoleSchema,
});

export type AddMemberRequest = z.infer<typeof addMemberRequestSchema>;

export const adminRoute = new Elysia()
  .use(betterAuthZMiddleware)
  .get(
    "/admin",
    ({ headers, cookie }) => {
      return { message: "hello world", status: "ok" };
    },
    {
      auth: true,
    },
  )
  .get(
    "/admin/organizations",
    async ({ headers, query }) => {
      try {
        const org = new SimpleQueryEngine(organization);
        const paginatedOrgs = await org.listPaged({
          searchOn: ["name", "slug"],
          searchTerm: query.searchTerm,
          page: query.page,
          perPage: query.perPage,
          sortBy: query.sortBy as keyof typeof organization.$inferSelect,
          sortOrder: query.sortOrder,
        });
        return paginatedOrgs;
      } catch (error) {
        return status(500, {
          status: "error",
          message: error instanceof Error ? error.message : "Failed to fetch organizations",
        });
      }
    },
    {
      requireRole: ["owner"],
      query: listQueryParamsSchema,
    },
  )
  .get(
    "/admin/organizations/:id/members",
    async ({ headers, query, params }) => {
      try {
        const { searchTerm, searchOn, page, perPage, sortBy, sortOrder } = query;
        const offset = calculateOffset(page, perPage);

        // Build where conditions
        const conditions: SQL<unknown>[] = [eq(member.organizationId, params.id)];

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
        return status(500, {
          status: "error",
          message: error instanceof Error ? error.message : "Failed to fetch members",
        });
      }
    },
    {
      requireRole: ["owner"],
      query: listQueryParamsSchema,
    },
  )
  .get(
    "/admin/users",
    async ({ headers, query }) => {
      try {
        const usersQueryEngine = new SimpleQueryEngine(user);
        const paginatedUsers = await usersQueryEngine.listPaged({
          searchOn: ["name", "email"],
          searchTerm: query.searchTerm,
          page: query.page,
          perPage: query.perPage,
          sortBy: query.sortBy as keyof typeof user.$inferSelect,
          sortOrder: query.sortOrder,
        });
        return paginatedUsers;
      } catch (error) {
        return status(500, {
          status: "error",
          message: error instanceof Error ? error.message : "Failed to fetch users",
        });
      }
    },
    {
      requireRole: ["owner"],
      query: listQueryParamsSchema,
    },
  )
  .post(
    "/admin/add-to-organization",
    ({ body, user }) => {
      return auth.api.addMember({
        body: {
          userId: body.userId,
          organizationId: body.organizationId,
          role: body.role,
        },
      });
    },
    {
      body: addMemberRequestSchema,
      // Require owner role (platform super admin)
      requireRole: ["owner"],
    },
  );

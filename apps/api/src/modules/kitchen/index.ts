import { db } from "@backend/db/client";
import {
  buildOrderBy,
  buildPaginatedResponse,
  calculateOffset,
  createSimpleQueryEngine,
  listQueryParamsSchema,
} from "@backend/db/helpers/QueryEngine";
import { cuisineType, kitchenCuisine, kitchenProfile } from "@backend/db/schema";
import { betterAuthZMiddleware } from "@backend/middleware/better-auth-authz";
import { and, count, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { Elysia, status } from "elysia";
import { z } from "zod";

const DAYS_OF_WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const createKitchenProfileSchema = z.object({
  organizationId: z.string().min(1),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  deliveryRadiusKm: z.string().optional(),
  opensAt: z.string().optional(),
  closesAt: z.string().optional(),
  operatingDays: z.array(z.enum(DAYS_OF_WEEK)).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
});

const updateKitchenProfileSchema = createKitchenProfileSchema
  .omit({ organizationId: true })
  .partial();

const setCuisinesSchema = z.object({
  cuisineIds: z.array(z.string().min(1)),
});

export const kitchenRoute = new Elysia({ name: "kitchen", prefix: "/kitchen" })
  .use(betterAuthZMiddleware)

  .post(
    "/profile",
    async ({ body, set }) => {
      try {
        const id = crypto.randomUUID();
        const [profile] = await db
          .insert(kitchenProfile)
          .values({
            id,
            organizationId: body.organizationId,
            description: body.description,
            phone: body.phone,
            address: body.address,
            neighborhood: body.neighborhood,
            deliveryRadiusKm: body.deliveryRadiusKm,
            opensAt: body.opensAt,
            closesAt: body.closesAt,
            operatingDays: body.operatingDays,
            coverImage: body.coverImage || undefined,
          })
          .returning();

        set.status = 201;
        return { item: profile };
      } catch (err) {
        if (err instanceof Error && err.message.includes("unique")) {
          return status(409, {
            error: "A kitchen profile already exists for this organization",
          });
        }
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to create kitchen profile",
        });
      }
    },
    {
      auth: true,
      body: createKitchenProfileSchema,
    },
  )

  .patch(
    "/profile/:id",
    async ({ params, body }) => {
      try {
        const updateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(body)) {
          if (value !== undefined) {
            updateData[key] = value;
          }
        }

        if (Object.keys(updateData).length === 0) {
          return status(400, { error: "No fields to update" });
        }

        const [profile] = await db
          .update(kitchenProfile)
          .set(updateData)
          .where(eq(kitchenProfile.id, params.id))
          .returning();

        if (!profile) {
          return status(404, { error: "Kitchen profile not found" });
        }

        return { item: profile };
      } catch (err) {
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to update kitchen profile",
        });
      }
    },
    {
      auth: true,
      body: updateKitchenProfileSchema,
    },
  )

  .get(
    "/profile/by-org/:orgId",
    async ({ params }) => {
      try {
        const [profile] = await db
          .select()
          .from(kitchenProfile)
          .where(eq(kitchenProfile.organizationId, params.orgId))
          .limit(1);

        if (!profile) {
          return status(404, { error: "Kitchen profile not found for this organization" });
        }

        return { item: profile };
      } catch (err) {
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to fetch kitchen profile",
        });
      }
    },
    { auth: true },
  )

  .get(
    "/cuisines",
    async ({ query }) => {
      try {
        const engine = createSimpleQueryEngine(cuisineType);
        const result = await engine.listPaged({
          page: query.page,
          perPage: query.perPage,
          sortBy: query.sortBy as keyof typeof cuisineType.$inferSelect,
          sortOrder: query.sortOrder,
          searchTerm: query.searchTerm,
          searchOn:
            query.searchOn?.length && query.searchOn.length > 0
              ? (query.searchOn as (keyof typeof cuisineType.$inferSelect)[])
              : ["name", "slug"],
        });
        return result;
      } catch (err) {
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to fetch cuisine types",
        });
      }
    },
    {
      auth: true,
      query: listQueryParamsSchema,
    },
  )

  .get(
    "/profile/:kitchenId/cuisines",
    async ({ params, query }) => {
      try {
        const { page = 1, perPage = 30, searchTerm, searchOn, sortBy, sortOrder = "asc" } = query;
        const offset = calculateOffset(page, perPage);

        const conditions: SQL[] = [eq(kitchenCuisine.kitchenId, params.kitchenId)];

        if (searchTerm) {
          const searchFields = searchOn?.length ? searchOn : ["name", "slug"];
          const searchConditions = searchFields
            .map((field) => {
              if (field === "name") return ilike(cuisineType.name, `%${searchTerm}%`);
              if (field === "slug") return ilike(cuisineType.slug, `%${searchTerm}%`);
              return null;
            })
            .filter((cond): cond is ReturnType<typeof ilike> => cond !== null);

          if (searchConditions.length > 0) {
            conditions.push(or(...searchConditions)!);
          }
        }

        const whereClause = and(...conditions);

        const [{ count: totalItems }] = await db
          .select({ count: count() })
          .from(kitchenCuisine)
          .innerJoin(cuisineType, eq(kitchenCuisine.cuisineId, cuisineType.id))
          .where(whereClause);

        const items = await db
          .select({
            cuisineId: kitchenCuisine.cuisineId,
            name: cuisineType.name,
            slug: cuisineType.slug,
            icon: cuisineType.icon,
          })
          .from(kitchenCuisine)
          .innerJoin(cuisineType, eq(kitchenCuisine.cuisineId, cuisineType.id))
          .where(whereClause)
          .limit(perPage)
          .offset(offset)
          .orderBy(
            buildOrderBy({
              sortBy,
              sortOrder,
              columnMap: { name: cuisineType.name, slug: cuisineType.slug },
              defaultColumn: cuisineType.name,
            }),
          );

        return buildPaginatedResponse({ items, page, perPage, totalItems });
      } catch (err) {
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to fetch kitchen cuisines",
        });
      }
    },
    {
      auth: true,
      query: listQueryParamsSchema,
    },
  )

  .put(
    "/profile/:kitchenId/cuisines",
    async ({ params, body }) => {
      try {
        await db
          .delete(kitchenCuisine)
          .where(eq(kitchenCuisine.kitchenId, params.kitchenId));

        if (body.cuisineIds.length > 0) {
          const validCuisines = await db
            .select({ id: cuisineType.id })
            .from(cuisineType)
            .where(inArray(cuisineType.id, body.cuisineIds));

          const validIds = new Set(validCuisines.map((c) => c.id));

          const inserts = body.cuisineIds
            .filter((id) => validIds.has(id))
            .map((cuisineId) => ({
              kitchenId: params.kitchenId,
              cuisineId,
            }));

          if (inserts.length > 0) {
            await db.insert(kitchenCuisine).values(inserts);
          }
        }

        return { success: true };
      } catch (err) {
        return status(500, {
          error: err instanceof Error ? err.message : "Failed to update kitchen cuisines",
        });
      }
    },
    {
      auth: true,
      body: setCuisinesSchema,
    },
  );

import {
  createSimpleQueryEngine,
  listQueryParamsSchema,
} from "@backend/db/helpers/QueryEngine";
import { Elysia } from "elysia";
import { z } from "zod";
import { getCrudTable, listCrudTables } from "./registry";
import { crudBearerAuth } from "./bearer-auth";

const createBodySchema = z.record(z.string(), z.unknown());
const updateBodySchema = z.record(z.string(), z.unknown()).optional().default({});

const crudRoute = new Elysia({ name: "crud", prefix: "/api/crud" })
  .use(crudBearerAuth)
  .get("/", () => ({ tables: listCrudTables() }))
  .get(
    "/:table",
    async ({ params, query, set }) => {
      const config = getCrudTable(params.table);
      if (!config) {
        set.status = 404;
        return { error: "Table not found", table: params.table };
      }

      const engine = createSimpleQueryEngine(config.table);
      const searchOn =
        query.searchOn?.length && query.searchOn.length > 0
          ? query.searchOn
          : config.searchOn.length > 0
            ? config.searchOn
            : undefined;

      try {
        const result = await engine.listPaged({
          page: query.page,
          perPage: query.perPage,
          sortBy: query.sortBy as any,
          sortOrder: query.sortOrder,
          searchTerm: query.searchTerm,
          searchOn,
        });
        return result;
      } catch (err) {
        set.status = 500;
        return {
          error: err instanceof Error ? err.message : "Internal server error",
        };
      }
    },
    { query: listQueryParamsSchema },
  )
  .get(
    "/:table/:id",
    async ({ params, set }) => {
      const config = getCrudTable(params.table);
      if (!config) {
        set.status = 404;
        return { error: "Table not found", table: params.table };
      }

      const engine = createSimpleQueryEngine(config.table);
      const item = await engine.getOne(params.id);

      if (!item) {
        set.status = 404;
        return { error: "Not found", id: params.id };
      }

      return { item };
    },
  )
  .post(
    "/:table",
    async ({ params, body, set }) => {
      const config = getCrudTable(params.table);
      if (!config) {
        set.status = 404;
        return { error: "Table not found", table: params.table };
      }

      const engine = createSimpleQueryEngine(config.table);

      try {
        const item = await engine.create(body as any);
        set.status = 201;
        return { item };
      } catch (err) {
        set.status = 500;
        return {
          error: err instanceof Error ? err.message : "Internal server error",
        };
      }
    },
    { body: createBodySchema },
  )
  .patch(
    "/:table/:id",
    async ({ params, body, set }) => {
      const config = getCrudTable(params.table);
      if (!config) {
        set.status = 404;
        return { error: "Table not found", table: params.table };
      }

      const engine = createSimpleQueryEngine(config.table);
      const item = await engine.update(params.id, body as any);

      if (!item) {
        set.status = 404;
        return { error: "Not found", id: params.id };
      }

      return { item };
    },
    { body: updateBodySchema },
  )
  .delete(
    "/:table/:id",
    async ({ params, set }) => {
      const config = getCrudTable(params.table);
      if (!config) {
        set.status = 404;
        return { error: "Table not found", table: params.table };
      }

      const engine = createSimpleQueryEngine(config.table);
      const item = await engine.delete(params.id);

      if (!item) {
        set.status = 404;
        return { error: "Not found", id: params.id };
      }

      return { item };
    },
  );

export const crudRouteGroup = crudRoute;

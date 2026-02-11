import { Elysia } from "elysia";

const CRUD_BEARER_TOKEN =
  process.env.CRUD_BEARER_TOKEN ?? "dishi-crud-dev-fallback-secret";

export const crudBearerAuth = new Elysia({ name: "crud-bearer-auth" }).onBeforeHandle(
  ({ request, set }) => {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token || token !== CRUD_BEARER_TOKEN) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  },
);

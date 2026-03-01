import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { envVariables } from "./env";
import { auth } from "./lib/auth";
import { viewerRoute } from "./routes/viewer/route";

export const app = new Hono()
  .basePath("/api")
  .use("*", logger())
  .use(
    "*",
    cors({
      origin: envVariables.FRONTEND_URL ?? "*",
      credentials: true,
    }),
  )
  .get("/", async (c) => {
    return c.json({
      message: "Hono API - Root",
    });
  })
  .all("/auth/*", async (c) => {
    return auth.handler(c.req.raw);
  })
  .route("/viewer", viewerRoute);

const port = envVariables.PORT;

console.log(`Hono API running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;

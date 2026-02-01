import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { allRoutes } from "./modules/all";

// Export app instance for type generation
export const app = new Elysia({ adapter: node() }).use(allRoutes).listen(4000, ({ url }) => {
  console.log(`🦊 Elysia is running at ${url}`);
  console.log(`🦊 Elysia openapi on ${url}openapi`);
});

export type App = typeof app;

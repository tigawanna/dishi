import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { viewerMiddleware } from "./viewer";

export const authMiddleware = createMiddleware()
  .middleware([viewerMiddleware])
  .server(async ({ next, context }) => {
    console.log("== authMiddleware - server - context", context.viewer?.user?.email);
    return next();
  })

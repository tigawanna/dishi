import { auth } from "@backend/lib/auth";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  console.log("\n\n ======== authMiddleware - session:", session,"\n\n =======\n");
  if (!session) {
    throw redirect({ to: "/" });
  }

  return await next();
});

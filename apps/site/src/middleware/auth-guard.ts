import { auth } from "@backend/lib/auth";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  const pathname = request.url.split("?")[0];

  if (!session) {
    throw redirect({ to: "/", search: { returnTo: pathname } });
  }

  return await next();
});

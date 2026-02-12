import { auth } from "@backend/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSessionServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const requestHeaders = getRequestHeaders();
  console.log("========= getSessionServerFn - requestHeaders:", requestHeaders);
  const session = await auth.api.getSession({ headers: requestHeaders });
  console.log("========= getSessionServerFn - session:", session);
  return session;
});

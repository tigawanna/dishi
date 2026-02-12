import { auth } from "@backend/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getCookies, getRequestHeaders } from "@tanstack/react-start/server";

export const getSessionServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const requestHeaders = getRequestHeaders();
  const cookies = getCookies();

  console.log("========= getSessionServerFn - cookies:", cookies);
  const session = await auth.api.getSession({ headers: requestHeaders });
  console.log("========= getSessionServerFn - session:", session);
  return session;
});

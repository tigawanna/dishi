import { authClient, BetterAuthSession } from "@/lib/better-auth/client";
import { treatyClient } from "@/lib/elysia/eden-treaty";
import { safeStringToUrl } from "@/utils/url";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

type ViewerUser = BetterAuthSession["user"];
type ViewerSession = BetterAuthSession["session"];

// export type BetterAuthUserRoles = "tenant" | "staff" | "admin" | "manager";
export type TViewer = {
  user?: ViewerUser;
  session?: ViewerSession;
};
export const viewerqueryOptions = queryOptions({
  queryKey: ["viewer"],
  queryFn: async () => {
    const data = await treatyClient.viewer.get();
    return { data: data.data, error: null };
  },
  // staleTime: 1000 * 60 * 5, // 5 minutes
  // gcTime: 1000 * 60 * 10, // 10 minutes
});

export function useViewer() {
  const qc = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      qc.invalidateQueries(viewerqueryOptions);
      throw redirect({ to: "/auth", search: { returnTo: "/" } });
    },
  });
  const viewerQuery = useSuspenseQuery(viewerqueryOptions);

  return {
    viewerQuery,
    viewer: {
      user: viewerQuery.data.data?.user,
      session: viewerQuery.data.data?.session,
    },
    logoutMutation,
  } as const;
}

export const viewerMiddleware = createMiddleware().server(async ({ next, request }) => {
  const headers = getRequestHeaders();
  const { data } = await treatyClient.viewer.get({
    headers,
  });
  if (!data?.user) {
    const returnTo = safeStringToUrl(request.url)?.pathname ?? "/";
    throw redirect({ to: "/auth", search: { returnTo } });
  }
  return await next();
});

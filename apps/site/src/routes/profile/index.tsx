import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { viewerMiddleware, viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { ViewerProfile, ViewerProfileFallback } from "./-components/ViewerProfile";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: async ({ context }) => {
    const viewer = await context.queryClient.ensureQueryData(viewerqueryOptions);
    console.log("== ProfileRoute - beforeLoad - ensureQueryData", viewer.data?.user);
    if (!context.viewer?.user) {
      throw redirect({ to: "/auth", search: { returnTo: "/profile" } });
    }
    return { viewer: viewer.data };
  },
});

function RouteComponent() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <ResponsiveGenericToolbar>
        <Suspense fallback={<ViewerProfileFallback />}>
          <ViewerProfile />
        </Suspense>
      </ResponsiveGenericToolbar>
    </div>
  );
}

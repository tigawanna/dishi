import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ViewerProfile, ViewerProfileFallback } from "./-components/ViewerProfile";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // await context.queryClient.ensureQueryData(viewerqueryOptions);
    console.log(
      "== ProfileRoute - beforeLoad - queryData",
      context.queryClient.getQueryData(viewerqueryOptions.queryKey)?.data?.user?.email,
    );
    console.log("== ProfileRoute - beforeLoad - context", context.viewer?.user?.email);
  },
  // loader: async ({ context }) => {
  //   context.queryClient.prefetchQuery(viewerqueryOptions);
  // },
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

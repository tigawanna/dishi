import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { viewerMiddleware } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { ViewerProfile, ViewerProfileFallback } from "./-components/ViewerProfile";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: async ({ context }) => {
    console.log("== ProfileRoute - beforeLoad - context", context);
    if (!context.viewer?.user) {
      throw redirect({ to: "/auth", search: { returnTo: "/profile" } });
    }
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

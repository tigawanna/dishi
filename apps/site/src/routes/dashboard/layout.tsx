import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(viewerqueryOptions);
    // console.log("== DashboardLayout - beforeLoad - context: viewer", context.viewer?.user?.email);
    // if (!context.viewer?.user) {
    //   throw redirect({
    //     to: "/auth",
    //     search: {
    //       returnTo: location.pathname,
    //     },
    //   });
    // }
  },
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(viewerqueryOptions);
  },
  head: () => ({
    meta: [
      {
        title: "Dishi | Dashboard",
        description: "Your dashboard",
      },
    ],
  }),
});

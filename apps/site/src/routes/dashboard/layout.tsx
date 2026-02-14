import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";
import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { auth } from "@backend/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context, location }) => {
    // await context.queryClient.ensureQueryData(viewerqueryOptions);
    console.log("========= DashboardLayout - beforeLoad - context: viewer", context.viewer);
    // if (!context.viewer?.user) {
    //   throw redirect({
    //     to: "/auth",
    //     search: {
    //       returnTo: location.pathname,
    //     },
    //   });
    // }
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

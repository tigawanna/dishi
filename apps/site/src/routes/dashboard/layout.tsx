import { viewerMiddleware } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  server: {
    middleware: [viewerMiddleware],
  },
  component: DashboardLayout,
  beforeLoad: async ({ context, serverContext }) => {
    if (!serverContext?.isServer && !context.viewer?.user) {
      throw redirect({ to: "/auth", search: { returnTo: location.pathname } });
    }
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

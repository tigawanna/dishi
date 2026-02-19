import { viewerMiddleware } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";
import { dashboard_routes } from "./-components/dashoboard-sidebar/dashboard_routes";

export const Route = createFileRoute("/_dashboard")({
  server: {
    middleware: [viewerMiddleware],
  },
  component: DashboardShell,
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

function DashboardShell() {
  return <DashboardLayout sidebarRoutes={dashboard_routes} sidebarLabel="Menu" />;
}

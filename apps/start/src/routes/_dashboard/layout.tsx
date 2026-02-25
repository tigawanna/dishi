import { viewerMiddleware } from "@/data-access-layer/users/viewer";
import { authClient } from "@/lib/better-auth/client";
import { RouterNotFoundComponent } from "@/lib/tanstack/router/RouterNotFoundComponent";
import { RouterPendingComponent } from "@/lib/tanstack/router/RouterPendingComponent";
import { RouterErrorComponent } from "@/lib/tanstack/router/routerErrorComponent";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";
import {
  getDashboardRoutes
} from "./-components/dashoboard-sidebar/dashboard_routes";

export const Route = createFileRoute("/_dashboard")({
  pendingComponent: () => <RouterPendingComponent />,
  notFoundComponent: () => <RouterNotFoundComponent />,
  errorComponent: ({ error }) => <RouterErrorComponent error={error} />,
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
  const { data: organizations } = authClient.useListOrganizations();
  const hasKitchen = organizations?.length && organizations.length > 0;
  const dashboard_routes = getDashboardRoutes(Boolean(hasKitchen));
  return <DashboardLayout sidebarRoutes={dashboard_routes} sidebarLabel="Menu" />;
}

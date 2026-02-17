import { viewerMiddleware } from "@/data-access-layer/users/viewer";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  server: {
    middleware: [viewerMiddleware],
  },
  component: DashboardAuthShell,
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

function DashboardAuthShell() {
  return <Outlet />;
}

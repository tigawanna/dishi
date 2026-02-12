import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async (context) => {
    if (!context.context.viewer?.user) {
      throw redirect({
        to: "/auth",
        search: {
          returnTo: context.location.pathname,
        },
      });
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

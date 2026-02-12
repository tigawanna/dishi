import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "./-components/dashoboard-sidebar/DashboardLayout";
import { authMiddleware } from "@/middleware/auth-guard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  server: {
    middleware: [authMiddleware],
  },
  // beforeLoad: async (context) => {
  //   if (!context.context.viewer?.user) {
  //     throw redirect({
  //       to: "/auth",
  //       search: {
  //         returnTo: context.location.pathname,
  //       },
  //     });
  //   }
  // },
});

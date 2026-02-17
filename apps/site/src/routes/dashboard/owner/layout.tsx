import { owner_routes } from "@/routes/dashboard/-components/dashoboard-sidebar/dashboard_routes";
import { DashboardLayout } from "@/routes/dashboard/-components/dashoboard-sidebar/DashboardLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/owner")({
  component: OwnerDashboardLayout,
  beforeLoad: async ({ context }) => {
    const role = context.viewer?.user?.role;
    if (role !== "owner") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function OwnerDashboardLayout() {
  return <DashboardLayout sidebarRoutes={owner_routes} sidebarLabel="Owner" />;
}

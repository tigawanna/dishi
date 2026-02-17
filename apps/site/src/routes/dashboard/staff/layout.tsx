import { staff_routes } from "@/routes/dashboard/-components/dashoboard-sidebar/dashboard_routes";
import { DashboardLayout } from "@/routes/dashboard/-components/dashoboard-sidebar/DashboardLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/staff")({
  component: StaffDashboardLayout,
  beforeLoad: async ({ context }) => {
    const role = context.viewer?.user?.role;
    if (role !== "staff" && role !== "owner") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function StaffDashboardLayout() {
  return <DashboardLayout sidebarRoutes={staff_routes} sidebarLabel="Staff" />;
}

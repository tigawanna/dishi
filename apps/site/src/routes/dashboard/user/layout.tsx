import { user_routes } from "@/routes/dashboard/-components/dashoboard-sidebar/dashboard_routes";
import { DashboardLayout } from "@/routes/dashboard/-components/dashoboard-sidebar/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/user")({
  component: UserDashboardLayout,
});

function UserDashboardLayout() {
  return <DashboardLayout sidebarRoutes={user_routes} sidebarLabel="User" showOrgSwitcher={false} />;
}

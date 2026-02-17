import { customer_routes } from "@/routes/dashboard/-components/dashoboard-sidebar/dashboard_routes";
import { DashboardLayout } from "@/routes/dashboard/-components/dashoboard-sidebar/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/customer")({
  component: CustomerDashboardLayout,
});

function CustomerDashboardLayout() {
  return <DashboardLayout sidebarRoutes={customer_routes} sidebarLabel="Customer" />;
}

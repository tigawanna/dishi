import { SidebarLinks } from "@/components/sidebar/SidebarLinks";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { authClient } from "@/lib/better-auth/client";
import { customer_routes, owner_routes, staff_routes } from "./dashboard_routes";

interface DashboardSidebarLinksProps {}

export function DashboardSidebarLinks({}: DashboardSidebarLinksProps) {
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role || "customer";

  const routeConfig = {
    admin: { label: "Owner", routes: owner_routes },
    staff: { label: "Staff", routes: staff_routes },
    customer: { label: "Customer", routes: customer_routes },
  } as const;

  const config = routeConfig[userRole as keyof typeof routeConfig] ?? routeConfig.customer;

  return (
    <SidebarGroup className="bg-base-300 h-full">
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
        {config.label}
      </SidebarGroupLabel>
      <SidebarLinks links={config.routes} />
    </SidebarGroup>
  );
}

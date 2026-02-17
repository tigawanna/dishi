import { SidebarLinks } from "@/components/sidebar/SidebarLinks";
import { SidebarItem } from "@/components/sidebar/types";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

interface DashboardSidebarLinksProps {
  routes: SidebarItem[];
  label: string;
}

export function DashboardSidebarLinks({ routes, label }: DashboardSidebarLinksProps) {
  return (
    <SidebarGroup className="bg-base-300 h-full">
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
        {label}
      </SidebarGroupLabel>
      <SidebarLinks links={routes} />
    </SidebarGroup>
  );
}

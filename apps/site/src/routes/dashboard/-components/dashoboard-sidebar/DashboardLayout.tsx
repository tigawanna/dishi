import { SidebarItem } from "@/components/sidebar/types";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Helmet } from "@/components/wrappers/custom-helmet";
import { TSRBreadCrumbs } from "@/lib/tanstack/router/TSRBreadCrumbs";
import { Outlet } from "@tanstack/react-router";
import { DashboardSidebarHeader } from "./DashboardSidebarHeader";
import { DashboardSidebarLinks } from "./DashboardSidebarLinks";
import { DashboardSidebarUser } from "./DashboardSidebarUser";
import { DashboardTheme } from "./DashboardTheme";

interface DashboardLayoutProps {
  sidebarRoutes: SidebarItem[];
  sidebarLabel: string;
  sidebar_props?: React.ComponentProps<typeof Sidebar>;
}

export function DashboardLayout({ sidebarRoutes, sidebarLabel, sidebar_props }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Helmet title="Dishi | Dashboard" description="Manage your kitchens, orders, and more" />
      <Sidebar className="" collapsible="icon" {...sidebar_props}>
        <SidebarHeader>
          <DashboardSidebarHeader />
        </SidebarHeader>
        <SidebarContent>
          <DashboardSidebarLinks routes={sidebarRoutes} label={sidebarLabel} />
        </SidebarContent>
        <SidebarFooter className="gap-3">
          <DashboardTheme />
          <DashboardSidebarUser />
          <div className="h-1" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="bg-base-100 sticky top-0 z-30 flex h-16 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <TSRBreadCrumbs />
          </div>
        </header>
        <div className="mx-auto flex h-full min-h-screen w-full flex-col items-center justify-center p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { OrgSwitcher } from "@/components/identity/OrgSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

function OrgSwitcherFallback() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" disabled>
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="grid flex-1 gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface DashboardSidebarHeaderProps {}

export function DashboardSidebarHeader({}: DashboardSidebarHeaderProps) {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex flex-col gap-3"
      onClick={() => {
        setOpenMobile(false);
      }}
    >
      {mounted ? <OrgSwitcher /> : <OrgSwitcherFallback />}
      <Link
        to="/dashboard"
        className={
          pathname === "/dashboard"
            ? `bg-primary/10 text-primary flex w-full cursor-pointer items-center gap-2 rounded-lg p-1 font-medium`
            : `hover:bg-base-300 flex w-full cursor-pointer items-center gap-2 rounded-sm p-1`
        }
      >
        <LayoutDashboard className="size-5" />
        {(state === "expanded" || isMobile) && <h1 className="text-sm font-semibold">Dashboard</h1>}
      </Link>
    </div>
  );
}

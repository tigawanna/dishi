import { OrgSwitcher } from "@/components/identity/OrgSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";
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

interface DashboardSidebarHeaderProps {
  showOrgSwitcher?: boolean;
}

export function DashboardSidebarHeader({ showOrgSwitcher = true }: DashboardSidebarHeaderProps) {
  const { state, setOpenMobile, isMobile } = useSidebar();
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
      <Link
        to="/"
        className="hover:bg-base-300 flex w-full cursor-pointer items-center gap-2 rounded-sm p-1"
      >
        <UtensilsCrossed className="text-primary size-5" />
        {(state === "expanded" || isMobile) && (
          <span className="font-serif text-xl tracking-tight">
            dishi<span className="text-primary">.</span>
          </span>
        )}
      </Link>
      {showOrgSwitcher && (mounted ? <OrgSwitcher /> : <OrgSwitcherFallback />)}
    </div>
  );
}

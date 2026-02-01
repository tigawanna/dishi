import { SidebarItem } from "@/components/sidebar/types";
import { FileText, History, User, Users, Vote } from "lucide-react";
import { FaWarehouse } from "react-icons/fa";

export const dashboard_routes = [
  { title: "proposals", href: "/dashboard/proposals", icon: FileText },
  { title: "voting", href: "/dashboard/voting", icon: Vote },
  { title: "members", href: "/dashboard/members", icon: Users },
  { title: "audit log", href: "/dashboard/audit", icon: History },
  {
    title: "users",
    href: "/dashboard/users",
    icon: User,
  },
  {
    title: "townhalls",
    href: "/dashboard/townhalls",
    icon: FaWarehouse,
  },
] satisfies SidebarItem[];

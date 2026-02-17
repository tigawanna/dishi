import { SidebarItem } from "@/components/sidebar/types";
import {
  ChefHat,
  ClipboardList,
  Heart,
  History,
  MapPin,
  ShoppingBag,
  Star,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export const owner_routes = [
  { title: "Kitchens", href: "/dashboard/owner/kitchens", icon: ChefHat },
  { title: "Menu", href: "/dashboard/owner/menu", icon: UtensilsCrossed },
  { title: "Orders", href: "/dashboard/owner/orders", icon: ShoppingBag },
  { title: "Staff", href: "/dashboard/owner/staff", icon: Users },
  { title: "Reviews", href: "/dashboard/owner/reviews", icon: Star },
  { title: "Users", href: "/dashboard/owner/users", icon: User },
  { title: "Audit Log", href: "/dashboard/owner/audit", icon: History },
] satisfies SidebarItem[];

export const staff_routes = [
  { title: "Orders", href: "/dashboard/staff/orders", icon: ClipboardList },
  { title: "Menu", href: "/dashboard/staff/menu", icon: UtensilsCrossed },
  { title: "Members", href: "/dashboard/staff/members", icon: Users },
  { title: "Reviews", href: "/dashboard/staff/reviews", icon: Star },
] satisfies SidebarItem[];

export const customer_routes = [
  { title: "Nearby Kitchens", href: "/dashboard/customer/kitchens", icon: MapPin },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
  { title: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
  { title: "My Reviews", href: "/dashboard/customer/reviews", icon: Star },
] satisfies SidebarItem[];

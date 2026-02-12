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
  { title: "Kitchens", href: "/dashboard/organizations", icon: ChefHat },
  { title: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Staff", href: "/dashboard/staff", icon: Users },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Users", href: "/dashboard/users", icon: User },
  { title: "Audit Log", href: "/dashboard/audit", icon: History },
] satisfies SidebarItem[];

export const staff_routes = [
  { title: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { title: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
] satisfies SidebarItem[];

export const customer_routes = [
  { title: "Nearby Kitchens", href: "/dashboard/organizations", icon: MapPin },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { title: "My Reviews", href: "/dashboard/reviews", icon: Star },
] satisfies SidebarItem[];

export const dashboard_routes = owner_routes;

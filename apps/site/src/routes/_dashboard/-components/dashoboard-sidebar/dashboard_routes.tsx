import { SidebarItem } from "@/components/sidebar/types";
import { ChefHat, Heart, Settings, Shield, ShoppingBag, Star, User } from "lucide-react";

export const dashboard_routes = [
  { title: "Profile", href: "/profile", icon: User },
  { title: "My Orders", href: "/orders", icon: ShoppingBag },
  { title: "Favorites", href: "/favorites", icon: Heart },
  { title: "My Reviews", href: "/reviews", icon: Star },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Admin", href: "/admin", icon: Shield },
] satisfies SidebarItem[];


export const getDashboardRoutes = (hasKitchen: boolean) => {
const routes = dashboard_routes;
if (hasKitchen) {
  routes.splice(routes.findIndex(r => r.href === "/profile"), 1);
  routes.unshift({ title: "My Kitchens", href: "/kitchens", icon: ChefHat });
}
return routes satisfies SidebarItem[];
};

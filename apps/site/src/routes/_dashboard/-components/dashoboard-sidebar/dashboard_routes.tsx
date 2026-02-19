import { SidebarItem } from "@/components/sidebar/types";
import {
  ChefHat,
  Heart,
  MapPin,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";

export const dashboard_routes = [
  { title: "Profile", href: "/profile", icon: User },
  { title: "Nearby Kitchens", href: "/explore", icon: MapPin },
  { title: "My Orders", href: "/orders", icon: ShoppingBag },
  { title: "Favorites", href: "/favorites", icon: Heart },
  { title: "My Reviews", href: "/reviews", icon: Star },
  { title: "My Kitchens", href: "/kitchens", icon: ChefHat },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Admin", href: "/admin", icon: Shield },
] satisfies SidebarItem[];

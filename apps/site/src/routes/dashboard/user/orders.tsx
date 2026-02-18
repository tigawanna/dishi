import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/dashboard/user/orders")({
  component: UserOrdersPage,
});

function UserOrdersPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <ShoppingBag className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">My Orders</h1>
      <p className="text-base-content/70">Track and view your order history</p>
    </div>
  );
}

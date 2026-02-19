import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/orders")({
  component: KitchenOrdersPage,
});

function KitchenOrdersPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <ShoppingBag className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Kitchen Orders</h1>
      <p className="text-base-content/70">View and manage orders for this kitchen</p>
    </div>
  );
}

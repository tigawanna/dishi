import { createFileRoute } from "@tanstack/react-router";
import { Soup } from "lucide-react";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/cuisines")({
  component: KitchenCuisinesPage,
});

function KitchenCuisinesPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Soup className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Cuisines</h1>
      <p className="text-base-content/70">Manage cuisine types for this kitchen</p>
    </div>
  );
}

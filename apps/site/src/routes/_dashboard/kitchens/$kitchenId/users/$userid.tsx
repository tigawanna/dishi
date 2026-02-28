import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/users/$userid")({
  component: KitchenUserDetailPage,
});

function KitchenUserDetailPage() {
  return (
    <div className="mx-auto min-h-screen min-w-[90%] space-y-6 p-6">
      <div className="text-2xl font-bold">User Details</div>
    </div>
  );
}

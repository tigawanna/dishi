import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/users/")({
  component: KitchenUsersPage,
  validateSearch: z.object({
    sq: z.string().optional().catch(undefined),
    sortBy: z.string().optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
  }),
});

function KitchenUsersPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-2xl font-bold">Users</div>
    </div>
  );
}

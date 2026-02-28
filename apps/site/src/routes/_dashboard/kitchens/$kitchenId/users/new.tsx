import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/users/new")({
  component: NewKitchenUserPage,
});

function NewKitchenUserPage() {
  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold">Create User</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Create a new user and optionally add them to this kitchen
        </p>
      </div>
    </div>
  );
}

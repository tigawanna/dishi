import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminUserForm } from "./-components/AdminUserForm";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/users/new")({
  component: NewKitchenUserPage,
});

function NewKitchenUserPage() {
  const { kitchenId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold">Create User</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Create a new user and optionally add them to this kitchen
        </p>

        <AdminUserForm
          mode="create"
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["users"] });
            navigate({ to: "/kitchens/$kitchenId/users", params: { kitchenId } });
          }}
        />
      </div>
    </div>
  );
}

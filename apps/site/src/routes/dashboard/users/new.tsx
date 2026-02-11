import { AdminUserForm } from "@/routes/dashboard/users/-components/AdminUserForm";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/new")({
  component: RouteComponent,
});

export function RouteComponent() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold">Create User</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Create a new user and optionally add them to one of your Townhall
        </p>

        <AdminUserForm
          mode="create"
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["users"] });
            navigate({ to: "/dashboard/users" });
          }}
        />
      </div>
    </div>
  );
}

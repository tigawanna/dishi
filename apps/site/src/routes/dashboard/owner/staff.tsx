import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/owner/staff")({
  component: OwnerStaffPage,
});

function OwnerStaffPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Users className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <p className="text-base-content/70">Manage your kitchen staff members</p>
    </div>
  );
}

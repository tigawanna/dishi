import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_dashboard/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Shield className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="text-base-content/70">Global administration and platform management</p>
    </div>
  );
}

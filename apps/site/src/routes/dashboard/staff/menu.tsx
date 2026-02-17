import { createFileRoute } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/menu")({
  component: StaffMenuPage,
});

function StaffMenuPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <UtensilsCrossed className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Menu Management</h1>
      <p className="text-base-content/70">Update dishes and manage availability</p>
    </div>
  );
}

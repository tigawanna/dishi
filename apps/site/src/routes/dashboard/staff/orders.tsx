import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/orders")({
  component: StaffOrdersPage,
});

function StaffOrdersPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <ClipboardList className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="text-base-content/70">View and manage incoming orders</p>
    </div>
  );
}

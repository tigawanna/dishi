import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/audit")({
  component: KitchenAuditPage,
});

function KitchenAuditPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <History className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Audit Log</h1>
      <p className="text-base-content/70">Review activity and changes for this kitchen</p>
    </div>
  );
}

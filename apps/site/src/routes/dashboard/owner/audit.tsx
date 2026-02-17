import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

export const Route = createFileRoute("/dashboard/owner/audit")({
  component: OwnerAuditPage,
});

function OwnerAuditPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <History className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Audit Log</h1>
      <p className="text-base-content/70">Review system activity and changes</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/settings")({
  component: KitchenSettingsPage,
});

function KitchenSettingsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Settings className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Kitchen Settings</h1>
      <p className="text-base-content/70">Manage kitchen profile, branding, and configuration</p>
    </div>
  );
}

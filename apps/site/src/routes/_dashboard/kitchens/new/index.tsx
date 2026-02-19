import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KitchenHub } from "./-components/KitchenHub";
import { KitchenOnboardingWizard } from "./-components/KitchenOnboardingWizard";

export const Route = createFileRoute("/_dashboard/kitchens/new/")({
  component: NewKitchenPage,
  head: () => ({
    meta: [
      {
        title: "Dishi | Kitchen Setup",
        description: "Set up your kitchen profile",
      },
    ],
  }),
});

function NewKitchenPage() {
  const [view, setView] = useState<"hub" | "wizard">("hub");

  return (
    <div className="flex min-h-full w-full items-start justify-center p-4 md:p-8">
      {view === "hub" ? (
        <KitchenHub onCreateNew={() => setView("wizard")} />
      ) : (
        <KitchenOnboardingWizard onBack={() => setView("hub")} />
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { KitchenOnboardingWizard } from "./-components/KitchenOnboardingWizard";

export const Route = createFileRoute("/_dashboard/kitchens/new/wizard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-full w-full items-start justify-center p-4 md:p-8">
      <KitchenOnboardingWizard />
    </div>
  );
}

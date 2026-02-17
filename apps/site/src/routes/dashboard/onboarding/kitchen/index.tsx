import { createFileRoute } from "@tanstack/react-router";
import { KitchenOnboardingWizard } from "./-components/KitchenOnboardingWizard";

export const Route = createFileRoute("/dashboard/onboarding/kitchen/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Dishi | Kitchen Setup",
        description: "Set up your kitchen profile",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="flex min-h-full w-full items-start justify-center p-4 md:p-8">
      <KitchenOnboardingWizard />
    </div>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/kitchens/new/wizard")({
  beforeLoad: () => {
    throw redirect({ to: "/kitchens/new" });
  },
  component: function WizardRedirect() {
    return null;
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { OrgDetails } from "../-components/OrgDetails";

export const Route = createFileRoute("/_dashboard/kitchens/$kitchenId/")({
  component: KitchenOverviewPage,
});

function KitchenOverviewPage() {
  const { kitchenId } = Route.useParams();
  return (
    <div className="flex h-full w-full flex-col">
      <OrgDetails orgId={kitchenId} />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/voting")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/voting"!</div>;
}

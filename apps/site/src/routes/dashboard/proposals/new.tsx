import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/proposals/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/proposals/new"!</div>;
}

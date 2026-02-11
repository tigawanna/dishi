import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, FileText, Users, Vote } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Townhall Dashboard</h1>
        <p className="text-base-content/70">Your community governance hub</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          to="/dashboard/proposals"
          className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          <div className="card-body items-center text-center">
            <FileText className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Proposals</h3>
            <p className="text-base-content/70 text-sm">View and create proposals</p>
          </div>
        </Link>
      </div>

      <Link to="/" className="btn btn-ghost gap-2">
        <ChevronLeft className="size-4" /> Back to Home
      </Link>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/proposals/")({
  component: ProposalsPage,
});

function ProposalsPage() {
  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-base-content/70">Create, review, and track community proposals</p>
        </div>
        <Link to="/dashboard/proposals/new" className="btn btn-primary gap-2">
          <Plus className="size-4" />
          New Proposal
        </Link>
      </div>

      {/* Proposal Status Tabs */}
      <div className="tabs tabs-boxed w-fit">
        <a className="tab tab-active">All</a>
        <a className="tab">My Drafts</a>
        <a className="tab">Under Review</a>
        <a className="tab">Voting</a>
        <a className="tab">Passed</a>
        <a className="tab">Rejected</a>
      </div>

      {/* Empty State */}
      <div className="card bg-base-200 flex-1">
        <div className="card-body items-center justify-center text-center">
          <FileText className="text-base-content/30 size-16" />
          <h2 className="card-title">No proposals yet</h2>
          <p className="text-base-content/70">
            Be the first to create a proposal for your community
          </p>
          <Link to="/dashboard/proposals/new" className="btn btn-primary mt-4">
            Create Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}

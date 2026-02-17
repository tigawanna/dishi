import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/members")({
  component: StaffMembersPage,
});

function StaffMembersPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Users className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Team Members</h1>
      <p className="text-base-content/70">View fellow staff members in your kitchen</p>
    </div>
  );
}

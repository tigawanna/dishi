import { createFileRoute } from "@tanstack/react-router";
import { Mail, Shield, User, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/profile")({
  component: StaffProfilePage,
});

function StaffProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Profile</h1>
        <p className="text-base-content/70 mt-1">Manage your staff account and team details</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <User className="text-primary size-6" />
              <h2 className="card-title text-lg">Personal Information</h2>
            </div>
            <p className="text-base-content/60 text-sm">Name, email, phone number</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Users className="text-primary size-6" />
              <h2 className="card-title text-lg">Team</h2>
            </div>
            <p className="text-base-content/60 text-sm">
              Your kitchen team and fellow staff members
            </p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Mail className="text-primary size-6" />
              <h2 className="card-title text-lg">Invitations</h2>
            </div>
            <p className="text-base-content/60 text-sm">Pending invitations and join requests</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Shield className="text-primary size-6" />
              <h2 className="card-title text-lg">Permissions</h2>
            </div>
            <p className="text-base-content/60 text-sm">Your access level and assigned roles</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Building2, Settings, Shield, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/owner/profile")({
  component: OwnerProfilePage,
});

function OwnerProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Owner Profile</h1>
        <p className="text-base-content/70 mt-1">Manage your owner account and kitchen settings</p>
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
              <Building2 className="text-primary size-6" />
              <h2 className="card-title text-lg">Organization Settings</h2>
            </div>
            <p className="text-base-content/60 text-sm">Kitchen branding, billing, and metadata</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Shield className="text-primary size-6" />
              <h2 className="card-title text-lg">Access & Security</h2>
            </div>
            <p className="text-base-content/60 text-sm">Password, 2FA, sessions</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Settings className="text-primary size-6" />
              <h2 className="card-title text-lg">Owner Settings</h2>
            </div>
            <p className="text-base-content/60 text-sm">Notifications, preferences, integrations</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

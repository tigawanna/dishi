import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/dashboard/user/kitchens")({
  component: UserKitchensPage,
});

function UserKitchensPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <MapPin className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Nearby Kitchens</h1>
      <p className="text-base-content/70">Browse kitchens in your neighborhood</p>
    </div>
  );
}

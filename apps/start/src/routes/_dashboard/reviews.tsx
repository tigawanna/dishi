import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_dashboard/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Star className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">My Reviews</h1>
      <p className="text-base-content/70">Manage your kitchen reviews</p>
    </div>
  );
}

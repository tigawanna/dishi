import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/reviews")({
  component: StaffReviewsPage,
});

function StaffReviewsPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Star className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Reviews</h1>
      <p className="text-base-content/70">Read and respond to customer reviews</p>
    </div>
  );
}

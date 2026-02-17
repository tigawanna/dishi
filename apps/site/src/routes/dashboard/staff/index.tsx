import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ClipboardList, Star, Users, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/dashboard/staff/")({
  component: StaffHomePage,
});

function StaffHomePage() {
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Staff Dashboard</h1>
        <p className="text-base-content/70">Manage orders, menu, and team</p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          to="/dashboard/staff/orders"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <ClipboardList className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Orders</h3>
            <p className="text-base-content/70 text-sm">View and manage incoming orders</p>
          </div>
        </Link>
        <Link
          to="/dashboard/staff/menu"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <UtensilsCrossed className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Menu</h3>
            <p className="text-base-content/70 text-sm">Update dishes and availability</p>
          </div>
        </Link>
        <Link
          to="/dashboard/staff/members"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Users className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Team Members</h3>
            <p className="text-base-content/70 text-sm">View your fellow staff members</p>
          </div>
        </Link>
        <Link
          to="/dashboard/staff/reviews"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Star className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Reviews</h3>
            <p className="text-base-content/70 text-sm">Read and respond to reviews</p>
          </div>
        </Link>
      </div>

      <Link to="/" className="btn btn-ghost gap-2">
        <ChevronLeft className="size-4" /> Back to Home
      </Link>
    </div>
  );
}

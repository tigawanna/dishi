import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, ChevronLeft, ShoppingBag, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async ({ context }) => {
    // console.log("== DashboardIndex - beforeLoad - context", context.viewer?.user?.email);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Dishi Dashboard</h1>
        <p className="text-base-content/70">Your neighborhood food hub</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          to="/dashboard/organizations"
          className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="card-body items-center text-center">
            <ChefHat className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Kitchens</h3>
            <p className="text-base-content/70 text-sm">Browse and manage kitchens</p>
          </div>
        </Link>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body items-center text-center">
            <UtensilsCrossed className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Menu</h3>
            <p className="text-base-content/70 text-sm">Explore dishes and cuisines</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body items-center text-center">
            <ShoppingBag className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Orders</h3>
            <p className="text-base-content/70 text-sm">Track and manage orders</p>
          </div>
        </div>
      </div>

      <Link to="/" className="btn btn-ghost gap-2">
        <ChevronLeft className="size-4" /> Back to Home
      </Link>
    </div>
  );
}

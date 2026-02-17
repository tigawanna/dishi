import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, ChevronLeft, History, ShoppingBag, Users, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/dashboard/owner/")({
  component: OwnerHomePage,
});

function OwnerHomePage() {
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Owner Dashboard</h1>
        <p className="text-base-content/70">Manage your kitchens, staff, and operations</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          to="/dashboard/owner/kitchens"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <ChefHat className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Kitchens</h3>
            <p className="text-base-content/70 text-sm">Manage your kitchen profiles</p>
          </div>
        </Link>
        <Link
          to="/dashboard/owner/users"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Users className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Users</h3>
            <p className="text-base-content/70 text-sm">Manage platform users</p>
          </div>
        </Link>
        <Link
          to="/dashboard/owner/staff"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Users className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Staff</h3>
            <p className="text-base-content/70 text-sm">Manage kitchen staff</p>
          </div>
        </Link>
        <Link
          to="/dashboard/owner/orders"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <ShoppingBag className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Orders</h3>
            <p className="text-base-content/70 text-sm">View and manage all orders</p>
          </div>
        </Link>
        <Link
          to="/dashboard/owner/menu"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <UtensilsCrossed className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Menu</h3>
            <p className="text-base-content/70 text-sm">Manage dishes and cuisines</p>
          </div>
        </Link>
        <Link
          to="/dashboard/owner/audit"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <History className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Audit Log</h3>
            <p className="text-base-content/70 text-sm">Review system activity</p>
          </div>
        </Link>
      </div>

      <Link to="/" className="btn btn-ghost gap-2">
        <ChevronLeft className="size-4" /> Back to Home
      </Link>
    </div>
  );
}

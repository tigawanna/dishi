import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Heart, MapPin, ShoppingBag, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard/user/")({
  component: UserHomePage,
});

function UserHomePage() {
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-base-content/70">Discover kitchens and track your orders</p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          to="/dashboard/user/kitchens"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <MapPin className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Nearby Kitchens</h3>
            <p className="text-base-content/70 text-sm">Browse kitchens in your neighborhood</p>
          </div>
        </Link>
        <Link
          to="/dashboard/user/orders"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <ShoppingBag className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">My Orders</h3>
            <p className="text-base-content/70 text-sm">Track and view your order history</p>
          </div>
        </Link>
        <Link
          to="/dashboard/user/favorites"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Heart className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">Favorites</h3>
            <p className="text-base-content/70 text-sm">Your saved kitchens and dishes</p>
          </div>
        </Link>
        <Link
          to="/dashboard/user/reviews"
          className="card bg-base-200 hover:bg-base-300 cursor-pointer shadow-lg transition-all hover:scale-105"
        >
          <div className="card-body items-center text-center">
            <Star className="text-primary mb-2 size-10" />
            <h3 className="card-title text-lg">My Reviews</h3>
            <p className="text-base-content/70 text-sm">Manage your kitchen reviews</p>
          </div>
        </Link>
      </div>

      <Link to="/" className="btn btn-ghost gap-2">
        <ChevronLeft className="size-4" /> Back to Home
      </Link>
    </div>
  );
}

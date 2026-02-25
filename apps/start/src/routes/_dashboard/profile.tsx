import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Heart, MapPin, Truck, User } from "lucide-react";

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-base-content/70 mt-1">Manage your preferences and delivery details</p>
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
              <MapPin className="text-primary size-6" />
              <h2 className="card-title text-lg">Location</h2>
            </div>
            <p className="text-base-content/60 text-sm">Your area for nearby kitchen discovery</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Heart className="text-primary size-6" />
              <h2 className="card-title text-lg">Food Preferences</h2>
            </div>
            <p className="text-base-content/60 text-sm">
              Cuisine types, dietary restrictions, allergies
            </p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Truck className="text-primary size-6" />
              <h2 className="card-title text-lg">Delivery Addresses</h2>
            </div>
            <p className="text-base-content/60 text-sm">Saved addresses for quick ordering</p>
            <div className="bg-base-300 mt-4 flex h-24 items-center justify-center rounded-lg">
              <span className="text-base-content/40 text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/kitchens/new"
        className="card bg-primary/10 hover:bg-primary/20 w-full max-w-4xl cursor-pointer border border-primary/20 shadow-md transition-all"
      >
        <div className="card-body flex-row items-center gap-4">
          <ChefHat className="text-primary size-8" />
          <div>
            <h2 className="card-title text-lg">Start Your Kitchen</h2>
            <p className="text-base-content/60 text-sm">
              Register your own kitchen and start serving customers
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

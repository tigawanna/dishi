import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_dashboard/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <Heart className="text-base-content/30 size-16" />
      <h1 className="text-2xl font-bold">Favorites</h1>
      <p className="text-base-content/70">Your saved kitchens and dishes</p>
    </div>
  );
}

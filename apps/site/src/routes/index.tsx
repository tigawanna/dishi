import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { useViewer } from "@/data-access-layer/users/viewer";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, ChefHat, MapPin, Search, Star, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { viewer } = useViewer();

  return (
    <div
      data-test="homepage"
      className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center">
      <ResponsiveGenericToolbar>
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-10 p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-primary/10 text-primary mb-2 rounded-full p-4">
              <UtensilsCrossed className="size-12" />
            </div>
            <h1
              data-test="homepage-section-welcome"
              className="text-base-content text-5xl font-bold md:text-6xl">
              {viewer.user?.name ? `Hey ${viewer.user.name},` : "Discover"}{" "}
              <span className="text-primary">homemade food</span> near you
            </h1>
            <p className="text-base-content/70 max-w-2xl text-lg">
              Dishi connects you with talented neighborhood cooks serving authentic, homemade meals
              right from their kitchens
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              data-test="homepage-section--dashboard-link"
              className="btn btn-primary btn-lg gap-2">
              <span>Explore Kitchens</span>
              <ArrowRightIcon className="size-6" />
            </Link>
            <Link to="/profile" className="btn btn-outline btn-lg gap-2">
              <ChefHat className="size-5" />
              <span>My Profile</span>
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <MapPin className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Hyperlocal</h3>
                <p className="text-base-content/70 text-sm">
                  Find kitchens and dishes available in your neighborhood
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <Search className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Discover</h3>
                <p className="text-base-content/70 text-sm">
                  Browse diverse cuisines crafted by passionate home cooks
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <Star className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Rate & Review</h3>
                <p className="text-base-content/70 text-sm">
                  Share your experience and help the community find the best meals
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        <picture>
          <source
            type="image/webp"
            srcSet="/hero-food-sm.webp 640w, /hero-food-md.webp 1024w, /hero-food-lg.webp 1920w"
            sizes="100vw"
          />
          <source
            type="image/jpeg"
            srcSet="/hero-food-sm.jpg 640w, /hero-food-md.jpg 1024w, /hero-food-lg.jpg 1920w"
            sizes="100vw"
          />
          <img
            src="/hero-food-lg.jpg"
            alt="Homemade food spread"
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-linear-to-r from-base-content/95 via-base-content/80 to-base-content/50 dark:from-base-100/95 dark:via-base-100/80 dark:to-base-100/50" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <div className="animate-fade-in">
            <span className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              Now in your neighborhood
            </span>
          </div>

          <h1
            className="animate-fade-in mb-6 font-serif text-5xl leading-[1.1] text-base-100 dark:text-base-content md:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            Discover{" "}
            <span className="italic text-primary">homemade</span> food near you
          </h1>

          <p
            className="animate-fade-in mb-10 max-w-lg text-lg leading-relaxed text-base-100/70 dark:text-base-content/70 md:text-xl"
            style={{ animationDelay: "200ms" }}
          >
            Dishi connects you with talented neighborhood cooks serving
            authentic, homemade meals right from their kitchens.
          </p>

          <div
            className="animate-fade-in flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-base-100/20 bg-base-100/10 px-4 py-3 backdrop-blur-md dark:border-base-content/20 dark:bg-base-content/10">
              <MapPin className="size-5 shrink-0 text-primary" />
              <input
                type="text"
                placeholder="Enter your neighborhood..."
                className="w-full bg-transparent text-sm text-base-100 outline-none placeholder:text-base-100/50 dark:text-base-content dark:placeholder:text-base-content/50"
              />
            </div>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="gap-2 rounded-lg px-8 text-base shadow-lg shadow-primary/30"
              >
                <Search className="size-4" />
                Find Food
              </Button>
            </Link>
          </div>

          <div
            className="animate-fade-in mt-10 flex items-center gap-6 text-sm text-base-100/60 dark:text-base-content/60"
            style={{ animationDelay: "600ms" }}
          >
            <div className="flex -space-x-2">
              {["A", "M", "S", "R"].map((initial) => (
                <div
                  key={initial}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-base-100/30 bg-primary/70 text-xs font-medium text-primary-content dark:border-base-content/30"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span>
              <strong className="text-base-100 dark:text-base-content">2,400+</strong> home cooks
              already sharing meals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { z } from "zod";

const searchParams = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: (search) => searchParams.parse(search),
  component: SearchPage,
  head: () => ({
    meta: [
      {
        title: `Dishi Search`,
        description: "Search for homemade food near you on Dishi.",
      },
    ],
  }),
});

function SearchPage() {
  const { q } = useSearch({ from: "/search" });

  return (
    <div className="bg-base-100 flex min-h-screen w-full flex-col">
      <ResponsiveGenericToolbar>
        <div className="min-h-screen flex flex-1 flex-col items-center justify-center gap-6 py-20">
          <SearchIcon className="size-16 text-primary/30" />
          <h1 className="text-center font-serif text-4xl text-base-content md:text-5xl">
            {q ? (
              <>
                Results for <span className="italic text-primary">"{q}"</span>
              </>
            ) : (
              "Search for food near you"
            )}
          </h1>
          <p className="max-w-md text-center text-base-content/60">
            This page is a work in progress. Soon you will be able to discover kitchens, dishes, and
            cooks in your neighborhood.
          </p>
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

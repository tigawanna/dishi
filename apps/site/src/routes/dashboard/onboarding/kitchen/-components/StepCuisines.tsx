import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cuisineTypesQueryOptions } from "@/data-access-layer/kitchen/cuisine-types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import type { KitchenCuisinesData } from "./useKitchenOnboarding";

interface StepCuisinesProps {
  onSubmit: (data: KitchenCuisinesData) => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  initialData: KitchenCuisinesData | null;
}

export function StepCuisines({ onSubmit, onBack, isPending, initialData }: StepCuisinesProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialData?.cuisineIds ?? []),
  );

  const { data, isLoading } = useQuery(cuisineTypesQueryOptions());
  const cuisines = data?.items ?? [];

  const toggleCuisine = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    await onSubmit({ cuisineIds: Array.from(selected) });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (cuisines.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 py-8">
          <UtensilsCrossed className="text-muted-foreground size-10" />
          <p className="text-muted-foreground text-sm">
            No cuisine types available yet. You can add them later.
          </p>
        </div>
        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Skip & Finish"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Select the cuisines your kitchen serves
        </p>
        {selected.size > 0 && (
          <Badge variant="secondary">{selected.size} selected</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cuisines.map((cuisine) => {
          const isSelected = selected.has(cuisine.id);
          return (
            <button
              key={cuisine.id}
              type="button"
              onClick={() => toggleCuisine(cuisine.id)}
              className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {cuisine.icon && <span className="text-lg">{cuisine.icon}</span>}
              <span className="text-sm font-medium">{cuisine.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : selected.size > 0 ? "Finish Setup" : "Skip & Finish"}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

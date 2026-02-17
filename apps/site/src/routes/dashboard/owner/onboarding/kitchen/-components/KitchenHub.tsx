import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { userOrgsQueryOptions } from "@/data-access-layer/users/user-orgs";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, ChefHat, Plus } from "lucide-react";

interface KitchenHubProps {
  onCreateNew: () => void;
}

export function KitchenHub({ onCreateNew }: KitchenHubProps) {
  const navigate = useNavigate();

  const { data: orgs, isLoading } = useQuery(
    userOrgsQueryOptions({}),
  );

  const hasOrgs = orgs && orgs.length > 0;

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-2xl">
          <ChefHat className="text-primary size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your Kitchens</h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          {hasOrgs
            ? "Manage your existing kitchens or create a new one"
            : "Get started by setting up your first kitchen on Dishi"}
        </p>
      </div>

      {isLoading && <KitchenHubSkeleton />}

      {!isLoading && hasOrgs && (
        <div className="space-y-3">
          {orgs.map((org) => (
            <Card
              key={org.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() =>
                navigate({
                  to: "/dashboard/owner/kitchens/$orgId",
                  params: { orgId: org.id },
                })
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="size-10 rounded-lg object-cover"
                        />
                      ) : (
                        <Building2 className="text-muted-foreground size-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{org.name}</CardTitle>
                      <CardDescription className="text-xs">
                        <code>{org.slug}</code>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {org.createdAt && (
                      <Badge variant="outline" className="text-xs">
                        {getRelativeTimeString(new Date(org.createdAt))}
                      </Badge>
                    )}
                    <ArrowRight className="text-muted-foreground size-4" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Card
        className="border-dashed cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
        onClick={onCreateNew}
      >
        <CardContent className="flex items-center justify-center gap-3 py-8">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
            <Plus className="text-primary size-5" />
          </div>
          <div>
            <p className="font-semibold">Create a New Kitchen</p>
            <p className="text-muted-foreground text-sm">
              Set up a new kitchen profile and start serving
            </p>
          </div>
        </CardContent>
      </Card>

      {!isLoading && !hasOrgs && (
        <div className="text-center">
          <Button size="lg" onClick={onCreateNew} className="gap-2">
            <ChefHat className="size-5" />
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}

function KitchenHubSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

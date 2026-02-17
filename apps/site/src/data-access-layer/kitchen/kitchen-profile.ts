import { authClient } from "@/lib/better-auth/client";
import { treatyClient } from "@/lib/elysia/eden-treaty";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryKeyPrefixes } from "../query-keys";

export type CreateOrganizationPayload = {
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, unknown>;
};

export type DayHours = {
  opensAt: string;
  closesAt: string;
};

export type OperatingHours = Partial<
  Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", DayHours>
>;

export type CreateKitchenProfilePayload = {
  organizationId: string;
  description?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  deliveryRadiusKm?: string;
  operatingHours?: OperatingHours;
  coverImage?: string;
};

export type SetKitchenCuisinesPayload = {
  kitchenId: string;
  cuisineIds: string[];
};

export const kitchenProfileByOrgQueryOptions = (orgId: string) =>
  queryOptions({
    queryKey: [queryKeyPrefixes.kitchenProfile, "by-org", orgId] as const,
    queryFn: async () => {
      const { data, error } = await treatyClient.kitchen.profile["by-org"][":orgId"].get({
        params: { orgId },
      });
      if (error) throw new Error(String(error));
      return data;
    },
    enabled: !!orgId,
  });

export const kitchenCuisinesQueryOptions = (
  kitchenId: string,
  params?: { page?: number; perPage?: number },
) =>
  queryOptions({
    queryKey: [
      queryKeyPrefixes.kitchenProfile,
      "cuisines",
      kitchenId,
      params?.page ?? 1,
      params?.perPage ?? 100,
    ] as const,
    queryFn: async () => {
      const { data, error } = await treatyClient.kitchen.profile[":kitchenId"].cuisines.get({
        params: { kitchenId },
        query: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 100,
          sortBy: "name",
          sortOrder: "asc",
        },
      });
      if (error) throw new Error(String(error));
      return data;
    },
    enabled: !!kitchenId,
  });

export const createOrganizationMutation = mutationOptions({
  mutationFn: async (payload: CreateOrganizationPayload) => {
    const { data, error } = await authClient.organization.create({
      name: payload.name,
      slug: payload.slug,
      logo: payload.logo,
      metadata: payload.metadata,
    });
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [[queryKeyPrefixes.organizations]],
  },
});

export const createKitchenProfileMutation = mutationOptions({
  mutationFn: async (payload: CreateKitchenProfilePayload) => {
    const { data, error } = await treatyClient.kitchen.profile.post(payload);
    if (error) throw new Error(String(error));
    return data;
  },
  meta: {
    invalidates: [[queryKeyPrefixes.kitchenProfile]],
  },
});

export const setKitchenCuisinesMutation = mutationOptions({
  mutationFn: async ({ kitchenId, cuisineIds }: SetKitchenCuisinesPayload) => {
    const { data, error } = await treatyClient.kitchen.profile[":kitchenId"].cuisines.put(
      { cuisineIds },
      { params: { kitchenId } },
    );
    if (error) throw new Error(String(error));
    return data;
  },
  meta: {
    invalidates: [[queryKeyPrefixes.kitchenProfile, "cuisines"]],
  },
});

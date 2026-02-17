import {
  createKitchenProfileMutation,
  createOrganizationMutation,
  setKitchenCuisinesMutation,
} from "@/data-access-layer/kitchen/kitchen-profile";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export type OnboardingStep = "basics" | "location" | "cuisines" | "complete";

const STEPS: OnboardingStep[] = ["basics", "location", "cuisines", "complete"];

export type KitchenBasicsData = {
  name: string;
  slug: string;
  description: string;
  phone: string;
};

export type KitchenLocationData = {
  address: string;
  neighborhood: string;
  deliveryRadiusKm: string;
  opensAt: string;
  closesAt: string;
  operatingDays: string[];
};

export type KitchenCuisinesData = {
  cuisineIds: string[];
};

export type OnboardingState = {
  organizationId: string | null;
  kitchenProfileId: string | null;
  basics: KitchenBasicsData | null;
  location: KitchenLocationData | null;
  cuisines: KitchenCuisinesData | null;
};

export function useKitchenOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basics");
  const [state, setState] = useState<OnboardingState>({
    organizationId: null,
    kitchenProfileId: null,
    basics: null,
    location: null,
    cuisines: null,
  });

  const createOrgMut = useMutation(createOrganizationMutation);
  const createProfileMut = useMutation(createKitchenProfileMutation);
  const setCuisinesMut = useMutation(setKitchenCuisinesMutation);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  const submitBasics = async (data: KitchenBasicsData) => {
    try {
      const org = await createOrgMut.mutateAsync({
        name: data.name,
        slug: data.slug,
      });

      setState((prev) => ({
        ...prev,
        basics: data,
        organizationId: org.id,
      }));

      goToStep("location");
    } catch (err) {
      toast.error("Failed to create organization", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const submitLocation = async (data: KitchenLocationData) => {
    if (!state.organizationId) {
      toast.error("Organization not found. Please restart the setup.");
      return;
    }

    try {
      const profile = await createProfileMut.mutateAsync({
        organizationId: state.organizationId,
        description: state.basics?.description,
        phone: state.basics?.phone,
        address: data.address,
        neighborhood: data.neighborhood,
        deliveryRadiusKm: data.deliveryRadiusKm,
        opensAt: data.opensAt,
        closesAt: data.closesAt,
        operatingDays: data.operatingDays,
      });

      setState((prev) => ({
        ...prev,
        location: data,
        kitchenProfileId: profile?.item?.id ?? null,
      }));

      goToStep("cuisines");
    } catch (err) {
      toast.error("Failed to create kitchen profile", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const submitCuisines = async (data: KitchenCuisinesData) => {
    if (!state.kitchenProfileId) {
      toast.error("Kitchen profile not found. Please restart the setup.");
      return;
    }

    try {
      if (data.cuisineIds.length > 0) {
        await setCuisinesMut.mutateAsync({
          kitchenId: state.kitchenProfileId,
          cuisineIds: data.cuisineIds,
        });
      }

      setState((prev) => ({ ...prev, cuisines: data }));
      goToStep("complete");
    } catch (err) {
      toast.error("Failed to save cuisine preferences", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const finishOnboarding = () => {
    if (state.organizationId) {
      navigate({
        to: "/dashboard/organizations/$orgId",
        params: { orgId: state.organizationId },
      });
    } else {
      navigate({ to: "/dashboard/organizations" });
    }
  };

  return {
    currentStep,
    stepIndex,
    progress,
    state,
    goToStep,
    submitBasics,
    submitLocation,
    submitCuisines,
    finishOnboarding,
    isPending:
      createOrgMut.isPending || createProfileMut.isPending || setCuisinesMut.isPending,
  } as const;
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChefHat, MapPin, UtensilsCrossed } from "lucide-react";
import { StepBasics } from "./StepBasics";
import { StepComplete } from "./StepComplete";
import { StepCuisines } from "./StepCuisines";
import { StepLocation } from "./StepLocation";
import { type OnboardingStep, useKitchenOnboarding } from "./useKitchenOnboarding";

const STEP_CONFIG: Record<OnboardingStep, { title: string; description: string; icon: React.ReactNode }> = {
  basics: {
    title: "Kitchen Identity",
    description: "Name your kitchen and tell customers about it",
    icon: <ChefHat className="size-5" />,
  },
  location: {
    title: "Location & Hours",
    description: "Where you operate and when you're available",
    icon: <MapPin className="size-5" />,
  },
  cuisines: {
    title: "Cuisine Types",
    description: "What kind of food does your kitchen serve?",
    icon: <UtensilsCrossed className="size-5" />,
  },
  complete: {
    title: "All Set!",
    description: "Your kitchen is ready to go",
    icon: <Check className="size-5" />,
  },
};

const ORDERED_STEPS: OnboardingStep[] = ["basics", "location", "cuisines", "complete"];

interface KitchenOnboardingWizardProps {
  onBack?: () => void;
}

export function KitchenOnboardingWizard({ onBack }: KitchenOnboardingWizardProps) {
  const onboarding = useKitchenOnboarding();
  const config = STEP_CONFIG[onboarding.currentStep];

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Set Up Your Kitchen</h1>
        <p className="text-muted-foreground">
          Complete these steps to get your kitchen listed on Dishi
        </p>
      </div>

      <StepIndicator currentStep={onboarding.currentStep} />

      <Progress value={onboarding.progress} className="h-2" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              {config.icon}
            </div>
            <div>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {onboarding.currentStep === "basics" && (
            <StepBasics
              onSubmit={onboarding.submitBasics}
              onBack={onBack}
              isPending={onboarding.isPending}
              initialData={onboarding.state.basics}
            />
          )}
          {onboarding.currentStep === "location" && (
            <StepLocation
              onSubmit={onboarding.submitLocation}
              onBack={() => onboarding.goToStep("basics")}
              isPending={onboarding.isPending}
              initialData={onboarding.state.location}
            />
          )}
          {onboarding.currentStep === "cuisines" && (
            <StepCuisines
              onSubmit={onboarding.submitCuisines}
              onBack={() => onboarding.goToStep("location")}
              isPending={onboarding.isPending}
              initialData={onboarding.state.cuisines}
            />
          )}
          {onboarding.currentStep === "complete" && (
            <StepComplete
              kitchenName={onboarding.state.basics?.name ?? "Your Kitchen"}
              onFinish={onboarding.finishOnboarding}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = ORDERED_STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center gap-2">
      {ORDERED_STEPS.filter((s) => s !== "complete").map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = index < currentIndex;
        const config = STEP_CONFIG[step];

        return (
          <div key={step} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={`h-px w-8 transition-colors ${
                  isCompleted ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="size-3.5" /> : config.icon}
              <span className="hidden sm:inline">{config.title}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

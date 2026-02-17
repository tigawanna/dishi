import { Button } from "@/components/ui/button";
import { CheckCircle2, ChefHat } from "lucide-react";

interface StepCompleteProps {
  kitchenName: string;
  onFinish: () => void;
}

export function StepComplete({ kitchenName, onFinish }: StepCompleteProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
        <CheckCircle2 className="text-primary size-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{kitchenName} is ready!</h2>
        <p className="text-muted-foreground max-w-md">
          Your kitchen has been set up successfully. You can now manage your menu,
          update your profile, and start serving customers.
        </p>
      </div>

      <div className="flex gap-3">
        <Button size="lg" onClick={onFinish}>
          <ChefHat className="mr-2 size-5" />
          Go to Kitchen Dashboard
        </Button>
      </div>
    </div>
  );
}

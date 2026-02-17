import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import type { KitchenLocationData } from "./useKitchenOnboarding";

const DAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
] as const;

const formOpts = formOptions({
  defaultValues: {
    address: "",
    neighborhood: "",
    deliveryRadiusKm: "5",
    opensAt: "08:00",
    closesAt: "20:00",
    operatingDays: ["mon", "tue", "wed", "thu", "fri"],
  } satisfies KitchenLocationData,
});

interface StepLocationProps {
  onSubmit: (data: KitchenLocationData) => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  initialData: KitchenLocationData | null;
}

export function StepLocation({ onSubmit, onBack, isPending, initialData }: StepLocationProps) {
  const form = useAppForm({
    ...formOpts,
    defaultValues: initialData ?? formOpts.defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit({
        address: value.address.trim(),
        neighborhood: value.neighborhood.trim(),
        deliveryRadiusKm: value.deliveryRadiusKm,
        opensAt: value.opensAt,
        closesAt: value.closesAt,
        operatingDays: value.operatingDays,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.AppField
        name="address"
        validators={{ onChange: z.string().min(3, "Address is required") }}
      >
        {(f) => (
          <f.TextField
            label="Street Address"
            placeholder="e.g. 123 Kenyatta Avenue"
          />
        )}
      </form.AppField>

      <form.AppField
        name="neighborhood"
        validators={{ onChange: z.string().min(2, "Neighborhood is required") }}
      >
        {(f) => (
          <f.TextField
            label="Neighborhood"
            placeholder="e.g. Westlands, Kilimani"
          />
        )}
      </form.AppField>

      <form.AppField
        name="deliveryRadiusKm"
        validators={{
          onChange: z.string().refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0 && num <= 50;
          }, "Delivery radius must be between 1 and 50 km"),
        }}
      >
        {(f) => (
          <f.TextField
            label="Delivery Radius (km)"
            placeholder="e.g. 5"
            type="number"
            min={1}
            max={50}
            step={0.5}
          />
        )}
      </form.AppField>

      <div className="grid grid-cols-2 gap-4">
        <form.AppField
          name="opensAt"
          validators={{ onChange: z.string().min(1, "Opening time is required") }}
        >
          {(f) => (
            <f.TextField
              label="Opens At"
              type="time"
            />
          )}
        </form.AppField>

        <form.AppField
          name="closesAt"
          validators={{ onChange: z.string().min(1, "Closing time is required") }}
        >
          {(f) => (
            <f.TextField
              label="Closes At"
              type="time"
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="operatingDays">
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Operating Days</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DAYS.map((day) => {
                const isSelected = field.state.value.includes(day.value);
                return (
                  <label
                    key={day.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const current = field.state.value;
                        if (checked) {
                          field.handleChange([...current, day.value]);
                        } else {
                          field.handleChange(current.filter((d) => d !== day.value));
                        }
                      }}
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </form.AppField>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <form.AppForm>
          <form.SubmitButton label={isPending ? "Saving..." : "Next"} />
        </form.AppForm>
      </div>
    </form>
  );
}

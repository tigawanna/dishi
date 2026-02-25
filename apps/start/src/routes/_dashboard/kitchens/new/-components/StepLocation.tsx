import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { OperatingHours } from "@/data-access-layer/kitchen/kitchen-profile";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import type { KitchenLocationData } from "./useKitchenOnboarding";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAYS: { value: DayKey; label: string; short: string }[] = [
  { value: "mon", label: "Monday", short: "Mon" },
  { value: "tue", label: "Tuesday", short: "Tue" },
  { value: "wed", label: "Wednesday", short: "Wed" },
  { value: "thu", label: "Thursday", short: "Thu" },
  { value: "fri", label: "Friday", short: "Fri" },
  { value: "sat", label: "Saturday", short: "Sat" },
  { value: "sun", label: "Sunday", short: "Sun" },
];

const DEFAULT_OPERATING_HOURS: OperatingHours = {
  mon: { opensAt: "08:00", closesAt: "20:00" },
  tue: { opensAt: "08:00", closesAt: "20:00" },
  wed: { opensAt: "08:00", closesAt: "20:00" },
  thu: { opensAt: "08:00", closesAt: "20:00" },
  fri: { opensAt: "08:00", closesAt: "20:00" },
};

const formOpts = formOptions({
  defaultValues: {
    address: "",
    neighborhood: "",
    deliveryRadiusKm: "5",
  },
});

interface StepLocationProps {
  onSubmit: (data: KitchenLocationData) => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  initialData: KitchenLocationData | null;
}

export function StepLocation({ onSubmit, onBack, isPending, initialData }: StepLocationProps) {
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(
    initialData?.operatingHours ?? DEFAULT_OPERATING_HOURS,
  );

  const form = useAppForm({
    ...formOpts,
    defaultValues: {
      address: initialData?.address ?? "",
      neighborhood: initialData?.neighborhood ?? "",
      deliveryRadiusKm: initialData?.deliveryRadiusKm ?? "5",
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        address: value.address.trim(),
        neighborhood: value.neighborhood.trim(),
        deliveryRadiusKm: value.deliveryRadiusKm,
        operatingHours,
      });
    },
  });

  const toggleDay = (day: DayKey) => {
    setOperatingHours((prev) => {
      const next = { ...prev };
      if (next[day]) {
        delete next[day];
      } else {
        next[day] = { opensAt: "08:00", closesAt: "20:00" };
      }
      return next;
    });
  };

  const updateDayTime = (day: DayKey, field: "opensAt" | "closesAt", value: string) => {
    setOperatingHours((prev) => {
      const existing = prev[day];
      if (!existing) return prev;
      return {
        ...prev,
        [day]: { ...existing, [field]: value },
      };
    });
  };

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

      <div className="space-y-3">
        <label className="text-sm font-medium">Operating Hours</label>
        <p className="text-muted-foreground text-xs">
          Toggle days on/off and set hours for each day
        </p>

        <div className="space-y-2">
          {DAYS.map((day) => {
            const hours = operatingHours[day.value];
            const isEnabled = !!hours;

            return (
              <div
                key={day.value}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  isEnabled
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <Checkbox
                  checked={isEnabled}
                  onCheckedChange={() => toggleDay(day.value)}
                />
                <span className="w-10 text-sm font-medium">{day.short}</span>

                {isEnabled ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="time"
                      value={hours.opensAt}
                      onChange={(e) => updateDayTime(day.value, "opensAt", e.target.value)}
                      className="h-8 w-auto text-sm"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <Input
                      type="time"
                      value={hours.closesAt}
                      onChange={(e) => updateDayTime(day.value, "closesAt", e.target.value)}
                      className="h-8 w-auto text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

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

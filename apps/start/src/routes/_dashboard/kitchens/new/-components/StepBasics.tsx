import { Button } from "@/components/ui/button";
import { useAppForm } from "@/lib/tanstack/form";
import { slugify } from "@/utils/slugify";
import { formOptions } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import type { KitchenBasicsData } from "./useKitchenOnboarding";

const formOpts = formOptions({
  defaultValues: {
    name: "",
    slug: "",
    description: "",
    phone: "",
  } satisfies KitchenBasicsData,
});

interface StepBasicsProps {
  onSubmit: (data: KitchenBasicsData) => Promise<void>;
  onBack?: () => void;
  isPending: boolean;
  initialData: KitchenBasicsData | null;
}

export function StepBasics({ onSubmit, onBack, isPending, initialData }: StepBasicsProps) {
  const form = useAppForm({
    ...formOpts,
    defaultValues: initialData ?? formOpts.defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name.trim(),
        slug: value.slug.trim(),
        description: value.description?.trim(),
        phone: value.phone?.trim(),
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
      className="space-y-4">
      <form.AppField
        name="name"
        validators={{ onChange: z.string().min(2, "Kitchen name must be at least 2 characters") }}
        listeners={{
          onChangeDebounceMs: 400,
          onChange: ({ value }) => {
            if (!value || value.trim() === "") return;
            form.setFieldValue("slug", slugify(value));
          },
        }}>
        {(f) => <f.TextField label="Kitchen Name" placeholder="e.g. Mama Aisha's Kitchen" />}
      </form.AppField>

      <form.AppField
        name="slug"
        validators={{ onChange: z.string().min(2, "Slug must be at least 2 characters") }}>
        {(f) => <f.TextField label="URL Slug" placeholder="e.g. mama-aishas-kitchen" />}
      </form.AppField>

      <form.AppField
        name="description"
        validators={{
          onChange: z.string().max(500, "Description must be 500 characters or less").optional(),
        }}>
        {(f) => (
          <f.TextAreaField
            label="Description"
            placeholder="Tell customers what makes your kitchen special..."
          />
        )}
      </form.AppField>

      <form.AppField
        name="phone"
        validators={{
          onChange: z.string().optional(),
        }}>
        {(f) => <f.TextField label="WhatsApp Phone" placeholder="e.g. +254 712 345 678" />}
      </form.AppField>

      <div className="flex justify-between pt-2">
        {onBack ? (
          <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        ) : (
          <div />
        )}
        <form.AppForm>
          <form.SubmitButton label={isPending ? "Creating..." : "Next"} />
        </form.AppForm>
      </div>
    </form>
  );
}

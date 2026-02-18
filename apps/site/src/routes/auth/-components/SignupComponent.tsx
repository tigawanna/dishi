import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { authClient } from "@/lib/better-auth/client";
import { treatyClient } from "@/lib/elysia/eden-treaty";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type SignupIntent = "kitchen-owner" | "staff" | "user";

type SignupUserPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  image: string | undefined;
};

const INTENT_HEADINGS: Record<SignupIntent, string> = {
  "kitchen-owner": "Start Your Kitchen",
  staff: "Join Your Team",
  user: "Sign up",
};

const INTENT_REDIRECT: Record<SignupIntent, string> = {
  "kitchen-owner": "/dashboard/owner/onboarding/kitchen",
  staff: "/dashboard/staff/profile",
  user: "/dashboard/user/profile",
};

const formOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    image: undefined,
  } satisfies SignupUserPayload,
});

export function SignupComponent() {
  const { returnTo, intent: rawIntent } = useSearch({
    from: "/auth/signup",
  });
  const intent = rawIntent ?? "user";
  console.log("[Signup] intent:", intent, "| rawIntent:", rawIntent, "| returnTo:", returnTo);
  const [showPassword, setShowPassword] = useState(false);
  const qc = useQueryClient();
  const router = useRouter();

  const claimOwnerMutation = useMutation({
    mutationFn: async () => {
      const { error } = await treatyClient.kitchen["claim-owner"].post();
      if (error) throw new Error(String(error));
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SignupUserPayload) => {
      return authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
      });
    },
    async onSuccess(data) {
      console.log("[Signup] onSuccess | intent:", intent, "| error:", data.error);

      if (data.error) {
        toast.error("Something went wrong", {
          description: `${data.error.message}`,
        });
        return;
      }

      if (intent === "kitchen-owner") {
        console.log("[Signup] claiming owner role...");
        try {
          await claimOwnerMutation.mutateAsync();
          console.log("[Signup] claim-owner succeeded");
        } catch (err) {
          console.error("[Signup] claim-owner failed:", err);
          await authClient.signOut();
          qc.invalidateQueries(viewerqueryOptions);
          router.invalidate();
          toast.error("Signup failed", {
            description:
              err instanceof Error
                ? err.message
                : "Could not assign owner role. Please try again.",
          });
          return;
        }
      }

      toast.success("Signed up", {
        description: `Welcome ${data.data?.user.name}`,
      });
      qc.invalidateQueries(viewerqueryOptions);
      router.invalidate();
      window.location.href = INTENT_REDIRECT[intent];
    },
    onError(error) {
      toast.error("Something went wrong", {
        description: `${error.message}`,
      });
    },
  });

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      const formData = value as SignupUserPayload;
      if (formData.password !== formData.passwordConfirm) {
        toast.error("Passwords don't match");
        return;
      }
      await mutation.mutate(formData);
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-evenly gap-2 p-5">
      <img src="/logo.svg" alt="logo" className="hidden w-[30%] object-cover md:flex" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-base-300/20 flex h-full w-[90%] flex-col items-center justify-center gap-6 rounded-lg p-[2%] md:w-[70%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">{INTENT_HEADINGS[intent]}</h1>

          <form.AppField
            name="name"
            validators={{
              onChange: z.string().min(1, "Name is required"),
            }}>
            {(field) => <field.TextField label="Username" />}
          </form.AppField>

          <form.AppField
            name="email"
            validators={{
              onChange: z.email("Invalid email address"),
            }}>
            {(field) => <field.EmailField />}
          </form.AppField>

          <form.AppField
            name="password"
            validators={{
              onChange: z.string().min(8, "Password must be at least 8 characters"),
            }}>
            {(field) => <field.PasswordField label="Password" showPassword={showPassword} />}
          </form.AppField>

          <form.AppField
            name="passwordConfirm"
            validators={{
              onChange: z.string().min(8, "Password must be at least 8 characters"),
              onChangeListenTo: ["password"],
              onChangeAsyncDebounceMs: 500,
            }}>
            {(field) => (
              <field.PasswordField label="Confirm password" showPassword={showPassword} />
            )}
          </form.AppField>

          <div className="w-full">
            <div className="flex w-full items-center justify-center gap-3">
              <label htmlFor="showPassword" className="text-sm">
                Show password
              </label>
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                className="checkbox-primary checkbox ring-primary ring-1"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Sign up" className="w-full" />
        </form.AppForm>

        <div className="flex items-center gap-1">
          <span>Already have an account?</span>
          <Link to="/auth" search={{ returnTo: returnTo ?? "/", intent }} className="link link-primary">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

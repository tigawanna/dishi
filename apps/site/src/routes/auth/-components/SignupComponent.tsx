import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { authClient } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type SignupUserPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  image: string | undefined;
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
  const { returnTo } = useSearch({ from: "/auth/signup" });
  const [showPassword, setShowPassword] = useState(false);
  const qc = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

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
      if (data.error) {
        toast.error("Something went wrong", {
          description: `${data.error.message}`,
        });
        return;
      }

      toast.success("Signed up", {
        description: `Welcome ${data.data?.user.name}`,
      });
      await qc.invalidateQueries(viewerqueryOptions);
      await router.invalidate();
      navigate({ to: returnTo ?? "/profile" });
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
          <h1 className="text-4xl font-bold">Sign up</h1>

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
          <Link to="/auth" search={{ returnTo: returnTo ?? "/" }} className="link link-primary">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

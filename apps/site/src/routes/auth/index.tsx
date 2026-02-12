import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SigninComponent } from "./-components/SigninComponent";

const searchparams = z.object({
  returnTo: z.string(),
});
export const Route = createFileRoute("/auth/")({
  component: SigninPage,
  validateSearch: (search) => searchparams.parse(search),
  async beforeLoad(ctx) {
    const viewer = ctx.context?.viewer;
    const returnTo = ctx.search?.returnTo ?? "/";
    if (viewer?.user) {
      throw redirect({ to: returnTo });
    }
  },
  head: () => ({
    meta: [
      {
        title: "Dishi | Signin",
        description: "Login to your account",
      },
    ],
  }),
});

export function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <ResponsiveGenericToolbar>
        <div className="flex min-h-screen flex-col">
          <SigninComponent />
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

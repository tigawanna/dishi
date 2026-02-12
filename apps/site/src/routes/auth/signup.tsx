import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { Helmet } from "@/components/wrappers/custom-helmet";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignupComponent } from "./-components/SignupComponent";

const searchparams = z.object({
  returnTo: z.string(),
});
export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  validateSearch: (search) => searchparams.parse(search),
  head: () => ({
    meta: [
      {
        title: "Dishi | Signup",
        description: "Create a new account",
      },
    ],
  }),
});

export function SignupPage() {
  return (
    <div className="to-primary/50items-center flex h-full min-h-screen w-full flex-col justify-center">
      <ResponsiveGenericToolbar>
        <SignupComponent />
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

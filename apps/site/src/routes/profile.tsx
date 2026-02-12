import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { useViewer } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Dishi | Profile",
        description: "Your profile",
      },
    ],
  }),
  beforeLoad: async (context) => {
    if (!context.context.viewer?.user) {
      throw redirect({
        to: "/auth",
        search: {
          returnTo: context.location.pathname,
        },
      });
    }
  },
});

function RouteComponent() {
  const { viewer } = useViewer();
  return (
    <div className="bg-base-100 flex h-full min-h-screen w-full flex-col">
      <ResponsiveGenericToolbar>
        <div className="min-h-screen flex flex-col items-center justify-center mx-auto p-5"> 
          <h1 className="text-base-content text-4xl font-bold">{viewer.user?.name}</h1>
          <p className="text-base-content/70" data-test="profile-email">{viewer.user?.email}</p>
          <p className="text-base-content/70" data-test="profile-role">{viewer.user?.role}</p>
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

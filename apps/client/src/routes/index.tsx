import { Footer } from "@/components/navigation/Footer";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { Helmet } from "@/components/wrappers/custom-helmet";
import { useViewer } from "@/data-access-layer/users/viewer";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, FileText, User, Users, Vote } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { viewer } = useViewer();
  return (
    <div
      data-test="homepage"
      className="bg-base-100 flex h-full min-h-screen w-full flex-col items-center"
    >
      <Helmet
        title="Townhall - Community Governance"
        description="Democratic governance for your community"
      />

      <ResponsiveGenericToolbar>
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-10 p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1
              data-test="homepage-section-welcome"
              className="text-base-content text-5xl font-bold md:text-6xl"
            >
              Welcome{viewer.user?.name ? `, ${viewer.user.name}` : " to Townhall"}
            </h1>
            <p className="text-base-content/70 text-lg">
              Propose ideas, discuss together, and vote on what matters to your community
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              data-test="homepage-section--dashboard-link"
              className="btn btn-primary btn-lg gap-2"
            >
              <span>Enter Townhall</span>
              <ArrowRightIcon className="size-6" />
            </Link>
            <Link to="/profile" className="btn btn-outline btn-lg gap-2">
              <User className="size-5" />
              <span>Profile</span>
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <Link
              to="/dashboard/proposals"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="card-body items-center text-center">
                <FileText className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Proposals</h3>
                <p className="text-base-content/70 text-sm">
                  Create and review community proposals
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/voting"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="card-body items-center text-center">
                <Vote className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Voting</h3>
                <p className="text-base-content/70 text-sm">Vote on active proposals</p>
              </div>
            </Link>
            <Link
              to="/dashboard/members"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="card-body items-center text-center">
                <Users className="text-primary mb-2 size-12" />
                <h3 className="card-title text-lg">Members</h3>
                <p className="text-base-content/70 text-sm">View townhall members and council</p>
              </div>
            </Link>
          </div>
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

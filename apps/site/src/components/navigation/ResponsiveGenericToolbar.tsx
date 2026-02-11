import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";
import { FileText, History, Home, LayoutDashboard, User, Users, Vote } from "lucide-react";

interface ResponsiveGenericToolbarProps {
  children: React.ReactNode;
}

export function ResponsiveGenericToolbar({ children }: ResponsiveGenericToolbarProps) {
  return (
    <div className="drawer" data-test="sidebar-drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-100 flex h-full min-h-screen flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-100/80 border-base-300 sticky top-0 z-10 border-b backdrop-blur-md md:hidden px-4 py-2">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost btn-sm"
              data-test="homepage-side-drawer-toggle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2">
            <Link
              to="/"
              className="text-base-content hover:text-primary flex items-center gap-2 text-lg font-bold"
            >
              {(() => {
                const Icon = AppConfig.icon as any;
                return <Icon className="size-5" />;
              })()}
              <span className="hidden xs:inline">{AppConfig.name}</span>
            </Link>
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Navbar */}
        <div
          data-test="homepage-toolbar"
          className="navbar bg-base-100/80 border-base-300 sticky top-0 z-10 hidden border-b backdrop-blur-md md:flex px-6"
        >
          <div className="flex-1">
            <Link
              to="/"
              data-test="homepage-home-link"
              className="btn btn-ghost text-base-content hover:text-primary flex items-center gap-2 text-xl font-bold normal-case px-0"
            >
              {(() => {
                const Icon = AppConfig.icon as any;
                return <Icon className="size-6" />;
              })()}
              {AppConfig.name}
            </Link>
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </div>
        {/* Page content */}
        {children}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul
          data-test="homepage-sidebar"
          className="menu bg-base-100 border-base-300 min-h-full w-64 md:w-80 border-r p-4 text-sm md:text-base"
        >
          {/* Sidebar Header */}
          <li className="menu-title mb-4 px-0">
            <Link
              to="/"
              data-test="sidebar-homepage-home-link"
              className="hover:text-primary flex items-center justify-center md:justify-start gap-2 p-3 text-lg md:text-xl font-bold rounded-lg hover:bg-base-200"
            >
              {(() => {
                const Icon = AppConfig.icon as any;
                return <Icon className="size-6 md:size-8" />;
              })()}
              <span className="hidden md:inline">{AppConfig.name}</span>
            </Link>
          </li>

          <div className="divider my-2" />

          {/* Main Navigation */}
          <li>
            <Link to="/" className="gap-3">
              <Home className="size-5" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="gap-3">
              <LayoutDashboard className="size-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className="gap-3">
              <User className="size-5" />
              Profile
            </Link>
          </li>

          <div className="divider my-2">Governance</div>

          {/* Governance Links */}
          <li>
            <Link to="/dashboard/proposals" className="gap-3">
              <FileText className="size-5" />
              <span>Proposals</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/audit" className="gap-3">
              <History className="size-5" />
              <span>Audit Log</span>
            </Link>
          </li>

          {/* Theme Toggle for Mobile */}
          <li className="mt-auto pt-4 border-t border-base-300">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </div>
  );
}

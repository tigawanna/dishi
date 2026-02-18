import { createFileRoute, redirect } from "@tanstack/react-router";
import type { BetterAuthUserRoles } from "@repo/isomorphic/auth-roles";

const ROLE_DASHBOARD_MAP: Record<BetterAuthUserRoles, string> = {
  owner: "/dashboard/owner",
  staff: "/dashboard/staff",
  user: "/dashboard/user",
};

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async ({ context }) => {
    const role = (context.viewer?.user?.role ?? "user") as BetterAuthUserRoles;
    const target = ROLE_DASHBOARD_MAP[role] ?? "/dashboard/user";
    throw redirect({ to: target });
  },
  component: () => null,
});

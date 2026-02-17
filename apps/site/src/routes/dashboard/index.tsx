import { createFileRoute, redirect } from "@tanstack/react-router";
import type { BetterAuthUserRoles } from "@repo/isomorphic/auth-roles";

const ROLE_DASHBOARD_MAP: Record<BetterAuthUserRoles, string> = {
  owner: "/dashboard/owner",
  staff: "/dashboard/staff",
  customer: "/dashboard/customer",
};

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async ({ context }) => {
    const role = (context.viewer?.user?.role ?? "customer") as BetterAuthUserRoles;
    const target = ROLE_DASHBOARD_MAP[role] ?? "/dashboard/customer";
    throw redirect({ to: target });
  },
  component: () => null,
});

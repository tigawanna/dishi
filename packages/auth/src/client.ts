import { ac, roles, type BetterAuthUserRoles, type BetterAuthOrgRoles } from "./roles.js";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export function createBetterAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [
      adminClient({
        ac: ac as any,
        roles,
      }),
      organizationClient(),
    ],
  });
}

export type BetterAuthClient = ReturnType<typeof createBetterAuthClient>;
export type BetterAuthSession = BetterAuthClient["$Infer"]["Session"];

export const userRoles = Object.keys(roles) as BetterAuthUserRoles[];

export type { BetterAuthUserRoles, BetterAuthOrgRoles };

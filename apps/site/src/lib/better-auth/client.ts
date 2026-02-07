import { createBetterAuthClient } from "@repo/auth/client";
import { envVariables } from "../env";

export const authClient = createBetterAuthClient(envVariables.VITE_API_URL);

export type { BetterAuthSession, BetterAuthUserRoles, BetterAuthOrgRoles } from "@repo/auth/client";
export { userRoles } from "@repo/auth/client";

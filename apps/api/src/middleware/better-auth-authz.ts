import { auth } from "@backend/lib/auth";
import { type BetterAuthUserRoles, ac } from "@repo/auth/roles";
import type { ReadonlyToMutable } from "@repo/isomorphic/typescript-helpers";
import { Elysia } from "elysia";

type PermissionsStatements = ReadonlyToMutable<typeof ac.statements>;

export const betterAuthZMiddleware = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session)
        return status(401, {
          code: "UNAUTHORIZED",
          name: "Unauthorized",
          message: "Authentication required to access this resource.",
        });

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
  requireRole: (requireRole: BetterAuthUserRoles[]) => ({
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session)
        return status(401, {
          code: "UNAUTHORIZED",
          name: "Unauthorized",
          message: "Authentication required to access this resource.",
        });

      const userRole = (session.user.role || "customer") as BetterAuthUserRoles;
      if (!requireRole.includes(userRole)) {
        return status(403, {
          code: "FORBIDDEN",
          name: "Forbidden",
          message: `Access denied. Requires one of the following roles: ${requireRole.join(
            ", ",
          )}. Your role: ${userRole}.`,
        });
      }

      return {
        user: session.user,
        session: session.session,
      };
    },
  }),
  requirePermission: (permission: PermissionsStatements) => ({
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session)
        return status(401, {
          code: "UNAUTHORIZED",
          name: "Unauthorized",
          message: "Authentication required to access this resource.",
        });

      const userRole = (session.user.role || "customer") as BetterAuthUserRoles;
      const hasPermission = await auth.api.userHasPermission({
        body: {
          role: userRole,
          permissions: permission,
        },
      });

      if (!hasPermission) {
        return status(403, {
          code: "FORBIDDEN",
          name: "Forbidden",
          message:
            "Access denied. You do not have the required permissions to access this resource.",
        });
      }

      return {
        user: session.user,
        session: session.session,
      };
    },
  }),
});

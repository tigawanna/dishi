/**
 * Better Auth Middleware with RBAC Support
 *
 * Usage Examples:
 *
 * 1. Basic Authentication:
 *    app.get('/profile', ({ user }) => user, { auth: true })
 *
 * 2. Role-Based Access Control:
 *    app.post('/properties', ({ user }) => createProperty(), {
 *      requireRole: ['admin', 'landlord']
 *    })
 *
 * 3. Permission-Based Access Control:
 *    app.put('/properties/:id', ({ user, resourceId }) => updateProperty(resourceId), {
 *      requirePermission: { property: ['update'] }
 *    })
 *
 * Available Roles:
 * - owner: Platform super admin, full user/session/org management
 * - user: Default role, browse kitchens, favorites, saved addresses
 */

import { auth } from "@backend/lib/auth";
import { ac, BetterAuthUserRoles } from "@repo/isomorphic/auth-roles";
import type { ReadonlyToMutable } from "@repo/isomorphic/typescript-helpers";
import { Elysia } from "elysia";

type PermissionsStatements = ReadonlyToMutable<typeof ac.statements>;

// Better Auth middleware with authentication and RBAC macros
export const betterAuthZMiddleware = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });
      console.log("\n betterAuthZMiddleware - session:", {
        id: session?.user.id,
        role: session?.user.role,
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
    /**
     * Checks if the authenticated user has one of the required roles
     * @param requireRole - Array of role names allowed to access this route
     * @returns 401 if not authenticated, 403 if user doesn't have required role
     * @example
     * // Allow only admins
     * app.post('/admin', handler, { requireRole: ['admin'] })
     *
     * // Allow admins or users
     * app.get('/data', handler, { requireRole: ['admin', 'user'] })
     */
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });
      console.log("\n betterAuthZMiddleware - requireRole:", {
        id: session?.user.id,
        role: session?.user.role,
      });
      if (!session)
        return status(401, {
          code: "UNAUTHORIZED",
          name: "Unauthorized",
          message: "Authentication required to access this resource.",
        });

      const userRole = (session.user.role || "user") as BetterAuthUserRoles;
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
    /**
     * Checks if the authenticated user's role has specific permissions
     * @param permission - Object mapping resources to required actions
     * @returns 401 if not authenticated, 403 if user doesn't have required permissions
     * @example
     * // Require 'create' permission on 'user' resource
     * app.post('/users', handler, { requirePermission: { user: ['create'] } })
     *
     * // Require multiple permissions
     * app.put('/users/:id', handler, { requirePermission: { user: ['update'], session: ['revoke'] } })
     *
     * // Admin has all permissions by default
     */
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });
      console.log("betterAuthZMiddleware - requirePermission:", session?.user.id);
      if (!session)
        return status(401, {
          code: "UNAUTHORIZED",
          name: "Unauthorized",
          message: "Authentication required to access this resource.",
        });

      const userRole = (session.user.role || "user") as BetterAuthUserRoles;
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

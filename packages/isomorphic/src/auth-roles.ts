import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
  session: ["list", "revoke", "delete"],
  member: ["invite", "remove", "list", "assign-role"],
} as const;

const ac = createAccessControl(statement);

const roles = {
  owner: ac.newRole({
    ...adminAc.statements,
    user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
    session: ["list", "revoke", "delete"],
    member: ["invite", "remove", "list", "assign-role"],
  }),

  customer: ac.newRole({
    user: [],
    session: [],
    member: ["list"],
  }),
};

type BetterAuthUserRoles = keyof typeof roles;
type BetterAuthOrgRoles = "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];

export { ac, roles, type BetterAuthUserRoles, type BetterAuthOrgRoles };

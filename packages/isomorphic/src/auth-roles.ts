import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,

  user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
  session: ["list", "revoke", "delete"],

  kitchen: ["create", "read", "update", "delete", "list", "verify", "suspend"],
  menu: ["create", "read", "update", "delete", "list"],
  cuisine: ["create", "read", "update", "delete", "list"],
  favorite: ["create", "read", "delete", "list"],
  location: ["create", "read", "update", "delete", "list"],
} as const;

const ac = createAccessControl(statement);

const roles = {
  platformAdmin: ac.newRole({
    ...adminAc.statements,
    user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
    session: ["list", "revoke", "delete"],
    kitchen: ["create", "read", "update", "delete", "list", "verify", "suspend"],
    menu: ["create", "read", "update", "delete", "list"],
    cuisine: ["create", "read", "update", "delete", "list"],
    favorite: ["create", "read", "delete", "list"],
    location: ["create", "read", "update", "delete", "list"],
  }),

  customer: ac.newRole({
    kitchen: ["read", "list"],
    menu: ["read", "list"],
    cuisine: ["read", "list"],
    favorite: ["create", "read", "delete", "list"],
    location: ["create", "read", "update", "delete", "list"],
    session: ["list"],
  }),
};

type BetterAuthUserRoles = keyof typeof roles;
type BetterAuthOrgRoles = "owner" | "staff" | ("owner" | "staff")[];

export { ac, roles, type BetterAuthUserRoles, type BetterAuthOrgRoles };

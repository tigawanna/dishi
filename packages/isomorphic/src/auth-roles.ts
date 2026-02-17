import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  kitchen: ["list", "view", "create", "update", "delete", "set-availability"],
  cuisine: ["list", "view", "assign"],
  menu: ["list", "view", "create", "update", "delete"],
  order: ["list", "view", "create", "update", "cancel"],
  member: ["list", "invite", "remove", "assign-role"],
  organization: ["list", "view", "update", "delete"],
  favorite: ["list", "create", "delete"],
  location: ["list", "create", "update", "delete"],
  user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
  session: ["list", "revoke", "delete"],
} as const;

const ac = createAccessControl(statement);

const roles = {
  owner: ac.newRole({
    kitchen: ["list", "view", "create", "update", "delete", "set-availability"],
    cuisine: ["list", "view", "assign"],
    menu: ["list", "view", "create", "update", "delete"],
    order: ["list", "view", "create", "update", "cancel"],
    member: ["list", "invite", "remove", "assign-role"],
    organization: ["list", "view", "update", "delete"],
    favorite: ["list", "create", "delete"],
    location: ["list", "create", "update", "delete"],
    user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
    session: ["list", "revoke", "delete"],
  }),

  staff: ac.newRole({
    kitchen: ["list", "view"],
    cuisine: ["list", "view"],
    menu: ["list", "view", "create", "update", "delete"],
    order: ["list", "view", "create", "update"],
    member: ["list"],
    organization: ["list", "view"],
    favorite: ["list", "create", "delete"],
    location: ["list", "create", "update", "delete"],
    user: [],
    session: [],
  }),

  customer: ac.newRole({
    kitchen: ["list", "view"],
    cuisine: ["list", "view"],
    menu: ["list", "view"],
    order: ["list", "view", "create", "cancel"],
    member: [],
    organization: [],
    favorite: ["list", "create", "delete"],
    location: ["list", "create", "update", "delete"],
    user: [],
    session: [],
  }),
};

type BetterAuthUserRoles = keyof typeof roles;
type BetterAuthOrgRoles = "owner" | "staff" | "member" | ("owner" | "staff" | "member")[];

export { ac, roles, type BetterAuthUserRoles, type BetterAuthOrgRoles };

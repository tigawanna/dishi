import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Townhall Governance Platform - Role Hierarchy
 *
 * Platform Level (Global):
 *   - platformAdmin: Super admin, manages entire system
 *
 * Townhall Level (Organization-scoped):
 *   - admin: Townhall administrator (manages members, assigns roles)
 *   - council: Review & approval authority (approve/reject proposals)
 *   - citizen: Default member role (create proposals, vote)
 */

const statement = {
  ...defaultStatements,
  // Platform-level resources
  user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
  session: ["list", "revoke", "delete"],
  townhall: ["create", "read", "update", "delete", "list"],

  // Townhall-level resources
  member: ["invite", "remove", "list", "assign-role"],
  proposal: [
    "create",
    "read",
    "update",
    "delete",
    "list",
    "submit",
    "approve",
    "reject",
    "archive",
  ],
  vote: ["create", "read", "list", "close"],
  comment: ["create", "read", "delete", "list"],
  audit: ["read", "list"],
} as const;

const ac = createAccessControl(statement);

const roles = {
  /**
   * Platform Admin (Super Admin)
   * - Full control over entire system
   * - Can create/delete townhalls
   * - Can manage users across all townhalls
   * - Can override any townhall-level decision
   */
  platformAdmin: ac.newRole({
    ...adminAc.statements,
    user: ["create", "list", "set-role", "ban", "delete", "impersonate"],
    session: ["list", "revoke", "delete"],
    townhall: ["create", "read", "update", "delete", "list"],
    member: ["invite", "remove", "list", "assign-role"],
    proposal: [
      "create",
      "read",
      "update",
      "delete",
      "list",
      "submit",
      "approve",
      "reject",
      "archive",
    ],
    vote: ["create", "read", "list", "close"],
    comment: ["create", "read", "delete", "list"],
    audit: ["read", "list"],
  }),

  /**
   * Townhall Admin
   * - Manage townhall members (invite, remove)
   * - Assign and revoke roles within their townhall
   * - Archive old proposals
   * - View full audit log for their townhall
   * - Configure townhall settings
   * - Cannot delete the townhall (only Platform Admin can)
   */
  admin: ac.newRole({
    townhall: ["read", "update"],
    member: ["invite", "remove", "list", "assign-role"],
    proposal: ["create", "read", "update", "list", "submit", "approve", "reject", "archive"],
    vote: ["create", "read", "list", "close"],
    comment: ["create", "read", "delete", "list"],
    audit: ["read", "list"],
    session: ["list"],
  }),

  /**
   * Council Member
   * - Review proposals submitted by Citizens
   * - Approve proposals to move them to voting stage
   * - Reject proposals with reason
   * - Comment on any proposal
   * - View their own audit trail
   * - Cannot manage members, assign roles, or archive proposals
   */
  council: ac.newRole({
    townhall: ["read"],
    member: ["list"],
    proposal: ["create", "read", "list", "submit", "approve", "reject"],
    vote: ["create", "read", "list"],
    comment: ["create", "read", "list"],
    audit: ["read"],
    session: ["list"],
  }),

  /**
   * Citizen (Default Member Role)
   * - Create proposal drafts
   * - Submit their own proposals for Council review
   * - Vote on proposals in the voting stage
   * - Comment on any proposal
   * - View their own activity
   * - Cannot approve proposals, manage members, or see full audit logs
   */
  citizen: ac.newRole({
    townhall: ["read"],
    member: ["list"],
    proposal: ["create", "read", "list", "submit"],
    vote: ["create", "read", "list"],
    comment: ["create", "read", "list"],
    session: ["list"],
  }),
};

type BetterAuthUserRoles = keyof typeof roles;
type BetterAuthOrgRoles = "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];

export { ac, roles, type BetterAuthUserRoles, type BetterAuthOrgRoles };

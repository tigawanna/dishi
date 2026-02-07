import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

export const auditActionEnum = [
  "proposal_created",
  "proposal_updated",
  "proposal_submitted",
  "proposal_approved",
  "proposal_rejected",
  "proposal_archived",
  "voting_started",
  "voting_closed",
  "vote_cast",
  "comment_created",
  "comment_deleted",
  "member_invited",
  "member_joined",
  "member_removed",
  "member_role_changed",
  "townhall_created",
  "townhall_updated",
  "townhall_deleted",
] as const;

export type AuditAction = (typeof auditActionEnum)[number];

export const auditResourceTypeEnum = [
  "proposal",
  "vote",
  "comment",
  "member",
  "townhall",
  "invitation",
] as const;

export type AuditResourceType = (typeof auditResourceTypeEnum)[number];

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    townhallId: text("townhall_id").references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    action: text("action", { enum: auditActionEnum }).notNull(),
    resourceType: text("resource_type", { enum: auditResourceTypeEnum }).notNull(),
    resourceId: text("resource_id").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_townhallId_idx").on(table.townhallId),
    index("audit_log_userId_idx").on(table.userId),
    index("audit_log_action_idx").on(table.action),
    index("audit_log_resourceType_idx").on(table.resourceType),
    index("audit_log_resourceId_idx").on(table.resourceId),
    index("audit_log_timestamp_idx").on(table.timestamp),
  ],
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  townhall: one(organization, {
    fields: [auditLog.townhallId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
}));

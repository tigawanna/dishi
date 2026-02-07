import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

export const proposalStatusEnum = [
  "draft",
  "under_review",
  "voting",
  "passed",
  "rejected",
  "archived",
] as const;

export type ProposalStatus = (typeof proposalStatusEnum)[number];

export const proposal = pgTable(
  "proposal",
  {
    id: text("id").primaryKey(),
    townhallId: text("townhall_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status", { enum: proposalStatusEnum }).default("draft").notNull(),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at"),
    reviewNote: text("review_note"),
    votingStartedAt: timestamp("voting_started_at"),
    votingClosedAt: timestamp("voting_closed_at"),
    closedBy: text("closed_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("proposal_townhallId_idx").on(table.townhallId),
    index("proposal_authorId_idx").on(table.authorId),
    index("proposal_status_idx").on(table.status),
  ],
);

export const proposalRelations = relations(proposal, ({ one, many }) => ({
  townhall: one(organization, {
    fields: [proposal.townhallId],
    references: [organization.id],
  }),
  author: one(user, {
    fields: [proposal.authorId],
    references: [user.id],
    relationName: "authoredProposals",
  }),
  reviewer: one(user, {
    fields: [proposal.reviewedBy],
    references: [user.id],
    relationName: "reviewedProposals",
  }),
  closedByUser: one(user, {
    fields: [proposal.closedBy],
    references: [user.id],
    relationName: "closedProposals",
  }),
  votes: many(vote),
  comments: many(comment),
}));

export const voteChoiceEnum = ["yes", "no", "abstain"] as const;

export type VoteChoice = (typeof voteChoiceEnum)[number];

export const vote = pgTable(
  "vote",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposal.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    choice: text("choice", { enum: voteChoiceEnum }).notNull(),
    votedAt: timestamp("voted_at").defaultNow().notNull(),
  },
  (table) => [
    index("vote_proposalId_idx").on(table.proposalId),
    index("vote_userId_idx").on(table.userId),
    index("vote_proposalId_userId_idx").on(table.proposalId, table.userId),
  ],
);

export const voteRelations = relations(vote, ({ one }) => ({
  proposal: one(proposal, {
    fields: [vote.proposalId],
    references: [proposal.id],
  }),
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
}));

export const comment = pgTable(
  "comment",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposal.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("comment_proposalId_idx").on(table.proposalId),
    index("comment_userId_idx").on(table.userId),
  ],
);

export const commentRelations = relations(comment, ({ one }) => ({
  proposal: one(proposal, {
    fields: [comment.proposalId],
    references: [proposal.id],
  }),
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}));

# Townhall Governance Platform Database Schema

## Overview

Complete Drizzle ORM schema for a multi-tenant governance platform where communities can create **Townhalls** — independent democratic spaces.

## Schema Structure

### Multiple Schema Files

Following Drizzle best practices, schemas are organized by domain:

```
src/db/schema/
├── auth-schema.ts    # Better Auth tables (user, session, account, organization, member)
├── proposals.ts      # Governance: proposals, votes, comments
├── audit-log.ts      # Audit trail for all governance actions
└── index.ts          # Schema exports
```

## Tables

### Auth Tables (Better Auth Managed)

- **user** - User accounts with platform-level roles
- **session** - User sessions with impersonation support
- **account** - OAuth/credential accounts
- **verification** - Email/phone verification tokens
- **apikey** - API key authentication
- **organization** - Townhalls (governance containers)
- **member** - Townhall membership with roles (admin, council, citizen)
- **invitation** - Pending townhall invitations

### Governance Tables

#### proposal

Proposals submitted by citizens for council review and community voting.

| Column            | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| id                | text      | Primary key                                             |
| townhall_id       | text      | FK to organization                                      |
| author_id         | text      | FK to user (creator)                                    |
| title             | text      | Proposal title                                          |
| description       | text      | Full proposal text                                      |
| status            | enum      | draft, under_review, voting, passed, rejected, archived |
| reviewed_by       | text      | FK to user (council reviewer)                           |
| reviewed_at       | timestamp | When reviewed                                           |
| review_note       | text      | Council's review note                                   |
| voting_started_at | timestamp | When voting began                                       |
| voting_closed_at  | timestamp | When voting ended                                       |
| closed_by         | text      | FK to user (who closed voting)                          |
| created_at        | timestamp | Created timestamp                                       |
| updated_at        | timestamp | Updated timestamp                                       |

#### vote

Individual votes on proposals during voting stage.

| Column      | Type      | Description        |
| ----------- | --------- | ------------------ |
| id          | text      | Primary key        |
| proposal_id | text      | FK to proposal     |
| user_id     | text      | FK to user (voter) |
| choice      | enum      | yes, no, abstain   |
| voted_at    | timestamp | When vote was cast |

#### comment

Comments on proposals.

| Column      | Type      | Description            |
| ----------- | --------- | ---------------------- |
| id          | text      | Primary key            |
| proposal_id | text      | FK to proposal         |
| user_id     | text      | FK to user (commenter) |
| content     | text      | Comment text           |
| created_at  | timestamp | Created timestamp      |
| updated_at  | timestamp | Updated timestamp      |

#### audit_log

Immutable log of all governance actions for transparency.

| Column        | Type      | Description                                        |
| ------------- | --------- | -------------------------------------------------- |
| id            | text      | Primary key                                        |
| townhall_id   | text      | FK to organization (nullable for platform actions) |
| user_id       | text      | FK to user (actor)                                 |
| action        | enum      | Action type (proposal_created, vote_cast, etc.)    |
| resource_type | enum      | Type of resource affected                          |
| resource_id   | text      | ID of affected resource                            |
| metadata      | jsonb     | Additional context (old/new values, reasons)       |
| ip_address    | text      | Actor's IP                                         |
| user_agent    | text      | Actor's browser/client                             |
| timestamp     | timestamp | When action occurred                               |

## Role System

### Platform Level

- **platformAdmin** - Super admin, full system control

### Townhall Level (Organization-scoped)

- **admin** - Townhall administrator
- **council** - Review & approval authority
- **citizen** - Default member role

## Governance Workflow

```
┌─────────────┐
│   Citizen   │ creates proposal (status: draft)
│   drafts    │
└──────┬──────┘
       │
       │ submits for review (status: under_review)
       ▼
┌─────────────┐
│   Council   │ reviews proposal
│   review    │
└──────┬──────┘
       │
       ├─── approves ──→ ┌─────────────┐
       │                 │   Voting    │ (status: voting)
       │                 │   stage     │
       │                 └──────┬──────┘
       │                        │
       │                        │ all members vote
       │                        ▼
       │                 ┌─────────────┐
       │                 │   Passed/   │ (status: passed/rejected)
       │                 │  Rejected   │
       │                 └─────────────┘
       │
       └─── rejects ──→  (status: rejected)
```

## Relations

### User Relations

- `sessions` - User's active sessions
- `accounts` - OAuth/credential accounts
- `members` - Townhall memberships
- `authoredProposals` - Proposals created by user
- `reviewedProposals` - Proposals reviewed by user (council)
- `votes` - Votes cast by user
- `comments` - Comments made by user
- `auditLogs` - Actions performed by user

### Organization (Townhall) Relations

- `members` - All townhall members
- `invitations` - Pending invitations
- `proposals` - All proposals in townhall
- `auditLogs` - Audit trail for townhall

### Proposal Relations

- `townhall` - Parent organization
- `author` - User who created proposal
- `reviewer` - Council member who reviewed
- `votes` - All votes on proposal
- `comments` - All comments on proposal

## Indexes

Optimized indexes for common queries:

- `proposal_townhallId_idx` - Filter proposals by townhall
- `proposal_status_idx` - Filter by status
- `vote_proposalId_userId_idx` - Unique vote per user per proposal
- `audit_log_timestamp_idx` - Time-based audit queries
- `audit_log_townhallId_idx` - Filter audit by townhall

## Generate Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Push to database
pnpm drizzle-kit push

# Open Drizzle Studio
pnpm drizzle-kit studio
```

## Usage Example

```typescript
import { db } from "@backend/db/client";
import { proposal, vote, comment } from "@backend/db/schema";
import { eq } from "drizzle-orm";

// Query proposal with votes and comments
const proposalWithDetails = await db.query.proposal.findFirst({
  where: eq(proposal.id, proposalId),
  with: {
    author: true,
    votes: true,
    comments: {
      with: { user: true },
    },
  },
});

// Create new proposal
await db.insert(proposal).values({
  id: generateId(),
  townhallId: townhallId,
  authorId: userId,
  title: "Improve Park Lighting",
  description: "Proposal to install solar-powered lights...",
  status: "draft",
});
```

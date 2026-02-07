# Townhall Governance Platform Database Schema

## Overview

Complete Drizzle ORM schema for a multi-tenant governance platform where communities can create **Townhalls** — independent democratic spaces.

## Schema Structure

### Multiple Schema Files

Following Drizzle best practices, schemas are organized by domain:

```
src/schema/
├── auth-schema.ts    # Better Auth tables (user, session, account, organization, member)
├── proposals-schema.ts   # Governance: proposals, votes, comments
├── audit-log-schema.ts  # Audit trail for all governance actions
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

## Generate Migrations

From the api app (so .env is loaded):

```bash
pnpm --filter api db:gen
pnpm --filter api db:push
pnpm --filter api db:studio
```

## Usage Example

```typescript
import { createDb } from "@repo/db";
import { proposal, vote, comment } from "@repo/db";
import { eq } from "drizzle-orm";

const db = createDb(process.env.DATABASE_URL!);

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
```

# 🏛️ Final High-Level Design: Townhall Governance Platform

---

## 🎯 System Overview

A **multi-tenant governance platform** where communities can create **Townhalls** — independent democratic spaces where **Citizens** propose ideas, **Council Members** review and approve them, and the community votes on official proposals.

Each Townhall operates independently with its own membership, proposals, and voting records, while the data model supports multi-tenancy from day one.

---

## 🏢 Core Concepts

### Townhall (Organization/Container)

A **Townhall** is an independent governance space — think of it as a town, community, organization, or group that wants to make decisions democratically.

**Examples:**

- "Downtown Neighborhood Association"
- "Tech Startup Employee Council"
- "University Student Government"
- "Open Source Project Governance"

**Properties:**

- Has its own membership roster
- Has its own proposals and voting records
- Operates independently from other townhalls
- Can set its own rules and policies (future)

**v1 Behavior:** One default "Global Townhall" created on setup. All users join this townhall automatically. UI hides townhall selection entirely — users experience it as a single-tenant app.

**v2+ Behavior:** Platform Admins can create multiple townhalls. Users can join multiple townhalls. UI includes townhall switcher.

---

## 👥 Role Hierarchy

### Two-Layer Role System

```
┌─────────────────────────────────────────┐
│         Platform Level (Global)          │
│  Platform Admin - manages entire system  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  Townhall A    │    │  Townhall B     │
│  - Admin       │    │  - Admin        │
│  - Council     │    │  - Council      │
│  - Citizen     │    │  - Citizen      │
└────────────────┘    └─────────────────┘
```

### Platform Level

**Platform Admin** (Super Admin)

- **Who:** You, the system creator/owner
- **Powers:**
  - Create and delete townhalls
  - Manage users across all townhalls
  - View all data and audit logs
  - Override any townhall-level decision (emergency only)
  - Configure platform-wide settings
- **v1 Status:** Just you. Hardcoded or first registered user.
- **Access:** Global admin panel at `/admin`

---

### Townhall Level (Organization Roles)

These roles are **scoped to each townhall**. A user can be Council in Townhall A and Citizen in Townhall B.

#### **Admin** (Townhall Administrator)

- **Who:** Townhall creator by default, or appointed by Platform Admin
- **Powers:**
  - Manage townhall members (invite, remove)
  - Assign and revoke roles (promote Citizen → Council, etc.)
  - Archive old proposals
  - View full audit log for their townhall
  - Configure townhall settings (name, description, rules)
  - **Cannot:** Delete the townhall itself (only Platform Admin can)
- **Use Case:** Mayor, community leader, project maintainer
- **Access:** Townhall admin panel at `/townhall/:id/admin`

#### **Council** (Review & Approval Authority)

- **Who:** Trusted members appointed by Admin
- **Powers:**
  - Review proposals submitted by Citizens
  - Approve proposals to move them to voting stage
  - Reject proposals with reason
  - Comment on any proposal
  - View their own audit trail
  - **Cannot:** Manage members, assign roles, or archive proposals
- **Use Case:** Elected representatives, moderators, board members, maintainers
- **Democracy Flow:** Council acts as a **legitimacy filter** — they ensure proposals are well-formed, not spam, and ready for community vote

#### **Citizen** (Default Member Role)

- **Who:** Everyone who joins a townhall (default role)
- **Powers:**
  - Create proposal drafts
  - Submit their own proposals for Council review
  - Vote on proposals in the voting stage
  - Comment on any proposal
  - View their own activity
  - **Cannot:** Approve proposals, manage members, or see audit logs
- **Use Case:** Community members, employees, students, contributors
- **Democracy Flow:** Citizens are the **electorate** — they propose ideas and decide outcomes through voting

---

## 🔄 Governance Workflow (How Democracy Works)

```
┌─────────────┐
│   Citizen   │ creates proposal
│   drafts    │
└──────┬──────┘
       │
       │ submits for review
       ▼
┌─────────────┐
│   Council   │ reviews proposal
│   review    │
└──────┬──────┘
       │
       ├─── approves ──→ ┌─────────────┐
       │                 │   Voting    │
       │                 │   stage     │
       │                 └──────┬──────┘
       │                        │
       │                        │ all members vote
       │                        ▼
       │                 ┌─────────────┐
       │                 │   Passed/   │
       │                 │  Rejected   │
       │                 └─────────────┘
       │
       └─── rejects ──→  [Proposal stays rejected]
```

### Stage-by-Stage Flow

**1. Draft**

- Citizen creates proposal
- Private to author initially
- Can edit freely
- **Action:** Submit for review

**2. Under Review**

- Council members can see it
- Council discusses and evaluates
- **Actions:**
  - Council approves → moves to Voting
  - Council rejects → proposal marked rejected with reason

**3. Voting** (if approved by Council)

- All townhall members can vote (Yes/No/Abstain)
- Vote is public and transparent
- **v1:** Admin manually closes vote and certifies result
- **v2:** Auto-closes after X days with quorum rules

**4. Passed/Rejected**

- Result is final and recorded
- Visible to all members
- **v2:** Can trigger automated actions (like policy changes)

**5. Archived**

- Admin cleans up old proposals
- Historical record preserved
- Read-only

---

## 🔐 Permission Matrix (Detailed)

| Action              | Citizen         | Council         | Admin           | Platform Admin   |
| ------------------- | --------------- | --------------- | --------------- | ---------------- |
| **Proposals**       |
| Create draft        | ✅              | ✅              | ✅              | ✅               |
| Edit own draft      | ✅              | ✅              | ✅              | ✅               |
| Submit for review   | ✅ own only     | ✅ own only     | ✅              | ✅               |
| View under review   | ❌              | ✅              | ✅              | ✅               |
| Approve proposal    | ❌              | ✅              | ✅              | ✅               |
| Reject proposal     | ❌              | ✅              | ✅              | ✅               |
| View all proposals  | ✅ public only  | ✅ all          | ✅ all          | ✅ all townhalls |
| Archive proposal    | ❌              | ❌              | ✅              | ✅               |
| **Voting**          |
| Vote on proposal    | ✅ voting stage | ✅ voting stage | ✅ voting stage | ✅               |
| View vote results   | ✅ after close  | ✅ real-time    | ✅ real-time    | ✅               |
| Close voting        | ❌              | ❌              | ✅              | ✅               |
| **Comments**        |
| Comment on proposal | ✅              | ✅              | ✅              | ✅               |
| Delete own comment  | ✅              | ✅              | ✅              | ✅               |
| Delete any comment  | ❌              | ❌              | ✅              | ✅               |
| **Members**         |
| View member list    | ✅              | ✅              | ✅              | ✅               |
| Invite members      | ❌              | ❌              | ✅              | ✅               |
| Remove members      | ❌              | ❌              | ✅              | ✅               |
| Assign roles        | ❌              | ❌              | ✅              | ✅               |
| **Townhalls**       |
| Create townhall     | ❌              | ❌              | ❌              | ✅               |
| Edit townhall       | ❌              | ❌              | ✅ own only     | ✅ all           |
| Delete townhall     | ❌              | ❌              | ❌              | ✅               |
| **Audit**           |
| View audit log      | ❌              | ✅ own actions  | ✅ townhall     | ✅ all           |

---

## 🎨 v1 User Experience: "Single Townhall Mode"

### What Users See

- Landing page: "Join the Townhall"
- Registration creates account + auto-joins default townhall as Citizen
- Dashboard shows: Active proposals, your drafts, recent votes
- No townhall selector visible anywhere
- No "create townhall" button (even for admins)

### What's Happening Behind the Scenes

- Database has `townhalls` table with one record: "Global Townhall"
- Every proposal has `townhall_id` field (always points to default townhall)
- Every user has a record in `townhall_members` (all point to default townhall)
- All queries filter by townhall_id, but it's hardcoded to the default

### Why This Matters

- **Day 1:** Users experience a clean, focused single-community app
- **Day 30:** You flip a switch and suddenly support multiple townhalls
- **Zero data migration needed** — the structure was always there

---

## 🚀 v2 Evolution: "True Multi-Tenant Mode"

### New UI Elements

- **Townhall Switcher:** Dropdown in nav bar
- **Create Townhall:** Button for Platform Admin
- **Join Townhall:** Users can request to join or be invited
- **Townhall Directory:** Browse public townhalls

### New Behaviors

- User can be in multiple townhalls simultaneously
- Each townhall has independent proposals/votes
- User sees different role badge per townhall
- Cross-townhall analytics for Platform Admin

### Example: Multi-Townhall User Journey

```
Alice joins platform
  → Auto-joins "Global Townhall" as Citizen
  → Creates proposal about park renovation

Alice gets invited to "Tech Company Employee Council"
  → Joins as Citizen
  → Promoted to Council by that townhall's Admin
  → Now Alice is:
      - Citizen in Global Townhall
      - Council in Tech Company Townhall
```

---

## 📊 Data Model Summary

### Core Tables

```
users (Better Auth managed)
├── id
├── email
├── email_verified
└── created_at

townhalls (organizations better auth managed)
├── id
├── name ("Downtown Neighborhood")
├── slug ("downtown-neighborhood")
├── created_by (user_id)
└── created_at

townhall_members (organization_members, better auth managed)
├── id
├── user_id
├── townhall_id
├── role (admin | council | citizen)
└── joined_at

proposals
├── id
├── townhall_id ← scoped to townhall
├── author_id
├── title
├── description
├── status (draft | under_review | voting | passed | rejected | archived)
├── reviewed_by (council user_id)
├── reviewed_at
└── created_at

votes
├── id
├── proposal_id
├── user_id
├── vote (yes | no | abstain)
└── voted_at

comments
├── id
├── proposal_id
├── user_id
├── content
└── created_at

audit_log
├── id
├── townhall_id ← scoped to townhall
├── user_id
├── action (created_proposal | approved_proposal | voted | etc)
├── resource_type
├── resource_id
├── metadata (JSON)
└── timestamp
```

**Key Principle:** Everything belongs to a townhall. Nothing is global except users and platform admin actions.

## 🏗️ Tech-Agnostic Implementation Notes

### Permission Check Pattern (Pseudocode)

```
function can(user, action, resource, townhallId):
  // Layer 1: Platform admin bypass
  if user.isPlatformAdmin:
    return true

  // Layer 2: Get townhall role
  membership = getTownhallMembership(user.id, townhallId)
  if not membership:
    return false  // Not a member

  role = membership.role

  // Layer 3: Role-based rules
  if role == 'admin':
    return true  // Townhall admin can do most things

  if role == 'council':
    if action in ['approve_proposal', 'reject_proposal']:
      return resource.status == 'under_review'
    // ... other council rules

  if role == 'citizen':
    if action == 'submit_for_review':
      return resource.author_id == user.id
    if action == 'vote':
      return resource.status == 'voting'
    // ... other citizen rules

  return false
```

## 📝 Naming Rationale

### Why "Townhall"?

- ✅ Universally understood (town hall meetings)
- ✅ Implies open, democratic discussion
- ✅ Not tech jargon (vs "org", "workspace", "team")
- ✅ Warm, community-focused
- ✅ Scales well ("Join the townhall" feels welcoming)

### Why "Council"?

- ✅ Clear authority signal (legislative body)
- ✅ Familiar from city councils, student councils
- ✅ Implies elected or appointed trust
- ✅ No confusion with container name

### Why "Citizen"?

- ✅ Default role feels inclusive
- ✅ Implies rights and participation
- ✅ Familiar from governance contexts
- ✅ Better than "member" or "user"

### Why "Admin"?

- ✅ Clear scope (townhall-level, not platform)
- ✅ Standard terminology
- ✅ Self-explanatory

---

## ✅ Final Architecture Checklist

- [x] **Townhalls** as independent containers (multi-tenant ready)
- [x] **Three roles**: Citizen (default), Council (approver), Admin (manager)
- [x] **Platform Admin** layer above townhalls
- [x] **v1 hides** multi-tenancy (one default townhall)
- [x] **v2 reveals** multi-tenancy (create/join townhalls)
- [x] **Better Auth** handles users, sessions, org structure
- [x] **You build** governance workflow and permission logic
- [x] **Clean upgrade path** from single to multi-tenant

---

This is your high-level design. Clean, understandable, impressive, and buildable in 2-4 weeks.

Ready to drill into implementation details, or does this capture the vision?

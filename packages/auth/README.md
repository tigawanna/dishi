# @repo/auth

Shared authentication package for Dishi, built on [Better Auth](https://better-auth.com).

## Package exports

| Entry point        | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `@repo/auth/roles` | Access control (`ac`), `roles`, `BetterAuthUserRoles`, `BetterAuthOrgRoles` |
| `@repo/auth/server`| `createAuth()` factory and `Auth` type (server-side only)                |
| `@repo/auth/client`| `createBetterAuthClient()` factory, re-exported types, `userRoles`       |

## Plugins enabled

| Plugin         | Purpose                            |
| -------------- | ---------------------------------- |
| `emailAndPassword` | Email/password credential login |
| `apiKey`       | API key authentication             |
| `bearer`       | Bearer token support               |
| `openAPI`      | OpenAPI schema generation          |
| `admin`        | Platform-level RBAC via `ac`/`roles` |
| `organization` | Multi-tenant kitchen organizations |

## Roles

**Platform roles** (assigned to `user.role`):

- `platformAdmin` -- full access to all resources
- `customer` -- read kitchens/menus/cuisines, manage own favorites & saved locations

**Organization roles** (assigned to `member.role`):

- `owner` -- kitchen owner, full control of their organization
- `staff` -- kitchen staff, limited operational access

## Better Auth schema generation

Better Auth manages its own database tables (`user`, `session`, `account`, `verification`, `apikey`, `organization`, `member`, `invitation`). When you add or change Better Auth plugins, you need to regenerate the schema file and run a migration.

All commands below are run from the **repository root** using `pnpm --filter`.

### 1. Generate the auth schema

```bash
pnpm --filter @repo/auth gen:schema
```

This regenerates `auth-schema.ts` based on the plugins configured in `createAuth()`. Review the diff before committing -- do not add Drizzle v1 `relations()` exports; those are handled separately in `packages/db/src/relations.ts` using Drizzle v2.

### 2. Generate a Drizzle migration

```bash
pnpm --filter @repo/db db:gen
```

### 3. Apply the migration

```bash
pnpm --filter @repo/db db:migrate
```

### Full chain (generate schema + migration + apply)

```bash
pnpm --filter @repo/auth gen:schema && pnpm --filter @repo/db db:gen && pnpm --filter @repo/db db:migrate
```

### Push without migration (development only)

To push schema changes directly to the database without creating migration files:

```bash
pnpm --filter @repo/db db:push
```

### Open Drizzle Studio

```bash
pnpm --filter @repo/db db:studio
```

## Adding a new Better Auth plugin

1. Install the plugin (if separate package) in `packages/auth`.
2. Add the server plugin to `createAuth()` in `src/server.ts`.
3. Add the corresponding client plugin to `createBetterAuthClient()` in `src/client.ts`.
4. Regenerate the auth schema and run a migration:
   ```bash
   pnpm --filter @repo/auth gen:schema && pnpm --filter @repo/db db:gen && pnpm --filter @repo/db db:migrate
   ```
5. If the plugin introduces new permissions, update the `statement` and `roles` in `src/roles.ts`.

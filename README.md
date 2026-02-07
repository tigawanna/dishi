# Dishi

Hyperlocal food discovery platform -- a pnpm + Turborepo monorepo.

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL with **PostGIS** and **pgvector** extensions

## Getting started

```bash
pnpm install
```

Copy the environment file in each app that needs one and fill in the values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/client/.env.example apps/client/.env
```

## Monorepo structure

```
apps/
  api/          Elysia.js backend API
  client/       TanStack React SPA (admin dashboard)
  site/         TanStack Start SSR site (public-facing)

packages/
  auth/         Better Auth server & client factories, roles/permissions
  db/           Drizzle ORM schema, migrations, relations, helpers
  isomorphic/   Shared TypeScript types and utilities
  ui/           Shared UI components
  typescript-config/  Shared tsconfig presets
```

## Development

```bash
# Start everything
pnpm dev

# Start a specific app
pnpm --filter api dev
pnpm --filter client dev
pnpm --filter site dev
```

## Database

All database commands target `@repo/db` (`packages/db`).

```bash
# Generate a Drizzle migration from schema changes
pnpm --filter @repo/db db:gen

# Apply pending migrations
pnpm --filter @repo/db db:migrate

# Push schema directly (development only, no migration files)
pnpm --filter @repo/db db:push

# Open Drizzle Studio
pnpm --filter @repo/db db:studio
```

See [`packages/db/SCHEMA.md`](packages/db/SCHEMA.md) for schema documentation and design decisions.

## Authentication (Better Auth)

Auth configuration lives in `@repo/auth` (`packages/auth`).

```bash
# Regenerate the Better Auth schema after adding/changing plugins
pnpm --filter @repo/auth gen:schema
```

After regenerating, create and apply a migration:

```bash
pnpm --filter @repo/db db:gen && pnpm --filter @repo/db db:migrate
```

Full chain (schema + migration + apply) in one line:

```bash
pnpm --filter @repo/auth gen:schema && pnpm --filter @repo/db db:gen && pnpm --filter @repo/db db:migrate
```

See [`packages/auth/README.md`](packages/auth/README.md) for details on roles, plugins, and adding new auth plugins.

## Build

```bash
# Build everything
pnpm build

# Build a specific app/package
pnpm --filter api build
pnpm --filter @repo/db build
```

## Type checking

```bash
# Check types across the whole repo
pnpm check-types

# Check a specific package
pnpm --filter @repo/auth check-types
pnpm --filter @repo/db check-types
```

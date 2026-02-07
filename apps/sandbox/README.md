# Sandbox

Test app for **Drizzle v1 + relations v2** with Better Auth, using the approach from [better-auth#6766](https://github.com/better-auth/better-auth/issues/6766#issuecomment-3704724493).

## Setup

```bash
pnpm install
cp .env.example .env
```

## Regenerate schema (CLI from PR 6913)

```bash
pnpm db:generate
```

## Run

```bash
pnpm dev
```

## Approach

- **Drizzle v1 beta** with `defineRelations` (relations v2 API)
- **@better-auth/drizzle-adapter/relations-v2** from PR 6913
- **Better Auth CLI** from PR 6913 for schema generation
- **@libsql/client** (pure JS, no native build) for SQLite
- Schema and relations passed to both drizzle and the adapter

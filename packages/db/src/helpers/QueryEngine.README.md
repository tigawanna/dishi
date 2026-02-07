# QueryEngine

A generic query engine for Drizzle ORM that provides type-safe pagination, search, and CRUD operations for PostgreSQL tables.

## Features

- **Offset-based pagination** (`listPaged`) - Traditional page/perPage pagination
- **Cursor-based pagination** (`listInfinite`) - For infinite scroll / "load more" patterns
- **Search** - Case-insensitive search across multiple columns
- **Optional where clauses** - Filter with `and`/`or` conditions
- **CRUD operations** - `getOne`, `create`, `update`, `delete`, `count`

## Usage

### Basic Setup

```typescript
import { createDb } from "@repo/db";
import { createSimpleQueryEngine } from "@repo/db";
import { user } from "@repo/db";

const db = createDb(process.env.DATABASE_URL!);
const userQueryEngine = createSimpleQueryEngine(db, user);
```

### Offset-Based Pagination (`listPaged`)

```typescript
const result = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
  searchTerm: "john",
  searchOn: ["name", "email"],
});
```

### Cursor-Based Pagination (`listInfinite`)

Requires the table to have `createdAt` and `id` columns.

```typescript
const result = await userQueryEngine.listInfinite({
  limit: 20,
  sortOrder: "desc",
  cursor: result.nextCursor,
});
```

### CRUD Operations

```typescript
const user = await userQueryEngine.getOne("user-id-123");
const newUser = await userQueryEngine.create({ name: "John", email: "john@example.com" });
const updatedUser = await userQueryEngine.update("user-id-123", { name: "Jane" });
const deletedUser = await userQueryEngine.delete("user-id-123");
const totalUsers = await userQueryEngine.count();
```

### Zod Schema for Query Params

```typescript
import { listQueryParamsSchema } from "@repo/db";

app.get("/users", ({ query }) => {
  const params = listQueryParamsSchema.parse(query);
  return userQueryEngine.listPaged(params);
});
```

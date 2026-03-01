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
import { createSimpleQueryEngine } from "@backend/db/helpers/QueryEngine";
import { usersTable } from "@backend/db/schema/users";

const userQueryEngine = createSimpleQueryEngine(usersTable);
```

### Offset-Based Pagination (`listPaged`)

Best for traditional pagination with page numbers.

```typescript
// Basic pagination
const result = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
});

// With sorting
const result = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
});

// With search
const result = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  searchTerm: "john",
  searchOn: ["name", "email"],
});
```

**Response shape:**

```typescript
{
  items: User[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  status: "success";
}
```

### Cursor-Based Pagination (`listInfinite`)

Best for infinite scroll or "load more" patterns. Requires the table to have `createdAt` and `id` columns.

```typescript
// Initial load
const result = await userQueryEngine.listInfinite({
  limit: 20,
  sortOrder: "desc",
});

// Load more (using cursor from previous response)
const nextResult = await userQueryEngine.listInfinite({
  cursor: result.nextCursor,
  limit: 20,
  sortOrder: "desc",
});

// With search
const result = await userQueryEngine.listInfinite({
  limit: 20,
  searchTerm: "john",
  searchOn: ["name", "email"],
});
```

**Response shape:**

```typescript
{
  items: User[];
  nextCursor?: string;
  hasNextPage: boolean;
}
```

### Optional Where Clauses

Both `listPaged` and `listInfinite` support optional where clauses that can be combined with `and` or `or` operators.

```typescript
import { eq, gt, lt, isNull } from "drizzle-orm";

// Using 'and' - all conditions must match
const activeAdults = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  where: {
    conditions: [eq(usersTable.status, "active"), gt(usersTable.age, 18)],
    operator: "and",
  },
});

// Using 'or' - any condition can match
const adminsOrModerators = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  where: {
    conditions: [eq(usersTable.role, "admin"), eq(usersTable.role, "moderator")],
    operator: "or",
  },
});

// Combined with search
const activeUsersSearch = await userQueryEngine.listInfinite({
  limit: 20,
  searchTerm: "john",
  searchOn: ["name", "email"],
  where: {
    conditions: [eq(usersTable.status, "active")],
    operator: "and",
  },
});

// With nullable checks
const usersWithoutAvatar = await userQueryEngine.listPaged({
  page: 1,
  perPage: 20,
  where: {
    conditions: [isNull(usersTable.avatarUrl)],
    operator: "and",
  },
});
```

### CRUD Operations

```typescript
// Get single record by ID
const user = await userQueryEngine.getOne("user-id-123");

// Create a new record
const newUser = await userQueryEngine.create({
  name: "John Doe",
  email: "john@example.com",
});

// Update a record
const updatedUser = await userQueryEngine.update("user-id-123", {
  name: "Jane Doe",
});

// Delete a record
const deletedUser = await userQueryEngine.delete("user-id-123");

// Count all records
const totalUsers = await userQueryEngine.count();
```

## Type Safety

The query engine infers types from your Drizzle table schema:

```typescript
const engine = createSimpleQueryEngine(usersTable);

// TSelect is inferred as typeof usersTable.$inferSelect
// TInsert is inferred as typeof usersTable.$inferInsert

// sortBy and searchOn are type-safe column names
engine.listPaged({
  sortBy: "createdAt", // ✅ Valid column
  sortBy: "invalidColumn", // ❌ TypeScript error
  searchOn: ["name", "email"], // ✅ Valid columns
});
```

## Zod Schema for Query Params

Use the exported schema for validating query parameters:

```typescript
import { listQueryParamsSchema } from "@backend/db/helpers/QueryEngine";

// In your Elysia route
app.get("/users", ({ query }) => {
  const params = listQueryParamsSchema.parse(query);
  return userQueryEngine.listPaged(params);
});
```

## Pagination Utilities

Reusable utility functions for building paginated responses in other parts of your application:

```typescript
import {
  calculateOffset,
  calculateTotalPages,
  buildPaginatedResponse,
} from "@backend/db/helpers/QueryEngine";

// Calculate database offset from page number
const offset = calculateOffset(page, perPage);
// offset = (page - 1) * perPage

// Calculate total pages from item count
const totalPages = calculateTotalPages(totalItems, perPage);
// totalPages = Math.ceil(totalItems / perPage)

// Build a complete paginated response object
const response = buildPaginatedResponse({
  items: myItems,
  page: 1,
  perPage: 20,
  totalItems: 150,
});
// Returns: { items, page, perPage, totalItems, totalPages, status: "success" }
```

**Example: Custom pagination logic**

```typescript
import { db } from "@backend/db/client";
import { calculateOffset, buildPaginatedResponse } from "@backend/db/helpers/QueryEngine";

async function getCustomPaginatedData(page: number, perPage: number) {
  const offset = calculateOffset(page, perPage);

  // Custom query logic
  const items = await db.query.posts.findMany({
    limit: perPage,
    offset: offset,
    with: { author: true, comments: true },
  });

  const [{ count: totalItems }] = await db.select({ count: count() }).from(posts);

  return buildPaginatedResponse({
    items,
    page,
    perPage,
    totalItems,
  });
}
```

## WhereClause Interface

```typescript
interface WhereClause {
  /** Array of SQL conditions to apply */
  conditions: (SQL | undefined)[];
  /** How to combine the conditions - 'and' (all must match) or 'or' (any can match) */
  operator: "and" | "or";
}
```

## Notes

- The `listInfinite` method requires your table to have both `createdAt` and `id` columns
- Search uses case-insensitive `ILIKE` matching with wildcards (`%searchTerm%`)
- Where clauses are combined with search conditions using `AND`
- Undefined conditions in the `where.conditions` array are automatically filtered out

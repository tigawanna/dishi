# Dishi - Technical Architecture

## Overview

This document outlines the high-level technical architecture for Dishi, adapting the existing monorepo boilerplate (originally for a community governance app) to a hyperlocal food discovery platform.

---

## Tech Stack

### Frontend (apps/client → apps/web)
- **TanStack Start** - Full-stack React framework with SSR/SSG
- **TanStack Router** - Type-safe routing with file-based routes
- **TailwindCSS + shadcn/ui** - Styling and components
- **SSR for discoverable pages** (kitchen profiles, menus) - SEO critical
- **SSG for static content** (landing, about, terms)

### Backend (apps/api)
- **Elysia.js** - Fast Bun-native API framework (existing)
- **Better Auth** - Authentication with plugins
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** with extensions:
  - **PostGIS** - Geospatial queries (nearby kitchens, delivery radius)
  - **pg_vector** - Vector embeddings for semantic search (future: dish recommendations)

### Shared (packages/)
- **@repo/isomorphic** - Shared types, roles, utilities
- **@repo/ui** - Shared UI components
- **@repo/typescript-config** - Shared TS configs

---

## Authentication & Authorization

### Better Auth Plugins (Retained)

| Plugin | Purpose in Dishi |
|--------|------------------|
| `admin` | Platform admin management, user bans, impersonation |
| `organization` | Kitchen as an organization (multi-member support) |
| `apiKey` | Future: kitchen integrations, third-party access |
| `bearer` | API authentication |
| `openAPI` | Auto-generated API docs |

### Role System

Better Auth manages two role contexts:
1. **Platform Roles** (global, on `user.role`) - Who you are on the platform
2. **Kitchen Roles** (scoped, on `member.role`) - Your role within a specific kitchen

---

## Platform Roles (Global)

| Role | Description | Permissions |
|------|-------------|-------------|
| `platformAdmin` | Super admin, manages entire system | Full access: ban users, delete kitchens, impersonate, view all data |
| `customer` | Default role for app users | Browse kitchens, view menus, save favorites, contact kitchens |

```
user.role: "platformAdmin" | "customer"
```

---

## Kitchen Roles (Organization-Scoped)

Kitchens use Better Auth's organization plugin. Each kitchen is an "organization" with members who have specific roles.

### Phase 1: Simple Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `owner` | Kitchen owner (auto-assigned on creation) | Full kitchen management: edit profile, menu, members, settings |
| `staff` | General staff member | Edit menu, update availability, view orders (future) |

### Phase 2: Expanded Roles (When Demand Requires)

| Role | Description | Permissions |
|------|-------------|-------------|
| `owner` | Kitchen owner | Full access + delete kitchen, manage billing |
| `manager` | Day-to-day operations manager | Edit profile, menu, manage staff, view analytics |
| `frontDesk` | Receives and approves orders | View incoming orders, accept/reject, update status |
| `cook` | Kitchen staff preparing food | View accepted orders, mark as preparing/ready |
| `delivery` | Handles deliveries (if self-delivery) | View ready orders, mark as out/delivered |

```
member.role: "owner" | "staff"  // Phase 1
member.role: "owner" | "manager" | "frontDesk" | "cook" | "delivery"  // Phase 2
```

---

## Database Schema

### Tables Managed by Better Auth (Do Not Modify)

These tables are auto-generated and managed by Better Auth:

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth/credential accounts
- `verification` - Email/phone verification tokens
- `apikey` - API keys
- `organization` - Kitchens (we alias this conceptually)
- `member` - Kitchen staff memberships
- `invitation` - Kitchen staff invitations

### Application Tables (Dishi-Specific)

#### Core Kitchen Tables

```
┌─────────────────────────────────────────────────────────────────┐
│ kitchen_profile                                                 │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK (same as organization.id)               │
│ organization_id TEXT FK → organization.id                       │
│ description     TEXT                                            │
│ phone           TEXT (WhatsApp number)                          │
│ location        GEOGRAPHY(POINT, 4326) [PostGIS]                │
│ address         TEXT                                            │
│ neighborhood    TEXT                                            │
│ delivery_radius_km  DECIMAL (e.g., 2.0 for 2km)                 │
│ is_open         BOOLEAN                                         │
│ opens_at        TIME                                            │
│ closes_at       TIME                                            │
│ operating_days  TEXT[] (e.g., ['mon','tue','wed'])              │
│ cover_image     TEXT (URL)                                      │
│ created_at      TIMESTAMP                                       │
│ updated_at      TIMESTAMP                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ cuisine_type                                                    │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ name            TEXT UNIQUE (e.g., "Swahili", "Indian", etc.)   │
│ slug            TEXT UNIQUE                                     │
│ icon            TEXT                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ kitchen_cuisine (junction)                                      │
├─────────────────────────────────────────────────────────────────┤
│ kitchen_id      TEXT FK → kitchen_profile.id                    │
│ cuisine_id      TEXT FK → cuisine_type.id                       │
│ PRIMARY KEY (kitchen_id, cuisine_id)                            │
└─────────────────────────────────────────────────────────────────┘
```

#### Menu Tables

```
┌─────────────────────────────────────────────────────────────────┐
│ menu_category                                                   │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ kitchen_id      TEXT FK → kitchen_profile.id                    │
│ name            TEXT (e.g., "Main Dishes", "Drinks", "Snacks")  │
│ sort_order      INTEGER                                         │
│ created_at      TIMESTAMP                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ menu_item                                                       │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ kitchen_id      TEXT FK → kitchen_profile.id                    │
│ category_id     TEXT FK → menu_category.id (nullable)           │
│ name            TEXT                                            │
│ description     TEXT                                            │
│ price           DECIMAL                                         │
│ image           TEXT (URL)                                      │
│ is_available    BOOLEAN                                         │
│ is_daily_special BOOLEAN                                        │
│ serving_size    TEXT (e.g., "1 plate", "500ml")                 │
│ preparation_time_mins INTEGER                                   │
│ dietary_tags    TEXT[] (e.g., ['vegetarian', 'halal'])          │
│ embedding       VECTOR(1536) [pg_vector] (for semantic search)  │
│ sort_order      INTEGER                                         │
│ created_at      TIMESTAMP                                       │
│ updated_at      TIMESTAMP                                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Customer Engagement Tables

```
┌─────────────────────────────────────────────────────────────────┐
│ customer_favorite                                               │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ user_id         TEXT FK → user.id                               │
│ kitchen_id      TEXT FK → kitchen_profile.id                    │
│ created_at      TIMESTAMP                                       │
│ UNIQUE (user_id, kitchen_id)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ customer_location                                               │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ user_id         TEXT FK → user.id                               │
│ label           TEXT (e.g., "Home", "Work")                     │
│ location        GEOGRAPHY(POINT, 4326) [PostGIS]                │
│ address         TEXT                                            │
│ neighborhood    TEXT                                            │
│ is_default      BOOLEAN                                         │
│ created_at      TIMESTAMP                                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Future: Order Tables (Phase 2+)

```
┌─────────────────────────────────────────────────────────────────┐
│ order                                                           │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ kitchen_id      TEXT FK → kitchen_profile.id                    │
│ customer_id     TEXT FK → user.id                               │
│ status          ENUM: pending, accepted, preparing,             │
│                       ready, out_for_delivery, delivered,       │
│                       cancelled                                 │
│ delivery_type   ENUM: pickup, delivery                          │
│ delivery_address TEXT                                           │
│ delivery_location GEOGRAPHY(POINT, 4326)                        │
│ subtotal        DECIMAL                                         │
│ delivery_fee    DECIMAL                                         │
│ total           DECIMAL                                         │
│ notes           TEXT                                            │
│ accepted_by     TEXT FK → user.id (staff member)                │
│ accepted_at     TIMESTAMP                                       │
│ prepared_by     TEXT FK → user.id                               │
│ ready_at        TIMESTAMP                                       │
│ delivered_at    TIMESTAMP                                       │
│ created_at      TIMESTAMP                                       │
│ updated_at      TIMESTAMP                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ order_item                                                      │
├─────────────────────────────────────────────────────────────────┤
│ id              TEXT PK                                         │
│ order_id        TEXT FK → order.id                              │
│ menu_item_id    TEXT FK → menu_item.id                          │
│ quantity        INTEGER                                         │
│ unit_price      DECIMAL (snapshot at order time)                │
│ notes           TEXT (special instructions)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Queries (PostGIS Examples)

### Find Kitchens Near a Location

```sql
SELECT k.*, 
       ST_Distance(k.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) as distance_m
FROM kitchen_profile k
WHERE k.is_open = true
  AND ST_DWithin(
    k.location, 
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
    :radius_meters
  )
ORDER BY distance_m;
```

### Check if Customer is Within Delivery Radius

```sql
SELECT EXISTS(
  SELECT 1 FROM kitchen_profile k
  WHERE k.id = :kitchen_id
    AND ST_DWithin(
      k.location,
      ST_SetSRID(ST_MakePoint(:customer_lng, :customer_lat), 4326),
      k.delivery_radius_km * 1000  -- convert km to meters
    )
);
```

---

## API Structure

### Public Routes (No Auth Required)
- `GET /kitchens` - List kitchens (with location filter)
- `GET /kitchens/:slug` - Kitchen profile + menu (SSR-friendly)
- `GET /kitchens/:slug/menu` - Full menu
- `GET /cuisines` - List cuisine types

### Customer Routes (Auth Required)
- `GET /me/favorites` - Customer's saved kitchens
- `POST /me/favorites/:kitchenId` - Save a kitchen
- `DELETE /me/favorites/:kitchenId` - Remove from favorites
- `GET /me/locations` - Customer's saved addresses
- `POST /me/locations` - Add address
- `PUT /me/locations/:id` - Update address
- `DELETE /me/locations/:id` - Delete address

### Kitchen Owner Routes (Auth + Kitchen Role Required)
- `POST /kitchens` - Create kitchen
- `PUT /kitchens/:id` - Update kitchen profile
- `PUT /kitchens/:id/availability` - Toggle open/closed
- `GET /kitchens/:id/menu` - Get menu (owner view)
- `POST /kitchens/:id/menu/categories` - Add category
- `POST /kitchens/:id/menu/items` - Add menu item
- `PUT /kitchens/:id/menu/items/:itemId` - Update item
- `DELETE /kitchens/:id/menu/items/:itemId` - Remove item
- `PUT /kitchens/:id/menu/items/:itemId/availability` - Toggle item availability

### Admin Routes (Platform Admin Only)
- `GET /admin/kitchens` - List all kitchens
- `PUT /admin/kitchens/:id/verify` - Verify a kitchen
- `PUT /admin/kitchens/:id/suspend` - Suspend a kitchen
- `GET /admin/users` - List users
- `PUT /admin/users/:id/ban` - Ban a user

---

## Frontend Routes (TanStack Start)

### Public (SSR/SSG)
- `/` - Landing page (SSG)
- `/explore` - Kitchen discovery feed (SSR)
- `/kitchen/:slug` - Kitchen profile + menu (SSR, SEO critical)
- `/about`, `/terms`, `/privacy` - Static pages (SSG)

### Customer (Protected)
- `/favorites` - Saved kitchens
- `/settings` - Account settings
- `/settings/addresses` - Manage delivery addresses

### Kitchen Dashboard (Protected + Kitchen Role)
- `/dashboard` - Kitchen overview
- `/dashboard/menu` - Menu management
- `/dashboard/settings` - Kitchen settings
- `/dashboard/team` - Team/staff management

### Admin (Protected + Platform Admin)
- `/admin` - Admin dashboard
- `/admin/kitchens` - Manage kitchens
- `/admin/users` - Manage users

---

## Backend Patterns & Infrastructure

This section defines patterns to keep the codebase maintainable as it grows, along with pluggable infrastructure layers.

### Module Organization (Controller-Service-Repository)

Each domain module follows a consistent structure:

```
src/
├── modules/
│   ├── kitchens/
│   │   ├── index.ts              # Routes (Controller layer)
│   │   ├── kitchen.service.ts    # Business logic
│   │   ├── kitchen.repository.ts # Data access (Drizzle queries)
│   │   ├── kitchen.dto.ts        # Request/Response schemas (Zod)
│   │   └── kitchen.types.ts      # TypeScript types
│   ├── menus/
│   │   ├── index.ts
│   │   ├── menu.service.ts
│   │   ├── menu.repository.ts
│   │   └── menu.dto.ts
│   ├── customers/
│   │   └── ...
│   └── all.ts                    # Module aggregator
├── infrastructure/
│   ├── logger/
│   │   ├── index.ts              # Logger factory
│   │   ├── logger.interface.ts   # Logger contract
│   │   ├── pino-logger.ts        # Pino implementation
│   │   └── console-logger.ts     # Fallback implementation
│   ├── cache/
│   │   ├── index.ts              # Cache factory
│   │   ├── cache.interface.ts    # Cache contract
│   │   ├── redis-cache.ts        # Redis implementation
│   │   └── memory-cache.ts       # In-memory fallback
│   ├── storage/
│   │   ├── index.ts              # Storage factory
│   │   ├── storage.interface.ts  # Storage contract
│   │   ├── s3-storage.ts         # S3/R2/MinIO implementation
│   │   └── local-storage.ts      # Local filesystem fallback
│   ├── mail/
│   │   ├── index.ts              # Mail factory
│   │   ├── mail.interface.ts     # Mail contract
│   │   ├── brevo-mail.ts         # Brevo/Sendinblue implementation
│   │   ├── resend-mail.ts        # Resend implementation
│   │   └── console-mail.ts       # Dev: log to console
│   └── queue/                    # Future: background jobs
│       └── ...
└── services/                     # Shared services
    └── ...
```

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Controller** (`index.ts`) | HTTP concerns: routes, validation, auth guards | Parse request, call service, format response |
| **Service** (`*.service.ts`) | Business logic, orchestration | "Create kitchen" = validate owner, create org, create profile |
| **Repository** (`*.repository.ts`) | Data access, queries | Drizzle queries, PostGIS operations |
| **DTO** (`*.dto.ts`) | Input/output validation | Zod schemas for request bodies |

### Dependency Injection Pattern

Elysia doesn't have built-in DI, but we can use a simple factory pattern with `decorate`:

```typescript
// src/infrastructure/container.ts
import { createLogger } from './logger';
import { createCacheStore } from './cache';
import { createStorage } from './storage';
import { createMailer } from './mail';

export function createContainer() {
  return {
    logger: createLogger(),
    cache: createCacheStore(),
    storage: createStorage(),
    mailer: createMailer(),
  };
}

export type Container = ReturnType<typeof createContainer>;
```

```typescript
// src/main.ts
import { Elysia } from 'elysia';
import { createContainer } from './infrastructure/container';

export const app = new Elysia()
  .decorate('container', createContainer())
  .use(allRoutes);
```

```typescript
// src/modules/kitchens/index.ts
export const kitchenRoutes = new Elysia({ prefix: '/kitchens' })
  .post('/', async ({ body, container }) => {
    const { logger, storage } = container;
    logger.info('Creating kitchen', { name: body.name });
    // ... use storage for image upload
  });
```

---

## Infrastructure Layers

### 1. Logging (Optional)

**Interface:**

```typescript
// src/infrastructure/logger/logger.interface.ts
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): Logger;
}
```

**Implementations:**

| Implementation | When to Use | Dependencies |
|----------------|-------------|--------------|
| `PinoLogger` | Production, structured JSON logs | `pino` |
| `ConsoleLogger` | Development, simple output | None |
| `NoopLogger` | Testing, disable logs | None |

**Factory:**

```typescript
// src/infrastructure/logger/index.ts
export function createLogger(): Logger {
  if (env.LOG_LEVEL === 'silent') return new NoopLogger();
  if (env.NODE_ENV === 'production') return new PinoLogger();
  return new ConsoleLogger();
}
```

**Environment Variables:**

```env
LOG_LEVEL=info          # fatal | error | warn | info | debug | trace | silent
LOG_FORMAT=json         # json | pretty (dev only)
```

---

### 2. Caching (Optional)

**Interface (existing, enhanced):**

```typescript
// src/infrastructure/cache/cache.interface.ts
export interface CacheStore {
  get<T>(key: string[]): Promise<T | null>;
  set<T>(key: string[], value: T, ttlSeconds: number): Promise<void>;
  del(key: string[]): Promise<void>;
  
  // Optional: pattern-based invalidation
  delByPattern?(pattern: string): Promise<void>;
  
  // Optional: check existence without fetching
  has?(key: string[]): Promise<boolean>;
}
```

**Implementations:**

| Implementation | When to Use | Dependencies |
|----------------|-------------|--------------|
| `RedisCache` | Production, distributed | `ioredis`, Redis server |
| `InMemoryCache` | Development, single instance | None |

**Use Cases in Dishi:**

| What to Cache | TTL | Key Pattern |
|---------------|-----|-------------|
| Kitchen profile (public) | 5 min | `['kitchen', slug]` |
| Menu items | 2 min | `['menu', kitchenId]` |
| Cuisine list | 1 hour | `['cuisines']` |
| Nearby kitchens query | 1 min | `['nearby', lat, lng, radius]` |

**Cache-Aside Pattern:**

```typescript
async function getKitchenBySlug(slug: string): Promise<Kitchen | null> {
  const cacheKey = ['kitchen', slug];
  
  // Try cache first
  const cached = await cache.get<Kitchen>(cacheKey);
  if (cached) return cached;
  
  // Miss: fetch from DB
  const kitchen = await kitchenRepository.findBySlug(slug);
  if (kitchen) {
    await cache.set(cacheKey, kitchen, 300); // 5 min TTL
  }
  
  return kitchen;
}
```

**Environment Variables:**

```env
REDIS_URL=redis://localhost:6379   # Optional: if not set, uses in-memory
CACHE_ENABLED=true                 # Optional: disable caching entirely
```

---

### 3. Storage / S3-Compatible Layer

**Interface:**

```typescript
// src/infrastructure/storage/storage.interface.ts
export interface StorageService {
  upload(params: UploadParams): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
}

export interface UploadParams {
  key: string;                    // e.g., 'kitchens/abc123/cover.jpg'
  body: Buffer | Readable;
  contentType: string;
  acl?: 'public-read' | 'private';
}

export interface UploadResult {
  key: string;
  url: string;                    // Public URL or signed URL
  size: number;
}
```

**Implementations:**

| Implementation | When to Use | Dependencies |
|----------------|-------------|--------------|
| `S3Storage` | Production (AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces) | `@aws-sdk/client-s3` |
| `LocalStorage` | Development, testing | `fs` (built-in) |

**S3-Compatible Services:**

| Provider | S3 Endpoint | Notes |
|----------|-------------|-------|
| AWS S3 | `s3.{region}.amazonaws.com` | Standard |
| Cloudflare R2 | `{account_id}.r2.cloudflarestorage.com` | No egress fees |
| DigitalOcean Spaces | `{region}.digitaloceanspaces.com` | Simple pricing |
| MinIO | Self-hosted | For local/on-prem |
| Supabase Storage | Via Supabase SDK | If using Supabase |

**Folder Structure in Bucket:**

```
dishi-uploads/
├── kitchens/
│   └── {kitchenId}/
│       ├── cover.jpg
│       └── logo.png
├── menu-items/
│   └── {itemId}/
│       └── image.jpg
└── users/
    └── {userId}/
        └── avatar.jpg
```

**Environment Variables:**

```env
# Storage provider (s3 | local)
STORAGE_PROVIDER=s3

# S3-compatible settings
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com  # Optional for non-AWS
S3_REGION=auto
S3_BUCKET=dishi-uploads
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_PUBLIC_URL=https://cdn.dishi.app   # CDN or public bucket URL

# Local storage (dev only)
LOCAL_STORAGE_PATH=./uploads
LOCAL_STORAGE_URL=http://localhost:4000/uploads
```

---

### 4. Email Service

**Interface:**

```typescript
// src/infrastructure/mail/mail.interface.ts
export interface MailService {
  send(params: SendMailParams): Promise<SendMailResult>;
  sendTemplate(params: SendTemplateParams): Promise<SendMailResult>;
}

export interface SendMailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface SendTemplateParams {
  to: string | string[];
  template: EmailTemplate;
  variables: Record<string, string>;
}

export type EmailTemplate = 
  | 'welcome'
  | 'verify-email'
  | 'reset-password'
  | 'kitchen-approved'
  | 'new-follower'          // Future
  | 'order-received'        // Phase 2
  | 'order-ready';          // Phase 2
```

**Implementations:**

| Implementation | When to Use | Dependencies |
|----------------|-------------|--------------|
| `BrevoMail` | Production (current) | `nodemailer` |
| `ResendMail` | Alternative provider | `resend` |
| `ConsoleMail` | Development (logs to console) | None |

**Environment Variables:**

```env
# Mail provider (brevo | resend | console)
MAIL_PROVIDER=brevo

# Brevo (Sendinblue)
BREVO_API_KEY=...
BREVO_USER=...

# Resend (alternative)
RESEND_API_KEY=...

# Common
EMAIL_FROM=Dishi <hello@dishi.app>
```

---

### 5. Queue / Background Jobs (Future)

For Phase 2+ when you need async processing:

**Use Cases:**
- Send order notifications
- Generate daily reports
- Process image thumbnails
- Sync with external systems

**Options:**

| Solution | Complexity | Best For |
|----------|------------|----------|
| BullMQ + Redis | Medium | Most cases, good dashboard |
| pg-boss | Low | Already using Postgres |
| Trigger.dev | Low | Serverless, managed |
| Inngest | Low | Event-driven workflows |

---

## Error Handling Pattern

### Typed Application Errors

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400,
    public meta?: Record<string, unknown>
  ) {
    super(message);
  }
}

export type ErrorCode =
  | 'KITCHEN_NOT_FOUND'
  | 'MENU_ITEM_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'ALREADY_EXISTS'
  | 'DELIVERY_OUT_OF_RANGE';

// Usage
throw new AppError('KITCHEN_NOT_FOUND', 'Kitchen not found', 404);
throw new AppError('DELIVERY_OUT_OF_RANGE', 'Address is outside delivery radius', 400);
```

### Global Error Handler

```typescript
// src/middleware/error-handler.ts
export const errorHandler = new Elysia()
  .onError(({ error, code, set, container }) => {
    const { logger } = container;
    
    if (error instanceof AppError) {
      logger.warn('Application error', { code: error.code, message: error.message });
      set.status = error.statusCode;
      return { error: error.code, message: error.message };
    }
    
    // Unexpected error
    logger.error('Unexpected error', error);
    set.status = 500;
    return { error: 'INTERNAL_ERROR', message: 'Something went wrong' };
  });
```

---

## Configuration Pattern

### Environment-based Feature Flags

```typescript
// src/config/features.ts
export const features = {
  cache: {
    enabled: env.CACHE_ENABLED !== 'false',
    ttl: {
      kitchen: 300,      // 5 min
      menu: 120,         // 2 min
      cuisines: 3600,    // 1 hour
    },
  },
  storage: {
    provider: env.STORAGE_PROVIDER || 'local',
    maxFileSizeMb: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  mail: {
    provider: env.MAIL_PROVIDER || 'console',
    enabled: env.MAIL_ENABLED !== 'false',
  },
  logging: {
    level: env.LOG_LEVEL || 'info',
    format: env.LOG_FORMAT || 'json',
  },
};
```

### Per-Environment Defaults

| Feature | Development | Production |
|---------|-------------|------------|
| Cache | In-memory | Redis |
| Storage | Local filesystem | S3/R2 |
| Mail | Console (logs) | Brevo/Resend |
| Logging | Pretty console | JSON (structured) |

---

## Testing Patterns

### Repository Testing (Integration)

```typescript
// Use real DB with test transactions
describe('KitchenRepository', () => {
  it('finds kitchens within radius', async () => {
    // Seed test data with known coordinates
    // Query with PostGIS
    // Assert results
  });
});
```

### Service Testing (Unit)

```typescript
// Mock repositories
describe('KitchenService', () => {
  const mockRepo = { findBySlug: vi.fn() };
  const mockCache = { get: vi.fn(), set: vi.fn() };
  const service = new KitchenService(mockRepo, mockCache);
  
  it('returns cached kitchen if available', async () => {
    mockCache.get.mockResolvedValue(mockKitchen);
    const result = await service.getBySlug('test');
    expect(mockRepo.findBySlug).not.toHaveBeenCalled();
  });
});
```

### E2E Testing

```typescript
// Test full request cycle
describe('GET /kitchens/:slug', () => {
  it('returns kitchen with menu', async () => {
    const response = await app.handle(
      new Request('http://localhost/kitchens/mama-njeri')
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.name).toBe("Mama Njeri's Kitchen");
  });
});
```

---

## Migration Path from Boilerplate

### Remove
- `proposals-schema.ts` - Remove governance tables (proposal, vote, comment)
- Townhall-specific role definitions
- Governance API modules

### Rename/Adapt
- Organization → Kitchen (conceptually, keep the table)
- `auth-roles.ts` → Update with Dishi roles
- Admin plugin statements → Update for kitchen/menu/order resources

### Add
- Enable PostGIS extension
- Enable pg_vector extension
- Kitchen profile table
- Menu tables (category, items)
- Customer engagement tables (favorites, locations)
- Cuisine type reference table

---

## Phase 1 Scope (MVP)

### Tables to Implement
- [x] `user` (Better Auth)
- [x] `organization` (Better Auth → Kitchen)
- [x] `member` (Better Auth → Kitchen Staff)
- [ ] `kitchen_profile`
- [ ] `cuisine_type`
- [ ] `kitchen_cuisine`
- [ ] `menu_category`
- [ ] `menu_item`
- [ ] `customer_favorite`
- [ ] `customer_location`

### Features
- Kitchen onboarding (create profile, add menu)
- Customer discovery (browse nearby kitchens)
- Menu viewing
- WhatsApp contact integration
- Save favorites

### Deferred to Phase 2+
- Order tables
- Order flow (accept, prepare, deliver)
- Expanded kitchen roles
- Ratings and reviews
- Payment integration
- Push notifications

---

## Environment Variables

### Required

```env
# Application
NODE_ENV=development              # development | production | test
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dishi?sslmode=require

# Authentication
BETTER_AUTH_SECRET=...            # Generate: openssl rand -base64 32
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
```

### Optional (Infrastructure Layers)

```env
# ─────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────
LOG_LEVEL=info                    # fatal | error | warn | info | debug | trace | silent
LOG_FORMAT=pretty                 # json | pretty (json recommended for production)

# ─────────────────────────────────────────────────────────────────
# CACHING
# ─────────────────────────────────────────────────────────────────
CACHE_ENABLED=true                # Set to 'false' to disable caching
REDIS_URL=redis://localhost:6379  # If not set, uses in-memory cache

# ─────────────────────────────────────────────────────────────────
# STORAGE (S3-Compatible)
# ─────────────────────────────────────────────────────────────────
STORAGE_PROVIDER=local            # s3 | local

# For S3/R2/Spaces/MinIO:
S3_ENDPOINT=                      # Leave empty for AWS S3, set for R2/Spaces/MinIO
S3_REGION=auto
S3_BUCKET=dishi-uploads
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_PUBLIC_URL=https://cdn.dishi.app   # CDN or public bucket URL

# For local development:
LOCAL_STORAGE_PATH=./uploads
LOCAL_STORAGE_URL=http://localhost:4000/uploads

# ─────────────────────────────────────────────────────────────────
# EMAIL
# ─────────────────────────────────────────────────────────────────
MAIL_PROVIDER=console             # brevo | resend | console
MAIL_ENABLED=true                 # Set to 'false' to disable emails

# Brevo (Sendinblue):
BREVO_API_KEY=...
BREVO_USER=...

# Resend (alternative):
RESEND_API_KEY=...

# Common:
EMAIL_FROM=Dishi <hello@dishi.app>
```

### Environment Presets

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | development | production |
| `LOG_LEVEL` | debug | info |
| `LOG_FORMAT` | pretty | json |
| `CACHE_ENABLED` | true | true |
| `REDIS_URL` | (not set → in-memory) | redis://... |
| `STORAGE_PROVIDER` | local | s3 |
| `MAIL_PROVIDER` | console | brevo |

---

## Infrastructure Setup Checklist

### Database Extensions

```sql
-- Run once on your PostgreSQL database
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

### Local Development Setup

1. **Copy environment file:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

2. **Minimal .env for local dev:**
   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dishi
   LOG_LEVEL=debug
   STORAGE_PROVIDER=local
   MAIL_PROVIDER=console
   # ... auth secrets
   ```

3. **Optional: Start Redis for caching:**
   ```bash
   docker run -d --name dishi-redis -p 6379:6379 redis:alpine
   ```
   Then add `REDIS_URL=redis://localhost:6379` to `.env`

4. **Optional: Start MinIO for local S3:**
   ```bash
   docker run -d --name dishi-minio \
     -p 9000:9000 -p 9001:9001 \
     -e MINIO_ROOT_USER=minioadmin \
     -e MINIO_ROOT_PASSWORD=minioadmin \
     minio/minio server /data --console-address ":9001"
   ```
   Then configure:
   ```env
   STORAGE_PROVIDER=s3
   S3_ENDPOINT=http://localhost:9000
   S3_BUCKET=dishi-uploads
   S3_ACCESS_KEY_ID=minioadmin
   S3_SECRET_ACCESS_KEY=minioadmin
   S3_PUBLIC_URL=http://localhost:9000/dishi-uploads
   ```

### Production Recommendations

| Service | Recommended Provider | Notes |
|---------|---------------------|-------|
| Database | Supabase, Neon, or Railway | All support PostGIS |
| Cache | Upstash Redis | Serverless, pay-per-request |
| Storage | Cloudflare R2 | No egress fees, S3-compatible |
| Email | Resend or Brevo | Good deliverability |
| Hosting (API) | Railway, Render, or Fly.io | Supports Bun |
| Hosting (Web) | Vercel or Cloudflare Pages | Edge SSR support |

---

## Next Steps

### Phase 0: Infrastructure Setup
1. [ ] Set up PostgreSQL with PostGIS extension
2. [ ] Create `src/infrastructure/` folder structure
3. [ ] Implement logger abstraction (Pino + Console)
4. [ ] Enhance existing cache abstraction
5. [ ] Implement S3-compatible storage layer
6. [ ] Enhance existing email service with interface

### Phase 1: Core Development
1. [ ] Update `auth-roles.ts` with Dishi role definitions
2. [ ] Remove proposal/governance schema files
3. [ ] Create kitchen and menu schema files
4. [ ] Run database migrations
5. [ ] Scaffold kitchen module (routes, service, repository)
6. [ ] Scaffold menu module
7. [ ] Scaffold customer module (favorites, locations)
8. [ ] Set up TanStack Start frontend
9. [ ] Build kitchen discovery pages (SSR)
10. [ ] Build kitchen dashboard pages

### Phase 2: Growth Features (Future)
- [ ] Order management tables and flow
- [ ] Expanded kitchen roles
- [ ] Ratings and reviews
- [ ] Push notifications
- [ ] Analytics dashboard

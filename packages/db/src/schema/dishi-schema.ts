import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  time,
  index,
  uniqueIndex,
  primaryKey,
  geometry,
  vector,
} from "drizzle-orm/pg-core";
import { user, organization } from "./auth-schema.js";

export const cuisineType = pgTable("cuisine_type", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
});

export const kitchenProfile = pgTable(
  "kitchen_profile",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .unique()
      .references(() => organization.id, { onDelete: "cascade" }),
    description: text("description"),
    phone: text("phone"),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
    address: text("address"),
    neighborhood: text("neighborhood"),
    deliveryRadiusKm: decimal("delivery_radius_km", { precision: 5, scale: 2 }),
    isOpen: boolean("is_open").default(false).notNull(),
    opensAt: time("opens_at"),
    closesAt: time("closes_at"),
    operatingDays: text("operating_days").array(),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("kitchen_profile_spatial_idx").using("gist", table.location),
    index("kitchen_profile_neighborhood_idx").on(table.neighborhood),
  ],
);

export const kitchenCuisine = pgTable(
  "kitchen_cuisine",
  {
    kitchenId: text("kitchen_id")
      .notNull()
      .references(() => kitchenProfile.id, { onDelete: "cascade" }),
    cuisineId: text("cuisine_id")
      .notNull()
      .references(() => cuisineType.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.kitchenId, table.cuisineId] }),
    index("kitchen_cuisine_cuisine_id_idx").on(table.cuisineId),
  ],
);

export const menuCategory = pgTable(
  "menu_category",
  {
    id: text("id").primaryKey(),
    kitchenId: text("kitchen_id")
      .notNull()
      .references(() => kitchenProfile.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("menu_category_kitchen_id_idx").on(table.kitchenId)],
);

export const menuItem = pgTable(
  "menu_item",
  {
    id: text("id").primaryKey(),
    kitchenId: text("kitchen_id")
      .notNull()
      .references(() => kitchenProfile.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => menuCategory.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    image: text("image"),
    isAvailable: boolean("is_available").default(true).notNull(),
    isDailySpecial: boolean("is_daily_special").default(false).notNull(),
    servingSize: text("serving_size"),
    preparationTimeMins: integer("preparation_time_mins"),
    dietaryTags: text("dietary_tags").array(),
    embedding: vector("embedding", { dimensions: 1536 }),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("menu_item_kitchen_id_idx").on(table.kitchenId),
    index("menu_item_category_id_idx").on(table.categoryId),
    index("menu_item_search_idx").using(
      "gin",
      sql`(
        setweight(to_tsvector('simple', ${table.name}), 'A') ||
        setweight(to_tsvector('simple', coalesce(${table.description}, '')), 'B')
      )`,
    ),
    index("menu_item_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const customerFavorite = pgTable(
  "customer_favorite",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kitchenId: text("kitchen_id")
      .notNull()
      .references(() => kitchenProfile.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("customer_favorite_user_kitchen_uidx").on(
      table.userId,
      table.kitchenId,
    ),
    index("customer_favorite_user_id_idx").on(table.userId),
    index("customer_favorite_kitchen_id_idx").on(table.kitchenId),
  ],
);

export const customerLocation = pgTable(
  "customer_location",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    address: text("address"),
    neighborhood: text("neighborhood"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("customer_location_user_id_idx").on(table.userId),
    index("customer_location_spatial_idx").using("gist", table.location),
  ],
);


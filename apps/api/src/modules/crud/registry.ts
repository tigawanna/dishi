import {
  account,
  apikey,
  cuisineType,
  customerFavorite,
  customerLocation,
  invitation,
  kitchenProfile,
  kitchenCuisine,
  member,
  menuCategory,
  menuItem,
  organization,
  session,
  user,
  verification,
} from "@backend/db/schema";
import { getTableName } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export interface CrudTableConfig<T extends PgTable = PgTable> {
  table: T;
  searchOn: (keyof T["$inferSelect"] & string)[];
}

export type CrudRegistryEntry = CrudTableConfig;

const TABLES: CrudRegistryEntry[] = [
  { table: user, searchOn: ["name", "email"] },
  { table: session, searchOn: ["token"] },
  { table: account, searchOn: ["accountId", "providerId"] },
  { table: verification, searchOn: ["identifier", "value"] },
  { table: apikey, searchOn: ["name", "key"] },
  { table: organization, searchOn: ["name", "slug"] },
  { table: member, searchOn: ["role"] },
  { table: invitation, searchOn: ["email", "status"] },
  { table: cuisineType, searchOn: ["name", "slug"] },
  { table: kitchenProfile, searchOn: ["description", "address", "neighborhood"] },
  { table: kitchenCuisine, searchOn: [] },
  { table: menuCategory, searchOn: ["name"] },
  { table: menuItem, searchOn: ["name", "description"] },
  { table: customerFavorite, searchOn: [] },
  { table: customerLocation, searchOn: ["label", "address", "neighborhood"] },
];

export const CRUD_REGISTRY = new Map<string, CrudRegistryEntry>();

for (const entry of TABLES) {
  CRUD_REGISTRY.set(getTableName(entry.table) as string, entry);
}

export function getCrudTable(tableName: string): CrudRegistryEntry | undefined {
  return CRUD_REGISTRY.get(tableName);
}

export function listCrudTables(): string[] {
  return Array.from(CRUD_REGISTRY.keys());
}

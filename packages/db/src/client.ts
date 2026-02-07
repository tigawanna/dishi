import { drizzle } from "drizzle-orm/node-postgres";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import { relations } from "./relations.js";

export function createDb(databaseUrl: string, options?: { logger?: boolean }) {
  return drizzle(databaseUrl, {
    relations,
    logger: options?.logger ? new EnhancedQueryLogger() : undefined,
  });
}

export type Database = ReturnType<typeof createDb>;

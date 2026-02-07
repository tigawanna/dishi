import { drizzle } from "drizzle-orm/node-postgres";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import * as schema from "./schema/index";

export function createDb(databaseUrl: string, options?: { logger?: boolean }) {
  return drizzle(databaseUrl, {
    schema,
    logger: options?.logger ? new EnhancedQueryLogger() : undefined,
  });
}

export type Database = ReturnType<typeof createDb>;

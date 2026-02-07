import { drizzle } from "drizzle-orm/node-postgres";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import * as schema from "./schema/index.js";


export function createDb(databaseUrl: string, options?: { logger?: boolean }) {
  return drizzle(databaseUrl, {
    schema,
    relations: schema.relations,
    logger: options?.logger ? new EnhancedQueryLogger() : undefined,
  });
}

export type Database = ReturnType<typeof createDb>;

import { envVariables } from "@backend/env";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import * as schema from "./schema/index";

export const db = drizzle(envVariables.DATABASE_URL, {
  schema,

  logger: new EnhancedQueryLogger(),
});

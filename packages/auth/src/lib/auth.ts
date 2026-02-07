import { createAuth } from "../server.js";
import { createDb } from "@repo/db/client";
import { AUTHORIZED_ORIGINS } from "@repo/config/origins";

export function createAuthFromEnv(databaseUrl: string) {
  return createAuth({
    database: createDb(databaseUrl),
    trustedOrigins: AUTHORIZED_ORIGINS,
  });
}

import { createAuth } from "../server.js";
import { createDb } from "@repo/db/client";
import { AUTHORIZED_ORIGINS } from "@repo/config/origins";
import { envVariables } from "@repo/config/db-env";

export const auth = createAuth({
  database: createDb(envVariables.DATABASE_URL),
  trustedOrigins: AUTHORIZED_ORIGINS,
});

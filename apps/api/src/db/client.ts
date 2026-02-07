import { createDb } from "@repo/db";
import { envVariables } from "@backend/env";

export const db = createDb(envVariables.DATABASE_URL, { logger: true });

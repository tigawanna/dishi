import { createDb } from "@repo/db";
import * as schema from "@repo/db/schema";
import { envVariables } from "@backend/env";
import { reset } from "drizzle-seed";

async function main() {
  const db = createDb(envVariables.DATABASE_URL);
  await reset(db, schema);
}

main();

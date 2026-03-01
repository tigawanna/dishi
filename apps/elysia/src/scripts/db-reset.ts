import { db } from "@elysia-api/db/client";
import * as schema from "@elysia-api/db/schema";
import { reset } from "drizzle-seed";

//  ths will delete the db use with extreme caution
async function main() {
  await reset(db, schema);
}

main();

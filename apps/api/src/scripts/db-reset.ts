import { db } from "@backend/db/client";
import * as schema from "@backend/db/schema";
import { reset } from "drizzle-seed";

//  ths will delete the db use with extreme caution
async function main() {
  await reset(db, schema);
}

main();

import "dotenv/config";
import { createDb } from "../client";
import * as schema from "../schema";
import { reset } from "drizzle-seed";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  const db = createDb(databaseUrl);
  await reset(db, schema);
}

main();

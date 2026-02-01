import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { envVariables } from "../env";
import { globSync } from "fast-glob";

const db = drizzle(envVariables.DATABASE_URL);

console.log("Dropping rental tables...");

const tables = globSync("./src/db/schema/*.ts").map((file) => {
  const parts = file.split("/");
  const fileName = parts[parts.length - 1];
  return fileName.replace(".ts", "");
});

tables.forEach(async (table) => {
  await db.execute(sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE`);
});

console.log("✓ Rental tables dropped. Run: pnpm drizzle:push");
process.exit(0);

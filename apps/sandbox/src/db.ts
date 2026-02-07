import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "./schema";

const { relations, ...schema } = schemas;

const url = process.env.DATABASE_URL || "file:./local.db";

export const db = drizzle({
  connection: { url },
  schema,
  relations,
});

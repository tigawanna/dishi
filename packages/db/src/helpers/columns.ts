import { integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql/sql";

export const commonColumns = {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
};

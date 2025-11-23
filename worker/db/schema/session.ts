import { integer, text, sqliteTable, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { user } from "./user";

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  secretHash: text("secret_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Schema for inserting a session - can be used to validate API requests
export const insertSessionSchema = createInsertSchema(session);

// Schema for selecting a session - can be used to validate API responses
export const selectSessionSchema = createSelectSchema(session);

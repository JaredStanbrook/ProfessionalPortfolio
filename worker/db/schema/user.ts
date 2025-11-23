import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";

// Define the user table
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Schema for inserting a user - using refinement functions to avoid type errors
export const insertUserSchema = createInsertSchema(user, {
  id: (schema) => schema,
  email: z.email(),
});

// Schema for selecting a user
export const selectUserSchema = createSelectSchema(user);

// Schema for updating a user - making all fields optional
export const updateUserSchema = createUpdateSchema(user, {
  email: z.email(),
});

// Public user type - for use in API responses
export type User = Pick<z.infer<typeof selectUserSchema>, "id" | "email">;

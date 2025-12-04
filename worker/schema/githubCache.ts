import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const githubCache = sqliteTable("github_repo_cache", {
  id: text("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  data: text("data").notNull(), // Stringified JSON
  expiresAt: integer("expires_at").notNull(), // Unix timestamp
});

// Insert schema with proper refinement functions
export const insertGithubRepoCacheSchema = createInsertSchema(githubCache, {
  // Use refinement functions instead of direct schema assignments
  owner: (schema) => schema.min(1),
  repo: (schema) => schema.min(1),
  expiresAt: (schema) => schema.int().positive(), // Unix timestamp
});

// Select schema
export const selectGithubCacheSchema = createSelectSchema(githubCache);

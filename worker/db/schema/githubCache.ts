import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const githubCache = sqliteTable("github_repo_cache", {
  id: text("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  data: text("data").notNull(), // Stringified JSON
  expiresAt: integer("expires_at").notNull(), // Unix timestamp
});

// Insert schema
export const insertGithubRepoCacheSchema = createInsertSchema(githubCache, {
  owner: z.string().min(1),
  repo: z.string().min(1),
  data: z.string(), // should be JSON.stringify(response)
  expiresAt: z.number().int().positive(), // Unix timestamp
});

// Select schema
export const selectGithubCacheSchema = createSelectSchema(githubCache);

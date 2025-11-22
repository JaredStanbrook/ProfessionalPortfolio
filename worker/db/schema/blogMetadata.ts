import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Define the blog_metadata table
export const blogMetadata = sqliteTable("blog_metadata", {
  filename: text("filename").primaryKey(),
  title: text("title").notNull(),
  readTime: integer("readTime").notNull(),
  subject: text("subject").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

// Schema for inserting blog metadata
export const insertBlogMetadataSchema = createInsertSchema(blogMetadata, {
  filename: (schema) => schema.min(1),
  title: (schema) => schema.min(1),
  readTime: (schema) => schema.min(1),
  subject: (schema) => schema.min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

// Schema for selecting blog metadata
export const selectBlogMetadataSchema = createSelectSchema(blogMetadata);

// Schema for updating blog metadata - all fields optional except filename
export const updateBlogMetadataSchema = createUpdateSchema(blogMetadata, {
  title: (schema) => schema.min(1),
  readTime: (schema) => schema.min(1),
  subject: (schema) => schema.min(1),
  updatedAt: z.iso.datetime().optional(),
});

// Public blog metadata type - for use in API responses
export type BlogMetadata = z.infer<typeof selectBlogMetadataSchema>;

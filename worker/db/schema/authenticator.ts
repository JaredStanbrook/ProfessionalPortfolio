import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Authenticator table for WebAuthn credentials
 * Stores public keys and metadata for registered authenticators
 *
 * No user table needed - single admin user with ID "admin"
 */
export const authenticator = sqliteTable("authenticator", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // Always "admin" for single-admin setup
  credentialId: text("credential_id").notNull().unique(),
  credentialPublicKey: text("credential_public_key").notNull(), // Base64 encoded
  counter: integer("counter").notNull().default(0), // For replay protection
  transports: text("transports"), // e.g., "usb", "nfc", "ble", "internal", "platform"
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Schema for inserting an authenticator
export const insertAuthenticatorSchema = createInsertSchema(authenticator, {
  id: (schema) => schema.min(1),
  userId: (schema) => schema.min(1),
  credentialId: (schema) => schema.min(1),
  credentialPublicKey: (schema) => schema.min(1),
});

// Schema for selecting an authenticator
export const selectAuthenticatorSchema = createSelectSchema(authenticator);

// Public authenticator type - for use in API responses
export type PublicAuthenticator = Pick<
  typeof authenticator.$inferSelect,
  "id" | "credentialId" | "transports" | "createdAt"
>;

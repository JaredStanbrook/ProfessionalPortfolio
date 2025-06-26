import { insertUserSchema } from "./db/schema/user";
import { insertSessionSchema } from "./db/schema/session";

import { z } from "zod/v4";
import { selectGithubCacheSchema } from "./db/schema/githubCache";
import type { selectBlogMetadataSchema } from "./db/schema/blogMetadata";

export const createUserSchema = insertUserSchema
  .omit({
    id: true,
    emailVerified: true,
    phone: true,
  })
  .extend({
    address: z.string().optional(),
  });
export const authUserSchema = insertUserSchema.omit({
  id: true,
  password: true,
  emailVerified: true,
  phone: true,
});
export const createSessionSchema = insertSessionSchema.omit({
  id: true,
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type GithubCache = z.infer<typeof selectGithubCacheSchema>;
export type blogMetadata = z.infer<typeof selectBlogMetadataSchema>;

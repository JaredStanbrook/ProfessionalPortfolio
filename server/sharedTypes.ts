import { insertUserSchema } from "./db/schema/user";
import { insertSessionSchema } from "./db/schema/session";

import { z } from "zod";

export const createUserSchema = insertUserSchema
  .omit({
    id: true,
    emailVerified: true,
    phone: true,
  })
  .merge(
    z.object({
      address: z.string().optional(),
    })
  );
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

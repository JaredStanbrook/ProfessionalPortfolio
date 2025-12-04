import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import type { Variables } from "../types";

export const dbMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

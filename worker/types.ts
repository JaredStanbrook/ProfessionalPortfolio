import { drizzle } from "drizzle-orm/d1";
import type { AuthConfig } from "./config/auth.config";
import type { Auth } from "./services/auth.service";

export type Variables = {
  db: ReturnType<typeof drizzle>;
  authConfig: AuthConfig;
  isMethodEnabled: (method: string) => boolean;
  kv: KVNamespace;
  auth: Auth;
};

export type AppEnv = {
  Bindings: Env;
  Variables: Variables;
};

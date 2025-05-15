import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./worker/db/schema/user.ts",
    "./worker/db/schema/githubCache.ts",
    "./worker/db/schema/session.ts",
  ],
  dialect: "sqlite",
});

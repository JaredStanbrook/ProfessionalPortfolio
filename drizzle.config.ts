import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./server/db/schema/user.ts",
    "./server/db/schema/githubCache.ts",
    "./server/db/schema/session.ts",
  ],
  dialect: "sqlite",
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./worker/db/schema/user.ts",
    "./worker/db/schema/githubCache.ts",
    "./worker/db/schema/session.ts",
    "./worker/db/schema/blogMetadata.ts",
    "./worker/db/schema/authenticator.ts",
  ],
  dialect: "sqlite",
});

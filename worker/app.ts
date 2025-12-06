// worker/app.ts
import { Hono } from "hono";
import { githubRoute } from "./routes/github";
import { auth as authRoute } from "./routes/auth";
import { blogRoute } from "./routes/blog";
import type { AppEnv } from "./types";
import { configMiddleware } from "./middleware/config.middleware";
import { dbMiddleware } from "./middleware/db.middleware";

const app = new Hono<AppEnv>()
  .basePath("/api")
  .use("*", configMiddleware)
  .use("*", dbMiddleware)

  .route("/auth", authRoute)
  .route("/github", githubRoute)
  .route("/blog", blogRoute);

export type AppType = typeof app;
export default app;

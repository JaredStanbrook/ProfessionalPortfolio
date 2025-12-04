import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { githubRoute } from "./routes/github";
import { auth as authRoute } from "./routes/auth";

import { HTTPException } from "hono/http-exception";
import { blogRoute } from "./routes/blog";
import type { AppEnv } from "./types";
import { configMiddleware } from "./middleware/config.middleware";
import { dbMiddleware } from "./middleware/db.middleware";

const app = new Hono<AppEnv>()
  .use("*", logger())
  .use(
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Authorization", "Content-Type"],
      credentials: true,
    })
  )
  .basePath("/api")
  .use("*", configMiddleware)
  .use("*", dbMiddleware)
  .route("/auth", authRoute)
  .route("/github", githubRoute)
  .route("/blog", blogRoute)
  .get("/*", async (c) => {
    return c.env.ASSETS.fetch(c.req.raw);
  });

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.notFound((c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export type AppType = typeof app;
export default app;

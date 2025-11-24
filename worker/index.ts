import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { githubRoute } from "./routes/github";
import { authRoute } from "./routes/auth";

import { HTTPException } from "hono/http-exception";
import { blogRoute } from "./routes/blog";

const app = new Hono<{ Bindings: Env }>()
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
  .route("/auth", authRoute)
  .route("/github", githubRoute)
  .route("/blog", blogRoute)
  .get("/*", async (c) => {
    return c.env.ASSETS.fetch(c.req.raw);
  });

app.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  } else {
    return new Response("Internal Server Error", { status: 500 });
  }
});

app.notFound((c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export type AppType = typeof app;
export default app;

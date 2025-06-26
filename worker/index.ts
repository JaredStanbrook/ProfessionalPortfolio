import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { githubRoute } from "./routes/github";
import { homeRoute } from "./routes/home";
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
  .route("/home", homeRoute)
  .route("/blog", blogRoute)
  .get("/*", async (c) => {
    const object = await c.env.R2.get(c.req.path.slice(1));
    if (object != null) {
      c.status(201);
      return c.body(object?.body);
    } else {
      return c.env.ASSETS.fetch(c.req.raw);
    }
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

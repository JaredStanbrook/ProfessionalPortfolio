// worker/index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";
import type { AppEnv } from "./types";

import routes from "./app";

const worker = new Hono<AppEnv>();

worker.use("*", logger());
worker.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
worker.use((c, next) =>
  cloudflareRateLimiter<AppEnv>({
    rateLimitBinding: (c) => c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  })(c, next)
);

worker.route("/", routes);

worker.get("/*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

worker.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

worker.notFound((c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default worker;

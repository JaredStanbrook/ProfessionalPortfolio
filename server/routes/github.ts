import { Hono } from "hono";
import { dbMiddleware } from "../db";
import { githubCache } from "../db/schema/githubCache";
import { and, eq, gt } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export const githubRoute = new Hono<{ Bindings: Env }>()
  .use("*", dbMiddleware)
  .get("/:owner/:repo", async (c) => {
    const owner = c.req.param("owner");
    const repo = c.req.param("repo");

    const cached = await c.var.db
      .select()
      .from(githubCache)
      .where(
        and(
          eq(githubCache.owner, owner),
          eq(githubCache.repo, repo),
          gt(githubCache.expiresAt, Math.floor(Date.now() / 1000))
        )
      )
      .limit(1)
      .then((res) => res[0]);

    if (cached) {
      return c.json({ cached });
    }
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${c.env.GITHUB_API_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": owner,
        },
      });

      const data = await response.json();

      const now = Math.floor(Date.now() / 1000);
      const expiry = now + 60 * 60; // cache for 1 hour

      await c.var.db.insert(githubCache).values({
        owner: owner,
        repo: repo,
        data: JSON.stringify(data),
        expiresAt: expiry,
      });

      return c.json({ data });
    } catch (error) {
      console.error("Error fetching commit data:", error);
      throw new HTTPException(500, { message: "Failed to fetch data" });
    }
  });

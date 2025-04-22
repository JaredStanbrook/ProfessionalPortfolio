import { Hono } from "hono";
import { dbMiddleware } from "../db";

const owner = "JaredStanbook";
const repo = "it-service-desk";

export const githubRoute = new Hono<{ Bindings: CloudflareBindings }>()
  .use("*", dbMiddleware)
  .get("/stats/commit_activity", async (c) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        {
          headers: {
            Authorization: `Bearer ${c.env.GITHUB_API_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": owner,
          },
        }
      );
      const data = await response.json();
      return c.json({ data });
    } catch (error) {
      console.error("Error fetching weekly commit data:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  })
  .get("/stats/code_frequency", async (c) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`,
        {
          headers: {
            Authorization: `Bearer ${c.env.GITHUB_API_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": owner,
          },
        }
      );
      console.log(response);
      const data = await response.json();
      return c.json({ data });
    } catch (error) {
      console.error("Error fetching frequency data:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  });

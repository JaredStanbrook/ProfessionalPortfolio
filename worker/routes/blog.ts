import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { AccessControl } from "../services/access.service";
import { blogMetadata } from "../schema/blogs.schema";
import type { AppEnv } from "../types";
import { authMiddleware } from "../middleware/auth.middleware";
import { users } from "../schema/auth.schema";

const access = new AccessControl();

export const blogRoute = new Hono<AppEnv>()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const db = c.get("db");

    try {
      const results = await db
        .select({
          ...getTableColumns(blogMetadata),
          authorName: users.displayName,
        })
        .from(blogMetadata)

        .leftJoin(users, eq(blogMetadata.userId, users.id))
        .orderBy(desc(blogMetadata.createdAt))
        .all();

      const blogs = results.map((row) => ({
        ...row,
        authorName: row.authorName || "Anonymous",
      }));

      return c.json({ blogs });
    } catch (error) {
      console.error("Error fetching blog metadata:", error);
      return c.json({ error: "Failed to fetch blog metadata" }, 500);
    }
  })

  .get("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const db = c.get("db");

    // Optional: Access Control for Reading
    // const user = c.var.auth.user!;
    // access.authorize(user, "blogs", "read");

    try {
      const object = await c.env.BLOG.get(filename);
      if (!object) {
        return c.json({ error: "File not found" }, 404);
      }

      const fileContent = await object.text();

      const metadata = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      const content = fileContent.replace(/^---\n[\s\S]+?\n---\n/, "");

      const parsedFrontmatter = parseFrontMatter(fileContent);

      const authorName = metadata?.userId
        ? (await db.select().from(users).where(eq(users.id, metadata.userId)).get())?.displayName ||
          "Anonymous"
        : "Anonymous";

      return c.json({
        content,
        metadata: {
          title: metadata?.title || parsedFrontmatter.title,
          readTime: metadata?.readTime || parsedFrontmatter.readTime,
          subject: metadata?.subject || parsedFrontmatter.subject,
          createdAt: metadata?.createdAt || new Date().toISOString(),
          updatedAt: metadata?.updatedAt || new Date().toISOString(),
          authorId: metadata?.userId,
          authorName,
        },
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
      return c.json({ error: "Failed to fetch blog" }, 500);
    }
  })

  // =================================================================
  // PUT /:filename - Create or Update Blog
  // =================================================================
  .put("/:filename{.+\\.mdx}", zValidator("json", z.object({ body: z.string() })), async (c) => {
    const filename = c.req.param("filename");
    const { body } = c.req.valid("json");
    const user = c.var.auth.user!;
    const db = c.get("db");

    try {
      // 1. Check existence to determine Permission Requirement (Create vs Update)
      const existing = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      if (existing) {
        // UPDATE: Requires 'blogs.update' AND Ownership (unless 'blogs.update.any')
        access.authorize(user, "blogs", "update", existing.userId);
      } else {
        // CREATE: Requires 'blogs.create'
        access.authorize(user, "blogs", "create");
      }

      // 2. Parse Metadata from the MDX body
      const meta = parseFrontMatter(body);

      // 3. Save file to R2
      await c.env.BLOG.put(filename, body);

      await db
        .insert(blogMetadata)
        .values({
          filename,
          title: meta.title,
          readTime: meta.readTime,
          subject: meta.subject,
          userId: existing ? existing.userId : user.id,
        })
        .onConflictDoUpdate({
          target: blogMetadata.filename,
          set: {
            title: meta.title,
            readTime: meta.readTime,
            subject: meta.subject,
            updatedAt: new Date().toISOString(), // Force update timestamp
          },
        });

      return c.json({
        ok: true,
        filename,
        metadata: meta,
      });
    } catch (error: any) {
      // Handle Access Control Errors (403) specifically
      if (error.status === 403) return c.json({ error: error.message }, 403);

      console.error("Error saving blog:", error);
      return c.json({ error: "Failed to save blog" }, 500);
    }
  })

  // =================================================================
  // DELETE /:filename
  // =================================================================
  .delete("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const user = c.var.auth.user!;
    const db = c.get("db");

    try {
      // 1. Fetch Metadata to check Ownership
      const existing = await db
        .select()
        .from(blogMetadata)
        .where(eq(blogMetadata.filename, filename))
        .get();

      if (!existing) {
        return c.json({ error: "Blog not found" }, 404);
      }

      // 2. Access Control
      // Requires 'blogs.delete' AND Ownership (unless 'blogs.delete.any')
      access.authorize(user, "blogs", "delete", existing.userId);

      // 3. Delete from R2
      await c.env.BLOG.delete(filename);

      // 4. Delete from D1
      await db.delete(blogMetadata).where(eq(blogMetadata.filename, filename));

      return c.json({ ok: true, deleted: filename });
    } catch (error: any) {
      if (error.status === 403) return c.json({ error: error.message }, 403);

      console.error("Error deleting blog:", error);
      return c.json({ error: "Failed to delete blog" }, 500);
    }
  });

// --- Helper ---

function parseFrontMatter(content: string) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  let title = "Untitled";
  let readTime = 0;
  let subject = "General";

  if (match) {
    const frontmatter = match[1];
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?$/m);
    const readTimeMatch = frontmatter.match(/readTime:\s*(\d+)/m);
    const subjectMatch = frontmatter.match(/subject:\s*["']?(.+?)["']?$/m);

    if (titleMatch) title = titleMatch[1].trim();
    if (readTimeMatch) readTime = parseInt(readTimeMatch[1], 10);
    if (subjectMatch) subject = subjectMatch[1].trim();
  }

  return { title, readTime, subject };
}

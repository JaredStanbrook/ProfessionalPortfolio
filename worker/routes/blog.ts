import { Hono } from "hono";
import { dbMiddleware } from "../db";

interface BlogMetadata {
  filename: string;
  title: string;
  readTime: number;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

// D1 schema for blog metadata with timestamps
// CREATE TABLE blog_metadata (
//   filename TEXT PRIMARY KEY,
//   title TEXT NOT NULL,
//   readTime INTEGER NOT NULL,
//   subject TEXT NOT NULL,
//   createdAt TEXT NOT NULL,
//   updatedAt TEXT NOT NULL
// );

export const blogRoute = new Hono<{ Bindings: Env }>()
  .use("*", dbMiddleware)

  // GET all blog metadata from D1
  .get("/", async (c) => {
    try {
      const { results } = await c.env.DB.prepare(
        "SELECT filename, title, readTime, subject, createdAt, updatedAt FROM blog_metadata ORDER BY createdAt DESC"
      ).all();
      return c.json({ blogs: results });
    } catch (error) {
      console.error("Error fetching blog metadata:", error);
      return c.json({ error: "Failed to fetch blog metadata" }, 500);
    }
  })

  // GET a single blog MDX file (raw content + metadata)
  .get("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");

    try {
      const object = await c.env.BLOG.get(filename);
      if (!object) {
        return c.json({ error: "File not found" }, 404);
      }
      const fileContent = await object.text();

      // Parse frontmatter for metadata
      const metadata = parseFrontMatter(fileContent);

      // Get timestamps from D1
      const dbResult = await c.env.DB.prepare(
        "SELECT createdAt, updatedAt FROM blog_metadata WHERE filename = ?"
      )
        .bind(filename)
        .first();

      // Remove frontmatter and return raw content
      const content = fileContent.replace(/^---\n[\s\S]+?\n---\n/, "");

      return c.json({
        content,
        metadata: {
          ...metadata,
          createdAt: dbResult?.createdAt || new Date().toISOString(),
          updatedAt: dbResult?.updatedAt || new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
      return c.json({ error: "Failed to fetch blog" }, 500);
    }
  })

  // PUT a blog MDX file and update metadata in D1
  .put("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const body = await c.req.text();

    try {
      // Check if blog already exists to determine if this is a create or update
      const existingBlog = await c.env.DB.prepare(
        "SELECT filename, createdAt FROM blog_metadata WHERE filename = ?"
      )
        .bind(filename)
        .first();

      const now = new Date().toISOString();
      const createdAt = existingBlog ? existingBlog.createdAt : now;
      const updatedAt = now;

      // Save file to R2
      await c.env.BLOG.put(filename, body);

      // Parse frontmatter for metadata
      const metadata = parseFrontMatter(body);

      // Upsert metadata into D1 with timestamps
      await c.env.DB.prepare(
        `INSERT INTO blog_metadata (filename, title, readTime, subject, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(filename) DO UPDATE SET 
         title=excluded.title, 
         readTime=excluded.readTime, 
         subject=excluded.subject,
         updatedAt=excluded.updatedAt`
      )
        .bind(filename, metadata.title, metadata.readTime, metadata.subject, createdAt, updatedAt)
        .run();

      return c.json({
        ok: true,
        filename,
        metadata: {
          title: metadata.title,
          readTime: metadata.readTime,
          subject: metadata.subject,
          createdAt,
          updatedAt,
        },
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      return c.json({ error: "Failed to save blog" }, 500);
    }
  })

  // DELETE a blog file and its metadata
  .delete("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");

    try {
      // Delete from R2
      await c.env.BLOG.delete(filename);

      // Delete metadata from D1
      await c.env.DB.prepare("DELETE FROM blog_metadata WHERE filename = ?").bind(filename).run();

      return c.json({ ok: true, deleted: filename });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return c.json({ error: "Failed to delete blog" }, 500);
    }
  });

// Helper function to parse frontmatter
function parseFrontMatter(content: string): { title: string; readTime: number; subject: string } {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  let title = "";
  let readTime = 0;
  let subject = "";

  if (match) {
    const frontmatter = match[1];
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?$/m);
    const readTimeMatch = frontmatter.match(/readTime:\s*(\d+)/m);
    const subjectMatch = frontmatter.match(/subject:\s*["']?(.+?)["']?$/m);

    title = titleMatch ? titleMatch[1].trim() : "";
    readTime = readTimeMatch ? parseInt(readTimeMatch[1], 10) : 0;
    subject = subjectMatch ? subjectMatch[1].trim() : "";
  }

  return { title, readTime, subject };
}

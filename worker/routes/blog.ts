import { Hono } from "hono";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { compile, evaluate, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { dbMiddleware } from "../db";

interface BlogMetadata {
  filename: string;
  title: string;
  readTime: number;
  subject: string;
}

// Example D1 schema for blog metadata
// CREATE TABLE blog_metadata (filename TEXT PRIMARY KEY, title TEXT, readTime INTEGER, subject TEXT);

export const blogRoute = new Hono<{ Bindings: Env }>()
  .use("*", dbMiddleware)

  // GET all blog metadata from D1
  .get("/", async (c) => {
    try {
      const { results } = await c.env.DB.prepare(
        "SELECT filename, title, readTime, subject FROM blog_metadata ORDER BY filename"
      ).all();
      return c.json({ blogs: results });
    } catch (error) {
      console.error("Error fetching blog metadata:", error);
      return c.json({ error: "Failed to fetch blog metadata" }, 500);
    }
  })

  // GET test route for local 1.mdx file (server-rendered)
  .get("/test", async (c) => {
    const code = String(await compile("# hi", { outputFormat: "function-body" }));
    return c.json(code);
  })

  // GET a single blog MDX file (server-rendered)
  .get("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const isLocal = c.req.query("local") === "true";

    let fileContent: string;

    try {
      const object = await c.env.R2.get(`blogs/${filename}`);
      if (!object) {
        return c.json({ error: "File not found" }, 404);
      }
      fileContent = await object.text();

      const result = await renderMDXContent(fileContent);
      return c.json(result);
    } catch (err) {
      console.error("Error rendering blog:", err);
      return c.json({ error: "Failed to render blog" }, 500);
    }
  })

  // PUT a blog MDX file and update metadata in D1
  .put("/:filename{.+\\.mdx}", async (c) => {
    const filename = c.req.param("filename");
    const body = await c.req.text();

    try {
      // Save file to R2
      await c.env.R2.put(`blogs/${filename}`, body);

      // Parse frontmatter for metadata
      const metadata = parseFrontMatter(body);

      // Upsert metadata into D1
      await c.env.DB.prepare(
        `INSERT INTO blog_metadata (filename, title, readTime, subject)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(filename) DO UPDATE SET 
         title=excluded.title, 
         readTime=excluded.readTime, 
         subject=excluded.subject`
      )
        .bind(filename, metadata.title, metadata.readTime, metadata.subject)
        .run();

      return c.json({
        ok: true,
        filename,
        metadata: {
          title: metadata.title,
          readTime: metadata.readTime,
          subject: metadata.subject,
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
      await c.env.R2.delete(`blogs/${filename}`);

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

// Efficient MDX server-side rendering function
async function renderMDXContent(content: string): Promise<{
  html: string;
  metadata: { title: string; readTime: number; subject: string };
}> {
  try {
    // Parse frontmatter
    const metadata = parseFrontMatter(content);

    // Remove frontmatter for compilation
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]+?\n---\n/, "");

    // Compile MDX to JavaScript
    const compiled = await compile(contentWithoutFrontmatter, {
      format: "mdx",
      development: false,
      outputFormat: "function-body",
      // Add any custom plugins here if needed
      remarkPlugins: [],
      rehypePlugins: [],
    });

    // Execute the compiled MDX
    const { default: MDXContent } = await run(compiled, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    // Create React element from MDX
    const element = createElement(MDXContent);

    // Render to HTML string (content only, no wrapper)
    const html = renderToString(element);

    return {
      html,
      metadata,
    };
  } catch (error) {
    console.error("Error rendering MDX:", error);
    throw new Error(`Failed to render MDX: ${error.message}`);
  }
}

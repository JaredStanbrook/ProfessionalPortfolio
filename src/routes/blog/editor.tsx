// routes/blog/editor.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const editorSearchSchema = z.object({
  filename: z.string().optional(),
});

export const Route = createFileRoute("/blog/editor")({
  validateSearch: editorSearchSchema,
  component: BlogEditor,
});

function BlogEditor() {
  const navigate = useNavigate();
  const { filename } = Route.useSearch();

  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [currentFilename, setCurrentFilename] = useState(filename || "");
  const [isLoading, setIsLoading] = useState(false);

  // Load existing blog if filename is provided
  useEffect(() => {
    if (filename) {
      loadBlog(filename);
    }
  }, [filename]);

  const loadBlog = async (file: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/${file}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.metadata.title);
        setReadTime(data.metadata.readTime);
        setSubject(data.metadata.subject);
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      alert("Failed to load blog");
    } finally {
      setIsLoading(false);
    }
  };

  // Parse content without frontmatter for preview
  const contentWithoutFrontmatter = useMemo(() => {
    return content.replace(/^---\n[\s\S]+?\n---\n/, "");
  }, [content]);

  const generateMDX = () => {
    return `---
title: "${title}"
readTime: ${readTime}
subject: "${subject}"
---

${content}`;
  };

  const handleSave = async () => {
    if (!currentFilename) {
      alert("Please enter a filename");
      return;
    }

    if (!currentFilename.endsWith(".mdx")) {
      alert("Filename must end with .mdx");
      return;
    }

    if (!title || !subject) {
      alert("Please fill in all metadata fields");
      return;
    }

    setIsLoading(true);
    try {
      const mdxContent = generateMDX();
      const response = await fetch(`/api/blog/${currentFilename}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: mdxContent,
      });

      if (response.ok) {
        alert("Blog saved successfully!");
        navigate({ to: "/blog" });
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Editor</h1>
        <button
          onClick={() => navigate({ to: "/blog" })}
          className="px-4 py-2 text-gray-600 hover:text-gray-900">
          ← Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
              <input
                type="text"
                value={currentFilename}
                onChange={(e) => setCurrentFilename(e.target.value)}
                placeholder="my-blog-post.mdx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Blog Post"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Technology, Design, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content (MDX)</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here using MDX syntax..."
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium">
              {isLoading ? "Saving..." : "Save Blog"}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

          <div className="prose max-w-none">
            <div className="mb-4 p-4 bg-gray-50 rounded border">
              <h3 className="text-lg font-semibold">{title || "Untitled"}</h3>
              <div className="text-sm text-gray-600">
                {readTime} min read • {subject || "No subject"}
              </div>
            </div>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {contentWithoutFrontmatter}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

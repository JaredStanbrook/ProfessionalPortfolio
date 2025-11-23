import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/editor/")({
  component: NewBlogEditor,
});

function NewBlogEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Parse content without frontmatter for preview
  const contentWithoutFrontmatter = useMemo(() => {
    // Only remove frontmatter if it exists and looks correctly formatted
    return content.replace(/^---\n[\s\S]+?\n---\n/, "").trim();
  }, [content]);

  const generateMDX = () => {
    return `---
title: "${title.trim()}"
readTime: ${readTime}
subject: "${subject.trim()}"
---

${content.trim()}`;
  };

  const handleSave = async () => {
    const trimmedFilename = filename.trim();
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();
    const trimmedContent = content.trim();

    // Validation
    if (!trimmedFilename) {
      toast.error("Please enter a filename.");
      return;
    }

    if (!trimmedFilename.endsWith(".mdx")) {
      toast.error("Filename must end with .mdx");
      return;
    }

    if (!trimmedTitle || !trimmedSubject) {
      toast.error("Please fill in the Title and Subject metadata fields.");
      return;
    }

    if (!trimmedContent) {
      toast.error("The blog content cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const mdxContent = generateMDX();
      const response = await fetch(`/api/blog/${trimmedFilename}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: mdxContent,
      });

      if (response.ok) {
        toast.success("Blog created successfully!");
        const slug = trimmedFilename.replace(".mdx", "");
        navigate({ to: "/blog/$slug", params: { slug } });
      } else {
        const error = await response.json();
        toast.error(`Failed to save: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("A network error occurred while creating the blog.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="container py-12 flex flex-col mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Metadata Section */}
          <div className="rounded-lg border shadow-lg p-6 space-y-4 bg-card">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Metadata</h2>

            <div>
              <Label htmlFor="filename">
                Filename <span className="text-red-500">*</span>
              </Label>
              <Input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-blog-post.mdx"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be the URL slug. Use lowercase with hyphens (e.g., my-first-post.mdx)
              </p>
            </div>

            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Blog Post"
                required
              />
            </div>

            <div>
              <Label htmlFor="readTime">
                Read Time (minutes) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="readTime"
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Technology, Design, etc."
                required
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="rounded-lg border shadow-lg p-6 bg-card">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Content (MDX)</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Write your heading here

This is a paragraph with **bold** and *italic* text.

## Subheading

### Lists work too:
- Item 1
- Item 2

```javascript
// Code blocks are supported
console.log('Hello, world!');
```"
              className="w-full h-96 min-h-[300px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background font-mono text-sm resize-y"
            />
          </div>

          <div className="flex gap-3 pb-12">
            <Button onClick={handleSave} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg border shadow-lg p-6 bg-card lg:sticky lg:top-24 lg:max-h-[85vh] lg:overflow-y-auto">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">Live Preview</h2>

          <div className="mb-4 p-4 rounded border bg-muted/50">
            <h3 className="text-xl font-bold">{title || "Untitled"}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              {readTime} min read • {subject || "No subject"}
            </div>
          </div>

          <div
            className="markdown-content prose dark:prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:border-b prose-headings:pb-1 prose-headings:mb-3
            prose-h1:text-3xl prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mt-6
            prose-h3:text-xl prose-h3:mt-4
            prose-p:text-base prose-p:my-4
            prose-a:text-primary hover:prose-a:text-primary/80
            prose-strong:font-bold
            prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {contentWithoutFrontmatter || "*Start typing to see preview...*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

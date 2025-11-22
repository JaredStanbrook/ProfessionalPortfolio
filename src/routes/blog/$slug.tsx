// routes/blog/$slug.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogView,
});

interface BlogData {
  content: string;
  metadata: {
    title: string;
    readTime: number;
    subject: string;
    createdAt: string;
    updatedAt: string;
  };
}

function BlogView() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Add .mdx extension back for API call
        const filename = `${slug}.mdx`;
        const response = await fetch(`/api/blog/${filename}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog post not found");
          } else {
            setError("Failed to load blog post");
          }
          return;
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{error || "Blog not found"}</h1>
          <button
            onClick={() => navigate({ to: "/" })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              {blog.metadata.subject}
            </span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{blog.metadata.readTime} min read</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">Jared Stanbrook</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(blog.metadata.createdAt)}
            </span>
            {blog.metadata.createdAt !== blog.metadata.updatedAt && (
              <>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground italic">
                  Updated {formatDate(blog.metadata.updatedAt)}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            {blog.metadata.title}
          </h1>
          {/* Content */}
          <article
            className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-foreground 
          prose-p:text-muted-foreground
          prose-a:text-primary hover:prose-a:text-primary/80
          prose-strong:text-foreground
          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-muted prose-pre:border prose-pre:border-border
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          prose-img:rounded-lg prose-img:shadow-lg
          prose-hr:border-border
        ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { CardContent } from "@/components/ui/card";
import { HighlightCard } from "@/components/ui/highlight-card";

export const Route = createFileRoute("/")({
  component: Homepage,
});

interface MousePosition {
  x: number;
  y: number;
}

interface CursorState {
  position: MousePosition;
  scale: number;
  isAttracted: boolean;
}

interface BlogMetadata {
  filename: string;
  title: string;
  readTime: number;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

function Homepage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    position: { x: 0, y: 0 },
    scale: 1,
    isAttracted: false,
  });
  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const titleRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  // Constants
  const CURSOR_SCALE_MULTIPLIER = 35;
  const MAGNETIC_RADIUS = 400;
  const MAGNETIC_STRENGTH = 1;
  const MAX_DISTANCE_RADIUS = 150;

  // Fetch blog metadata on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (response.ok) {
          const data = await response.json();
          setBlogs(data.blogs || []);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getDistance = useCallback((x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);

  const getTitleRect = useCallback(() => {
    if (!titleRef.current) return null;
    return titleRef.current.getBoundingClientRect();
  }, []);

  const calculateCursorState = useCallback(
    (mousePosition: MousePosition): CursorState => {
      const rect = getTitleRect();
      if (!rect) return { position: mousePosition, scale: 1, isAttracted: false };

      const dx = Math.max(rect.left - mousePosition.x, 0, mousePosition.x - rect.right);
      const dy = Math.max(rect.top - mousePosition.y, 0, mousePosition.y - rect.bottom);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const inside =
        mousePosition.x >= rect.left &&
        mousePosition.x <= rect.right &&
        mousePosition.y >= rect.top &&
        mousePosition.y <= rect.bottom;

      let scale = 1;
      if (inside || distance <= MAX_DISTANCE_RADIUS) {
        const proximityProgress = 1 - Math.min(distance / MAX_DISTANCE_RADIUS, 1);
        scale = 1 + proximityProgress * CURSOR_SCALE_MULTIPLIER;
      }

      let position = mousePosition;
      let isAttracted = false;

      if ((inside || distance < MAGNETIC_RADIUS) && distance > 0) {
        const closestX = Math.max(rect.left, Math.min(mousePosition.x, rect.right));
        const closestY = Math.max(rect.top, Math.min(mousePosition.y, rect.bottom));
        const force = 1 - distance / MAGNETIC_RADIUS;
        const pullStrength = force * MAGNETIC_STRENGTH;

        const pullX = (closestX - mousePosition.x) * pullStrength;
        const pullY = (closestY - mousePosition.y) * pullStrength;

        position = {
          x: mousePosition.x + pullX,
          y: mousePosition.y + pullY,
        };

        isAttracted = true;
      } else if (inside) {
        isAttracted = true;
      }

      return { position, scale, isAttracted };
    },
    [getTitleRect]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    let targetCursorState: CursorState = cursorState;

    const animate = (): void => {
      targetCursorState = calculateCursorState(mousePos);

      setCursorState((prevState) => {
        const lerpFactor = 0.15;

        return {
          position: {
            x:
              prevState.position.x +
              (targetCursorState.position.x - prevState.position.x) * lerpFactor,
            y:
              prevState.position.y +
              (targetCursorState.position.y - prevState.position.y) * lerpFactor,
          },
          scale: prevState.scale + (targetCursorState.scale - prevState.scale) * lerpFactor,
          isAttracted: targetCursorState.isAttracted,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, calculateCursorState]);

  const handleTitleClick = useCallback((): void => {
    if (!titleRef.current) return;

    titleRef.current.style.transform = "scale(0.95)";
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.transform = "";
      }
    }, 200);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBlogClick = (filename: string) => {
    // Remove .mdx extension for URL
    const slug = filename.replace(".mdx", "");
    navigate({ to: "/blog/$slug", params: { slug } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-muted-foreground">
      {/* Custom Cursor */}
      <div
        className={`hidden md:block fixed w-5 h-5 rounded-full pointer-events-none z-0
    transition-all duration-300 ease-out
    ${hoveringTitle ? "bg-primary" : cursorState.isAttracted ? "bg-primary/80" : "bg-foreground/80"}
  `}
        style={{
          left: `${cursorState.position.x}px`,
          top: `${cursorState.position.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorState.scale})`,
          willChange: "transform",
        }}
      />

      <section className="w-full flex flex-col items-left pt-6 gap-2 z-40">
        <div className="overflow-hidden">
          <span
            ref={titleRef}
            onClick={() => {
              handleTitleClick();
              navigate({ to: "/about" });
            }}
            onMouseEnter={() => setHoveringTitle(true)}
            onMouseLeave={() => setHoveringTitle(false)}
            className={`
              text-2xl md:text-4xl font-extrabold tracking-tight text-foreground cursor-pointer
              transition-all duration-300 select-none block whitespace-nowrap overflow-visible
              ${typeof window !== "undefined" && window.innerWidth < 768 ? "scroll-text" : ""}
            `}
            role="button"
            tabIndex={0}>
            <span className="hidden md:inline">
              {cursorState.scale > 1.1 ? "Learn more about me." : "I'm Jared"}
            </span>
            <span className="inline md:hidden">I'm Jared. Learn more about me.</span>
            <span className="inline md:hidden ml-30">Click Me.</span>
          </span>
        </div>
        <hr className="w-full border-t-2 border-foreground opacity-30 self-center" />
      </section>

      <section className="w-full flex flex-col items-center pt-12 gap-8">
        <div className="flex flex-col justify-center w-full md:w-1/2 self-start">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Welcome</h1>

          <p className="uppercase text-lg md:text-xl font-semibold mb-2 text-foreground">My Blog</p>

          <p className="mt-2 text-lg md:text-xl text-muted-foreground text-justify">
            Sharing my progress, projects, and insights.
          </p>
        </div>

        <div className="flex flex-col justify-center w-full md:w-1/2 self-end">
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-justify">
            Dive into my journey as I explore, experiment, and grow. Here you'll find hands-on labs,
            project breakdowns, and reflections on what I'm learning as a student and aspiring
            professional.
          </p>
        </div>
      </section>

      <main className="py-8 w-full">
        <div className="w-full flex items-center justify-center my-4">
          <span className="text-xl font-semibold tracking-widest text-foreground mr-4">Recent</span>
          <hr className="w-full border-t-2 border-foreground opacity-30 self-center" />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No blogs found. Create your first one!
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 auto-rows-fr">
            {blogs.map((blog, index) => (
              <HighlightCard
                key={blog.filename}
                size={index === 1 ? "big" : "small"}
                onClick={() => handleBlogClick(blog.filename)}
                tabIndex={index}
                role="button">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <span className="inline-block text-xs mb-2">
                      <span className="py-1 px-2 rounded-full bg-foreground text-background font-semibold">
                        {blog.subject}
                      </span>
                      <span className="ml-1 text-muted-foreground align-middle">
                        • {blog.readTime} min read
                      </span>
                    </span>
                    <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
                  </div>
                  <div className="text-sm mt-4">Jared Stanbrook • {formatDate(blog.createdAt)}</div>
                </CardContent>
              </HighlightCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/blog/2")({
  component: BlogPost,
});

function BlogPost() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              Reflection
            </span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">2 min read</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">Jared Stanbrook</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">Nov 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Teamwork Makes the Dream Work
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
            According to My Grandma and Me
          </h2>

          {/* Body */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Originally, I was certain that my grandma coined this phrase, but after a quick
              DuckDuckGo search I can see I've been lied to. None the less, the quote is something
              that comes to mind every single time I find myself working in a team.
              <br />
              <br />
              Now, I haven't read Teamwork Makes the Dream Work by John C. Maxwell, but regardless,
              I believe the saying to be true. I've seen it time and time again: working in teams
              works. It's an essential skill for anyone to have, and one we all get the opportunity
              to hone and develop, whether it's through team sports, teams at work, or even when
              university shoves group assignments down our throats. Personally, those have always
              been rewarding experiences for me.
              <br />
              <br />
              Of course, the outcome of working in a group is completely a personal matter. Whether
              the experience ends up positive or negative, there's always a lesson to be learned
              though, in a cliché way, that applies to just about everything in life.
              <br />
              <br />
              My most recent rewarding experience was exactly that: a group project at university.
              It involved myself and a team of six building our final-year project. This was a grand
              and exhilarating triumph to finish our bachelor degree, a moment I'll certainly
              remember forever. We collated all the knowledge and skills we'd spent years
              fine-tuning into one single project. Everyone's strengths showed naturally.
              <br />
              <br />
              In the end, the project became more than just another grade. It became a plaque my
              team and I could hold up proudly, showing off our software development and project
              management skills. It was proof of what collaboration, shared vision, and a bit of
              chaos-turned-cooperation can produce.
              <br />
              <br />
              If there's one thing I've learned, it's that teamwork really does make the dream work,
              maybe not because the quote sounds nice, but because behind every great achievement is
              usually a group of people pushing each other just a little further than they could go
              alone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

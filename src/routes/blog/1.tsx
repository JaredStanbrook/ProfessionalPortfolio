import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/blog/1")({
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
            <span className="text-muted-foreground text-sm">8 min read</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">Jared Stanbrook</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">June 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            The Spark
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
            Why I Chose Cybersecurity
          </h2>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every journey has a spark—a moment that ignites curiosity and sets you on a new path.
              For me, that spark was realizing just how much technology shapes our world, and how
              critical it is to protect it. This is my reflection on what drew me to cybersecurity
              and why I'm passionate about building a safer digital future.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-12 lg:gap-16">
          {/* The Beginning */}
          <Card className="border-l-4 border-l-primary bg-card/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                The Beginning
              </h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  My fascination with cybersecurity began with a simple question:{" "}
                  <em>"How do things break, and how can we fix them?"</em>I was captivated by
                  stories of digital cat-and-mouse games between attackers and defenders, each side
                  constantly evolving their tactics.
                </p>
                <p>
                  What started as curiosity about "hacking" quickly evolved into a deeper
                  appreciation for the complexity of security. I realized that cybersecurity isn't
                  just about technology—it's about psychology, risk management, and the delicate
                  balance between accessibility and protection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Moments */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/30 hover:bg-card/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Pivotal Moments</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "First CTF Competition",
                      desc: "Discovered the thrill of solving security puzzles",
                    },
                    {
                      title: "Home Lab Setup",
                      desc: "Built my testing environment to safely explore vulnerabilities",
                    },
                    {
                      title: "Ethical Hacking Course",
                      desc: "Learned the principles of responsible disclosure",
                    },
                    {
                      title: "Security Community",
                      desc: "Connected with mentors and fellow enthusiasts",
                    },
                  ].map((moment, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{moment.title}</h4>
                        <p className="text-muted-foreground text-sm">{moment.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/30 hover:bg-card/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Core Motivations</h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-medium text-foreground mb-1">Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      The threat landscape evolves daily, ensuring I'm always growing and adapting.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-medium text-foreground mb-1">Real Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Protecting people's data and privacy feels meaningful and necessary.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-medium text-foreground mb-1">Problem Solving</h4>
                    <p className="text-sm text-muted-foreground">
                      Every security challenge is a puzzle waiting to be solved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* The Bigger Picture */}
          <Card className="bg-gradient-to-r from-card/20 to-card/40 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">The Bigger Picture</h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  Cybersecurity is fundamentally about trust. Every time someone enters their
                  password, makes an online purchase, or shares personal information, they're
                  placing trust in systems that security professionals work tirelessly to protect.
                </p>
                <p className="mb-4">
                  This field attracts people who understand that with great connectivity comes great
                  responsibility. We're the guardians of digital trust, working behind the scenes to
                  ensure that innovation can flourish safely.
                </p>
                <p>
                  That original spark of curiosity has grown into a deep commitment to this mission.
                  Every day brings new challenges, new threats to understand, and new ways to build
                  a more secure digital world. The journey is just beginning.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-12 h-px bg-border"></div>
              <span className="text-sm">What sparked your journey?</span>
              <div className="w-12 h-px bg-border"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

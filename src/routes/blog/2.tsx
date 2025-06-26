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
            <span className="text-muted-foreground text-sm">12 min read</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">Jared Stanbrook</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">June 2025</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            The Team I Want
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
            Building the Kind of Cybersecurity Culture That Actually Works
          </h2>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              After four years studying IT and majoring in security at Murdoch University, I've
              learned about attack vectors, defensive strategies, and technical tools. But what
              matters most isn't found in any textbook—it's the culture of the team you join. As I
              step into the industry, I'm reflecting on what kind of cybersecurity team I want to be
              part of.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-12 lg:gap-16">
          {/* Collaboration Over Competition */}
          <Card className="border-l-4 border-l-primary bg-card/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Collaboration Over Competition
              </h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  Cybersecurity can feel like a solo mission—chasing flags in CTFs, dissecting
                  forensic images, writing detection rules in isolation. But the real impact happens
                  when diverse skills converge. The team I want to join thrives on collective
                  intelligence, not individual heroics.
                </p>
                <div className="bg-muted/30 rounded-lg p-4 my-6">
                  <h4 className="font-semibold text-foreground mb-3">What This Looks Like:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Asking questions is seen as strength, not weakness
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Pairing up on complex problems is the default approach
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Knowledge sharing happens naturally, not reluctantly
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Credit is shared when wins happen
                    </li>
                  </ul>
                </div>
                <p>
                  I've experienced this firsthand working through OWASP Juice Shop challenges with
                  classmates. When someone shares a clever technique or explains a concept clearly,
                  everyone levels up. That's the multiplier effect I want to be part of.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Culture */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/30 hover:bg-card/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  A Learning-First Mindset
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm">
                    The threat landscape evolves faster than any individual can keep up with. The
                    teams that thrive are those that learn together, fail fast, and adapt quickly.
                  </p>
                  <div className="space-y-3">
                    <div className="border-l-2 border-primary/30 pl-3">
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        Blameless Post-Mortems
                      </h4>
                      <p className="text-xs">Learning from incidents without pointing fingers</p>
                    </div>
                    <div className="border-l-2 border-primary/30 pl-3">
                      <h4 className="font-medium text-foreground text-sm mb-1">Curiosity Budget</h4>
                      <p className="text-xs">
                        Time allocated for exploring new tools and techniques
                      </p>
                    </div>
                    <div className="border-l-2 border-primary/30 pl-3">
                      <h4 className="font-medium text-foreground text-sm mb-1">Cross-Training</h4>
                      <p className="text-xs">Everyone learns beyond their primary specialty</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/30 hover:bg-card/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Diverse Perspectives</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm">
                    The best security comes from teams with varied backgrounds, experiences, and
                    ways of thinking. Homogeneous teams create blind spots.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/20 rounded p-2 text-center">Technical Depth</div>
                    <div className="bg-muted/20 rounded p-2 text-center">Business Context</div>
                    <div className="bg-muted/20 rounded p-2 text-center">Red Team Thinking</div>
                    <div className="bg-muted/20 rounded p-2 text-center">Blue Team Operations</div>
                    <div className="bg-muted/20 rounded p-2 text-center">Risk Assessment</div>
                    <div className="bg-muted/20 rounded p-2 text-center">User Experience</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-World Application */}
          <Card className="bg-gradient-to-r from-card/20 to-card/40 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">From Theory to Practice</h3>
              <div className="prose prose-lg max-w-none text-muted-foreground mb-6">
                <p>
                  University gave me the fundamentals, but I wanted to understand how these
                  principles work in practice. So I built a home SIEM lab—not just to learn Splunk,
                  but to experience the workflow of a security operations team.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What I Built</h4>
                  <div className="space-y-2">
                    {[
                      "Provisioned VMs and installed Splunk Enterprise",
                      "Configured multiple log sources (syslog, Windows events)",
                      "Created dashboards for real-time monitoring",
                      "Developed custom alerts and automated responses",
                      "Simulated attack scenarios to test detection",
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Key Insights</h4>
                  <div className="space-y-3">
                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Data Quality Matters:</strong> Perfect
                        detection rules are useless if your log ingestion is inconsistent.
                      </p>
                    </div>
                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Context is Everything:</strong> Alerts
                        without business context lead to alert fatigue and missed threats.
                      </p>
                    </div>
                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Iteration Over Perfection:</strong>{" "}
                        Start with basic detection, then refine based on real data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Human Element */}
          <Card className="border-l-4 border-l-secondary bg-card/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                The Human Element
              </h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  Building this lab solo taught me technical skills, but it also highlighted
                  something crucial: cybersecurity is fundamentally a team sport. The most
                  sophisticated tools mean nothing without the right people using them.
                </p>
                <p className="mb-4">
                  I want to join a team that understands this—one that invests in relationships,
                  communication, and shared ownership of outcomes. Where senior members mentor
                  newcomers not out of obligation, but because they know it makes everyone better.
                </p>
                <blockquote className="border-l-4 border-primary/30 pl-4 italic">
                  "The best security teams I've observed treat every incident as a learning
                  opportunity, every new hire as a fresh perspective, and every challenge as a
                  chance to grow together."
                </blockquote>
              </div>
            </CardContent>
          </Card>

          {/* Looking Forward */}
          <div className="text-center py-8">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">What I Bring</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  I'm looking for a team that values growth, collaboration, and impact. In return, I
                  bring curiosity, willingness to learn, and a commitment to lifting others up.
                  Because the best cybersecurity isn't built by lone wolves—it's built by packs.
                </p>
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-px bg-border"></div>
                  <span className="text-sm">Ready to contribute and grow</span>
                  <div className="w-12 h-px bg-border"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

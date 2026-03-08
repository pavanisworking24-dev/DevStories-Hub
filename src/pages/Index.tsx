import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Briefcase, Code2, Mic2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { icon: Trophy, label: "Hackathons", description: "Share your hackathon wins, struggles, and breakthroughs", color: "text-amber-500" },
  { icon: Briefcase, label: "Interviews", description: "Real interview experiences with questions and prep tips", color: "text-blue-500" },
  { icon: Code2, label: "Projects", description: "Document your project journey from idea to deployment", color: "text-emerald-500" },
  { icon: Mic2, label: "Conferences", description: "Best talks, networking tips, and workshop insights", color: "text-rose-500" },
];

const Index = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero */}
      <section className="space-y-4 pt-8 text-center sm:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border bg-accent/50 px-4 py-1.5 text-sm font-medium text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Career Mentorship
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Real Tech Stories.<br />
          <span className="text-primary">Real Wisdom.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A community where students and professionals share structured hackathon, interview, project, and conference experiences — powered by AI that synthesizes collective wisdom.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <Link to="/explore">
              Explore Stories <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/create">Share Yours</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link key={cat.label} to={`/explore?category=${cat.label.toLowerCase()}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-md card-glow hover:-translate-y-0.5">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`rounded-lg bg-accent p-2.5 ${cat.color}`}>
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Mentor CTA */}
      <section>
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-accent to-background card-glow">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">AI Mentor Mode</h3>
              <p className="mt-1 text-muted-foreground">
                Ask questions and get answers synthesized from real community experiences, with citations.
              </p>
            </div>
            <Button asChild>
              <Link to="/mentor">Try AI Mentor</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;

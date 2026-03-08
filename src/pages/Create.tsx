import { useState } from "react";
import { Trophy, Briefcase, Code2, Mic2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const templates = [
  { id: "hackathon", icon: Trophy, label: "Hackathon", description: "Share your hackathon experience", color: "text-amber-500" },
  { id: "interview", icon: Briefcase, label: "Interview", description: "Document your interview journey", color: "text-blue-500" },
  { id: "project", icon: Code2, label: "Project", description: "Showcase your project story", color: "text-emerald-500" },
  { id: "conference", icon: Mic2, label: "Conference", description: "Share conference insights", color: "text-rose-500" },
];

const Create = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Share Your Experience</h1>
        <p className="mt-1 text-muted-foreground">Choose a template to get started</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => (
          <Card
            key={t.id}
            className={cn(
              "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md card-glow",
              selected === t.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelected(t.id)}
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`rounded-lg bg-accent p-2.5 ${t.color}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              {selected.charAt(0).toUpperCase() + selected.slice(1)} form coming soon — database setup in progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Create;

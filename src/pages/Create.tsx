import { useState } from "react";
import { Trophy, Briefcase, Code2, Mic2, GraduationCap, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const templates = [
  { id: "hackathon" as const, icon: Trophy, label: "Hackathon", description: "Share your hackathon experience", color: "text-amber-500" },
  { id: "interview" as const, icon: Briefcase, label: "Interview", description: "Document your interview journey", color: "text-blue-500" },
  { id: "project" as const, icon: Code2, label: "Project", description: "Showcase your project story", color: "text-emerald-500" },
  { id: "conference" as const, icon: Mic2, label: "Conference", description: "Share conference insights", color: "text-rose-500" },
  { id: "exam" as const, icon: GraduationCap, label: "Exam", description: "Share exam experiences (TCS NQT, NPTEL, IELTS, etc.)", color: "text-violet-500" },
];

type ExperienceType = "hackathon" | "interview" | "project" | "conference" | "exam";

const Create = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ExperienceType | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});

  const setField = (key: string, value: string) => setFields((f) => ({ ...f, [key]: value }));
  const f = (key: string) => fields[key] || "";

  const buildContent = () => {
    const gh = f("github_link").trim() || undefined;
    switch (selected) {
      case "hackathon":
        return { description: f("description"), team_size: f("team_size"), duration: f("duration"), tech_stack: f("tech_stack").split(",").map(s => s.trim()).filter(Boolean), result: f("result"), what_went_well: f("what_went_well"), challenges: f("challenges"), lessons: f("lessons"), github_link: gh };
      case "interview":
        return { description: f("description"), company: f("company"), role: f("role"), rounds: f("rounds"), questions: f("questions"), outcome: f("outcome"), preparation: f("preparation"), tips: f("tips"), github_link: gh };
      case "project":
        return { description: f("description"), tech_stack: f("tech_stack").split(",").map(s => s.trim()).filter(Boolean), duration: f("duration"), challenges: f("challenges"), outcome: f("outcome"), link: f("link"), github_link: gh };
      case "conference":
        return { description: f("description"), name: f("name"), location: f("location"), talks: f("talks"), networking: f("networking"), takeaways: f("takeaways"), github_link: gh };
      case "exam":
        return { description: f("description"), exam_name: f("exam_name"), platform: f("platform"), duration: f("duration"), score: f("score"), preparation_strategy: f("preparation_strategy"), resources: f("resources"), tips: f("tips"), takeaways: f("takeaways"), github_link: gh };
      default:
        return {};
    }
  };

  const handleSubmit = async () => {
    if (!user || !selected || !title.trim()) {
      toast.error("Please fill in at least the title");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("experiences").insert({
      title, type: selected, content: buildContent(), author_id: user.id, difficulty: difficulty || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to create experience: " + error.message); }
    else { toast.success("Experience shared!"); navigate("/explore"); }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <h2 className="text-xl font-semibold">Sign in to share experiences</h2>
        <Button className="mt-4" asChild><Link to="/auth">Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Share Your Experience</h1>
        <p className="mt-1 text-muted-foreground">Choose a template to get started</p>
      </div>

      {!selected ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <Card key={t.id} className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md card-glow" onClick={() => { setSelected(t.id); setFields({}); }}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className={`rounded-lg bg-accent p-2.5 ${t.color}`}><t.icon className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-semibold">{t.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setSelected(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to templates
          </Button>

          <Card>
            <CardContent className="space-y-4 p-6">
              <Field label="Title *"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your experience a catchy title" /></Field>
              <Field label="Difficulty">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Description"><Textarea value={f("description")} onChange={e => setField("description", e.target.value)} placeholder="Describe your experience..." rows={4} /></Field>

              {selected === "hackathon" && <HackathonFields f={f} setField={setField} />}
              {selected === "interview" && <InterviewFields f={f} setField={setField} />}
              {selected === "project" && <ProjectFields f={f} setField={setField} />}
              {selected === "conference" && <ConferenceFields f={f} setField={setField} />}
              {selected === "exam" && <ExamFields f={f} setField={setField} />}

              <Field label="GitHub Repository Link (optional)">
                <Input value={f("github_link")} onChange={e => setField("github_link", e.target.value)} placeholder="https://github.com/..." />
              </Field>

              <Button onClick={handleSubmit} disabled={submitting || !title.trim()} className="w-full">
                <Send className="mr-2 h-4 w-4" /> {submitting ? "Sharing..." : "Share Experience"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function HackathonFields({ f, setField }: { f: (k: string) => string; setField: (k: string, v: string) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Team Size"><Input value={f("team_size")} onChange={e => setField("team_size", e.target.value)} placeholder="e.g. 4" /></Field>
        <Field label="Duration"><Input value={f("duration")} onChange={e => setField("duration", e.target.value)} placeholder="e.g. 36 hours" /></Field>
      </div>
      <Field label="Tech Stack (comma-separated)"><Input value={f("tech_stack")} onChange={e => setField("tech_stack", e.target.value)} placeholder="React, Python, TensorFlow" /></Field>
      <Field label="Result"><Input value={f("result")} onChange={e => setField("result", e.target.value)} placeholder="e.g. 1st Place" /></Field>
      <Field label="What Went Well"><Textarea value={f("what_went_well")} onChange={e => setField("what_went_well", e.target.value)} rows={3} /></Field>
      <Field label="Challenges"><Textarea value={f("challenges")} onChange={e => setField("challenges", e.target.value)} rows={3} /></Field>
      <Field label="Key Lessons"><Textarea value={f("lessons")} onChange={e => setField("lessons", e.target.value)} rows={3} /></Field>
    </>
  );
}

function InterviewFields({ f, setField }: { f: (k: string) => string; setField: (k: string, v: string) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company"><Input value={f("company")} onChange={e => setField("company", e.target.value)} placeholder="e.g. Google" /></Field>
        <Field label="Role"><Input value={f("role")} onChange={e => setField("role", e.target.value)} placeholder="e.g. SWE L4" /></Field>
      </div>
      <Field label="Rounds"><Input value={f("rounds")} onChange={e => setField("rounds", e.target.value)} placeholder="e.g. 5 rounds" /></Field>
      <Field label="Questions Asked"><Textarea value={f("questions")} onChange={e => setField("questions", e.target.value)} rows={3} /></Field>
      <Field label="Outcome"><Input value={f("outcome")} onChange={e => setField("outcome", e.target.value)} placeholder="e.g. Offer received" /></Field>
      <Field label="How You Prepared"><Textarea value={f("preparation")} onChange={e => setField("preparation", e.target.value)} rows={3} /></Field>
      <Field label="Tips for Others"><Textarea value={f("tips")} onChange={e => setField("tips", e.target.value)} rows={3} /></Field>
    </>
  );
}

function ProjectFields({ f, setField }: { f: (k: string) => string; setField: (k: string, v: string) => void }) {
  return (
    <>
      <Field label="Tech Stack (comma-separated)"><Input value={f("tech_stack")} onChange={e => setField("tech_stack", e.target.value)} placeholder="React, Node.js, PostgreSQL" /></Field>
      <Field label="Duration"><Input value={f("duration")} onChange={e => setField("duration", e.target.value)} placeholder="e.g. 3 months" /></Field>
      <Field label="Challenges"><Textarea value={f("challenges")} onChange={e => setField("challenges", e.target.value)} rows={3} /></Field>
      <Field label="Outcome"><Textarea value={f("outcome")} onChange={e => setField("outcome", e.target.value)} rows={2} /></Field>
      <Field label="Project Link"><Input value={f("link")} onChange={e => setField("link", e.target.value)} placeholder="https://..." /></Field>
    </>
  );
}

function ConferenceFields({ f, setField }: { f: (k: string) => string; setField: (k: string, v: string) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Conference Name"><Input value={f("name")} onChange={e => setField("name", e.target.value)} placeholder="e.g. React Conf 2025" /></Field>
        <Field label="Location"><Input value={f("location")} onChange={e => setField("location", e.target.value)} placeholder="e.g. San Francisco, CA" /></Field>
      </div>
      <Field label="Best Talks / Sessions"><Textarea value={f("talks")} onChange={e => setField("talks", e.target.value)} rows={3} /></Field>
      <Field label="Networking Highlights"><Textarea value={f("networking")} onChange={e => setField("networking", e.target.value)} rows={3} /></Field>
      <Field label="Key Takeaways"><Textarea value={f("takeaways")} onChange={e => setField("takeaways", e.target.value)} rows={3} /></Field>
    </>
  );
}

function ExamFields({ f, setField }: { f: (k: string) => string; setField: (k: string, v: string) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Exam Name"><Input value={f("exam_name")} onChange={e => setField("exam_name", e.target.value)} placeholder="e.g. TCS NQT, NPTEL, IELTS" /></Field>
        <Field label="Platform / Organization"><Input value={f("platform")} onChange={e => setField("platform", e.target.value)} placeholder="e.g. TCS iON, Swayam" /></Field>
      </div>
      <Field label="Duration"><Input value={f("duration")} onChange={e => setField("duration", e.target.value)} placeholder="e.g. 3 hours" /></Field>
      <Field label="Score / Result"><Input value={f("score")} onChange={e => setField("score", e.target.value)} placeholder="e.g. 85/100, Band 7.5" /></Field>
      <Field label="Preparation Strategy"><Textarea value={f("preparation_strategy")} onChange={e => setField("preparation_strategy", e.target.value)} rows={3} placeholder="How did you prepare?" /></Field>
      <Field label="Resources Used"><Textarea value={f("resources")} onChange={e => setField("resources", e.target.value)} rows={3} placeholder="Books, websites, courses..." /></Field>
      <Field label="Tips for Others"><Textarea value={f("tips")} onChange={e => setField("tips", e.target.value)} rows={3} /></Field>
      <Field label="Key Takeaways"><Textarea value={f("takeaways")} onChange={e => setField("takeaways", e.target.value)} rows={3} /></Field>
    </>
  );
}

export default Create;

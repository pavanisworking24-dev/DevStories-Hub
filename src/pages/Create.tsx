import { useState } from "react";
import { Trophy, Briefcase, Code2, Mic2, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const templates = [
  { id: "hackathon" as const, icon: Trophy, label: "Hackathon", description: "Share your hackathon experience", color: "text-amber-500" },
  { id: "interview" as const, icon: Briefcase, label: "Interview", description: "Document your interview journey", color: "text-blue-500" },
  { id: "project" as const, icon: Code2, label: "Project", description: "Showcase your project story", color: "text-emerald-500" },
  { id: "conference" as const, icon: Mic2, label: "Conference", description: "Share conference insights", color: "text-rose-500" },
];

type ExperienceType = "hackathon" | "interview" | "project" | "conference";

const Create = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ExperienceType | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Hackathon fields
  const [teamSize, setTeamSize] = useState("");
  const [duration, setDuration] = useState("");
  const [hackTechStack, setHackTechStack] = useState("");
  const [result, setResult] = useState("");
  const [whatWentWell, setWhatWentWell] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");

  // Interview fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [rounds, setRounds] = useState("");
  const [questions, setQuestions] = useState("");
  const [outcome, setOutcome] = useState("");
  const [preparation, setPreparation] = useState("");
  const [tips, setTips] = useState("");

  // Project fields
  const [projTechStack, setProjTechStack] = useState("");
  const [projDuration, setProjDuration] = useState("");
  const [description, setDescription] = useState("");
  const [projChallenges, setProjChallenges] = useState("");
  const [projOutcome, setProjOutcome] = useState("");
  const [projLink, setProjLink] = useState("");

  // Conference fields
  const [confName, setConfName] = useState("");
  const [location, setLocation] = useState("");
  const [talks, setTalks] = useState("");
  const [networking, setNetworking] = useState("");
  const [takeaways, setTakeaways] = useState("");

  const buildContent = () => {
    switch (selected) {
      case "hackathon":
        return { team_size: teamSize, duration, tech_stack: hackTechStack.split(",").map(s => s.trim()).filter(Boolean), result, what_went_well: whatWentWell, challenges, lessons };
      case "interview":
        return { company, role, rounds, questions, outcome, preparation, tips };
      case "project":
        return { tech_stack: projTechStack.split(",").map(s => s.trim()).filter(Boolean), duration: projDuration, description, challenges: projChallenges, outcome: projOutcome, link: projLink };
      case "conference":
        return { name: confName, location, talks, networking, takeaways };
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
      title,
      type: selected,
      content: buildContent(),
      author_id: user.id,
      difficulty: difficulty || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to create experience: " + error.message);
    } else {
      toast.success("Experience shared!");
      navigate("/explore");
    }
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
            <Card key={t.id} className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md card-glow" onClick={() => setSelected(t.id)}>
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
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your experience a catchy title" />
              </div>

              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selected === "hackathon" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label>Team Size</Label><Input value={teamSize} onChange={e => setTeamSize(e.target.value)} placeholder="e.g. 4" /></div>
                    <div className="space-y-1.5"><Label>Duration</Label><Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 36 hours" /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Tech Stack (comma-separated)</Label><Input value={hackTechStack} onChange={e => setHackTechStack(e.target.value)} placeholder="React, Python, TensorFlow" /></div>
                  <div className="space-y-1.5"><Label>Result</Label><Input value={result} onChange={e => setResult(e.target.value)} placeholder="e.g. 1st Place" /></div>
                  <div className="space-y-1.5"><Label>What Went Well</Label><Textarea value={whatWentWell} onChange={e => setWhatWentWell(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Challenges</Label><Textarea value={challenges} onChange={e => setChallenges(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Key Lessons</Label><Textarea value={lessons} onChange={e => setLessons(e.target.value)} rows={3} /></div>
                </>
              )}

              {selected === "interview" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" /></div>
                    <div className="space-y-1.5"><Label>Role</Label><Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. SWE L4" /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Rounds</Label><Input value={rounds} onChange={e => setRounds(e.target.value)} placeholder="e.g. 5 rounds" /></div>
                  <div className="space-y-1.5"><Label>Questions Asked</Label><Textarea value={questions} onChange={e => setQuestions(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Outcome</Label><Input value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="e.g. Offer received" /></div>
                  <div className="space-y-1.5"><Label>How You Prepared</Label><Textarea value={preparation} onChange={e => setPreparation(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Tips for Others</Label><Textarea value={tips} onChange={e => setTips(e.target.value)} rows={3} /></div>
                </>
              )}

              {selected === "project" && (
                <>
                  <div className="space-y-1.5"><Label>Tech Stack (comma-separated)</Label><Input value={projTechStack} onChange={e => setProjTechStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" /></div>
                  <div className="space-y-1.5"><Label>Duration</Label><Input value={projDuration} onChange={e => setProjDuration(e.target.value)} placeholder="e.g. 3 months" /></div>
                  <div className="space-y-1.5"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
                  <div className="space-y-1.5"><Label>Challenges</Label><Textarea value={projChallenges} onChange={e => setProjChallenges(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Outcome</Label><Textarea value={projOutcome} onChange={e => setProjOutcome(e.target.value)} rows={2} /></div>
                  <div className="space-y-1.5"><Label>Project Link</Label><Input value={projLink} onChange={e => setProjLink(e.target.value)} placeholder="https://..." /></div>
                </>
              )}

              {selected === "conference" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label>Conference Name</Label><Input value={confName} onChange={e => setConfName(e.target.value)} placeholder="e.g. React Conf 2025" /></div>
                    <div className="space-y-1.5"><Label>Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Best Talks / Sessions</Label><Textarea value={talks} onChange={e => setTalks(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Networking Highlights</Label><Textarea value={networking} onChange={e => setNetworking(e.target.value)} rows={3} /></div>
                  <div className="space-y-1.5"><Label>Key Takeaways</Label><Textarea value={takeaways} onChange={e => setTakeaways(e.target.value)} rows={3} /></div>
                </>
              )}

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

export default Create;

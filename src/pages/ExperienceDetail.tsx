import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, ThumbsUp, Trophy, Briefcase, Code2, Mic2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  hackathon: Trophy,
  interview: Briefcase,
  project: Code2,
  conference: Mic2,
};

const typeColors: Record<string, string> = {
  hackathon: "text-amber-500",
  interview: "text-blue-500",
  project: "text-emerald-500",
  conference: "text-rose-500",
};

const fieldLabels: Record<string, string> = {
  team_size: "Team Size", duration: "Duration", tech_stack: "Tech Stack",
  result: "Result", what_went_well: "What Went Well", challenges: "Challenges",
  lessons: "Key Lessons", company: "Company", role: "Role", rounds: "Rounds",
  questions: "Questions Asked", outcome: "Outcome", preparation: "Preparation",
  tips: "Tips", description: "Description", link: "Project Link",
  name: "Conference Name", location: "Location", talks: "Best Talks",
  networking: "Networking", takeaways: "Key Takeaways",
};

const ExperienceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (id) fetchExperience();
  }, [id]);

  useEffect(() => {
    if (id && user) checkBookmark();
  }, [id, user]);

  const fetchExperience = async () => {
    const { data } = await supabase.from("experiences").select("*").eq("id", id).single();
    if (data) setExperience(data);
    setLoading(false);
  };

  const checkBookmark = async () => {
    const { data } = await supabase.from("bookmarks").select("id").eq("experience_id", id!).eq("user_id", user!.id).maybeSingle();
    setBookmarked(!!data);
  };

  const toggleBookmark = async () => {
    if (!user) { toast.error("Sign in to bookmark"); return; }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("experience_id", id!).eq("user_id", user.id);
      setBookmarked(false);
      toast.success("Bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({ experience_id: id!, user_id: user.id });
      setBookmarked(true);
      toast.success("Bookmarked!");
    }
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!experience) return <div className="py-20 text-center">Experience not found</div>;

  const Icon = typeIcons[experience.type] || Code2;
  const color = typeColors[experience.type] || "text-primary";
  const content = experience.content as Record<string, any>;

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" asChild><Link to="/explore"><ArrowLeft className="mr-2 h-4 w-4" />Back to Explore</Link></Button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`rounded-lg bg-accent p-2 ${color}`}><Icon className="h-5 w-5" /></div>
            <Badge variant="secondary">{experience.type}</Badge>
            {experience.difficulty && <Badge variant="outline" className="capitalize">{experience.difficulty}</Badge>}
            {experience.verified && <Badge className="bg-primary/10 text-primary">✓ Verified</Badge>}
          </div>
          <h1 className="text-3xl font-bold">{experience.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{experience.views} views</span>
            <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{experience.helpful_count} helpful</span>
          </div>
        </div>
        <Button variant={bookmarked ? "default" : "outline"} size="icon" onClick={toggleBookmark}>
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {Object.entries(content).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            const label = fieldLabels[key] || key;
            const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
            if (!displayValue.trim()) return null;

            return (
              <div key={key}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</h3>
                {key === "link" && displayValue ? (
                  <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{displayValue}</a>
                ) : (
                  <p className="whitespace-pre-wrap">{displayValue}</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceDetail;

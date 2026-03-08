import { useState, useEffect } from "react";
import { Bookmark, Eye, ThumbsUp, Trophy, Briefcase, Code2, Mic2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const typeIcons: Record<string, any> = { hackathon: Trophy, interview: Briefcase, project: Code2, conference: Mic2 };
const typeColors: Record<string, string> = { hackathon: "text-amber-500", interview: "text-blue-500", project: "text-emerald-500", conference: "text-rose-500" };

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookmarks();
    else setLoading(false);
  }, [user]);

  const fetchBookmarks = async () => {
    const { data: bks } = await supabase.from("bookmarks").select("experience_id").eq("user_id", user!.id);
    if (bks && bks.length > 0) {
      const ids = bks.map(b => b.experience_id);
      const { data: exps } = await supabase.from("experiences").select("*").in("id", ids);
      if (exps) setBookmarks(exps);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <Bookmark className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">Sign in to see bookmarks</h3>
        <Button className="mt-4" asChild><Link to="/auth">Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        <p className="mt-1 text-muted-foreground">Your saved experiences</p>
      </div>
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No bookmarks yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Save experiences to read later</p>
          <Button className="mt-4" asChild><Link to="/explore">Explore Stories</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((exp) => {
            const Icon = typeIcons[exp.type] || Code2;
            const color = typeColors[exp.type] || "text-primary";
            return (
              <Link key={exp.id} to={`/experience/${exp.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md card-glow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`rounded-lg bg-accent p-2.5 ${color}`}><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{exp.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary">{exp.type}</Badge>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{exp.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{exp.helpful_count}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;

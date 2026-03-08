import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Eye, ThumbsUp, Trophy, Briefcase, Code2, Mic2, GraduationCap, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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

const Explore = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, [tab]);

  const fetchExperiences = async () => {
    setLoading(true);
    let query = supabase.from("experiences").select("*").order("created_at", { ascending: false });
    if (tab !== "all") query = query.eq("type", tab as "hackathon" | "interview" | "project" | "conference");
    const { data, error } = await query;
    if (!error && data) setExperiences(data);
    setLoading(false);
  };

  const filtered = experiences.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Explore Experiences</h1>
        <p className="mt-1 text-muted-foreground">Discover real stories from the tech community</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search experiences..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="conference">Conferences</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading experiences...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No experiences found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to share your story!</p>
          <Button className="mt-4" asChild><Link to="/create">Share an Experience</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((exp) => {
            const Icon = typeIcons[exp.type] || Code2;
            const color = typeColors[exp.type] || "text-primary";
            return (
              <Link key={exp.id} to={`/experience/${exp.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 card-glow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`rounded-lg bg-accent p-2.5 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{exp.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{exp.type}</Badge>
                        {exp.difficulty && <span className="capitalize">{exp.difficulty}</span>}
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{exp.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{exp.helpful_count}</span>
                        {exp.verified && <Badge className="bg-primary/10 text-primary text-xs">✓ Verified</Badge>}
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

export default Explore;

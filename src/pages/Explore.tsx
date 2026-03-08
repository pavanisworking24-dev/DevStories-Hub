import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Explore = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Explore Experiences</h1>
        <p className="mt-1 text-muted-foreground">Discover real stories from the tech community</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search experiences, companies, tech stacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="conference">Conferences</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">No experiences yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Be the first to share your story!</p>
        <Button className="mt-4" asChild>
          <a href="/create">Share an Experience</a>
        </Button>
      </div>
    </div>
  );
};

export default Explore;

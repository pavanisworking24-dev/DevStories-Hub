import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        <p className="mt-1 text-muted-foreground">Your saved experiences</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Bookmark className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">No bookmarks yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Save experiences to read later</p>
        <Button className="mt-4" asChild>
          <Link to="/explore">Explore Stories</Link>
        </Button>
      </div>
    </div>
  );
};

export default Bookmarks;

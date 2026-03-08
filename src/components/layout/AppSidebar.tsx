import { Link, useLocation } from "react-router-dom";
import { Home, Compass, PenSquare, Bot, Bookmark, User, Settings, LogIn, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/create", icon: PenSquare, label: "Create" },
  { to: "/mentor", icon: Bot, label: "AI Mentor" },
  { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <Link to="/" className="flex items-center gap-2 px-2 pb-4" onClick={onNavigate}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Code2 className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">DevStories</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 border-t pt-4">
        <ThemeToggle />
        <Link
          to="/auth"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </div>
    </div>
  );
}

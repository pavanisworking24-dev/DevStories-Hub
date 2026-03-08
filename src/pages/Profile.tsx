import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile and see your stats</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">Sign in to view your profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">Create an account to start sharing experiences</p>
        <Button className="mt-4" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    </div>
  );
};

export default Profile;

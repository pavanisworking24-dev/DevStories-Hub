import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, Trophy, Briefcase, Code2, Mic2, GraduationCap, Bookmark, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  hackathon: Trophy,
  interview: Briefcase,
  project: Code2,
  conference: Mic2,
  exam: GraduationCap,
};

const typeColors: Record<string, string> = {
  hackathon: "text-amber-500",
  interview: "text-blue-500",
  project: "text-emerald-500",
  conference: "text-rose-500",
  exam: "text-violet-500",
};

const fieldLabels: Record<string, string> = {
  description: "Description", duration: "Duration", tech_stack: "Tech Stack",
  team_size: "Team Size", result: "Result", what_went_well: "What Went Well",
  challenges: "Challenges", lessons: "Key Lessons", company: "Company",
  role: "Role", rounds: "Rounds", questions: "Questions Asked",
  outcome: "Outcome", preparation: "Preparation", tips: "Tips",
  link: "Project Link", github_link: "GitHub Repository",
  name: "Conference Name", location: "Location", talks: "Best Talks",
  networking: "Networking", takeaways: "Key Takeaways",
  exam_name: "Exam Name", platform: "Platform / Organization",
  score: "Score / Result", resources: "Resources Used",
  preparation_strategy: "Preparation Strategy",
};

// Ordered field lists per type — description/overview first, details, outcomes, links last
const fieldOrder: Record<string, string[]> = {
  hackathon: ["description", "team_size", "duration", "tech_stack", "result", "what_went_well", "challenges", "lessons", "github_link"],
  interview: ["description", "company", "role", "rounds", "questions", "outcome", "preparation", "tips", "github_link"],
  project: ["description", "tech_stack", "duration", "challenges", "outcome", "link", "github_link"],
  conference: ["description", "name", "location", "talks", "networking", "takeaways", "github_link"],
  exam: ["description", "exam_name", "platform", "duration", "score", "preparation_strategy", "resources", "tips", "takeaways", "github_link"],
};

const linkFields = new Set(["link", "github_link"]);

const ExperienceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  // Voting
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(0);

  // Comments
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) fetchExperience();
  }, [id]);

  useEffect(() => {
    if (id && user) {
      checkBookmark();
      fetchUserVote();
    }
  }, [id, user]);

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const fetchExperience = async () => {
    const { data } = await supabase.from("experiences").select("*").eq("id", id).single();
    if (data) {
      setExperience(data);
      setHelpfulCount(data.helpful_count);
    }
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

  // Voting
  const fetchUserVote = async () => {
    const { data } = await supabase.from("votes").select("value").eq("experience_id", id!).eq("user_id", user!.id).maybeSingle();
    setUserVote(data?.value as "up" | "down" | null);
  };

  const handleVote = async (value: "up" | "down") => {
    if (!user) { toast.error("Sign in to vote"); return; }
    if (userVote === value) {
      // Remove vote
      await supabase.from("votes").delete().eq("experience_id", id!).eq("user_id", user.id);
      setUserVote(null);
      setHelpfulCount((c) => value === "up" ? c - 1 : c + 1);
    } else if (userVote) {
      // Change vote
      await supabase.from("votes").update({ value }).eq("experience_id", id!).eq("user_id", user.id);
      setUserVote(value);
      setHelpfulCount((c) => value === "up" ? c + 2 : c - 2);
    } else {
      // New vote
      await supabase.from("votes").insert({ experience_id: id!, user_id: user.id, value });
      setUserVote(value);
      setHelpfulCount((c) => value === "up" ? c + 1 : c - 1);
    }
  };

  // Comments
  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("experience_id", id!)
      .order("created_at", { ascending: true });
    if (data) {
      // Fetch profiles for all comment authors
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_url").in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
      setComments(data.map((c) => ({ ...c, profile: profileMap[c.user_id] || {} })));
    }
  };

  const postComment = async (parentId: string | null, text: string) => {
    if (!user) { toast.error("Sign in to comment"); return; }
    if (!text.trim()) return;
    setSubmittingComment(true);
    const { error } = await supabase.from("comments").insert({
      experience_id: id!,
      user_id: user.id,
      content: text.trim(),
      parent_id: parentId,
    });
    setSubmittingComment(false);
    if (error) { toast.error("Failed to post comment"); return; }
    setCommentText("");
    setReplyText("");
    setReplyTo(null);
    fetchComments();
    toast.success("Comment posted!");
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    fetchComments();
    toast.success("Comment deleted");
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!experience) return <div className="py-20 text-center">Experience not found</div>;

  const Icon = typeIcons[experience.type] || Code2;
  const color = typeColors[experience.type] || "text-primary";
  const content = experience.content as Record<string, any>;
  const orderedFields = fieldOrder[experience.type] || Object.keys(content);

  // Build top-level and reply comments
  const topComments = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

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
          </div>
        </div>
        <Button variant={bookmarked ? "default" : "outline"} size="icon" onClick={toggleBookmark}>
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Voting */}
      <div className="flex items-center gap-3">
        <Button
          variant={userVote === "up" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("up")}
          className="gap-1.5"
        >
          <ThumbsUp className={`h-4 w-4 ${userVote === "up" ? "fill-current" : ""}`} />
          Helpful
        </Button>
        <span className="text-sm font-medium">{helpfulCount}</span>
        <Button
          variant={userVote === "down" ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleVote("down")}
          className="gap-1.5"
        >
          <ThumbsDown className={`h-4 w-4 ${userVote === "down" ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Content Card — ordered fields */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {orderedFields.map((key) => {
            const value = content[key];
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            const label = fieldLabels[key] || key;
            const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
            if (!displayValue.trim()) return null;

            return (
              <div key={key}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</h3>
                {linkFields.has(key) && displayValue ? (
                  <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{displayValue}</a>
                ) : (
                  <p className="whitespace-pre-wrap">{displayValue}</p>
                )}
              </div>
            );
          })}
          {/* Render any remaining fields not in the ordered list */}
          {Object.entries(content).filter(([key]) => !orderedFields.includes(key)).map(([key, value]) => {
            if (!value || (Array.isArray(value) && (value as any[]).length === 0)) return null;
            const label = fieldLabels[key] || key;
            const displayValue = Array.isArray(value) ? (value as any[]).join(", ") : String(value);
            if (!displayValue.trim()) return null;
            return (
              <div key={key}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</h3>
                {linkFields.has(key) ? (
                  <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{displayValue}</a>
                ) : (
                  <p className="whitespace-pre-wrap">{displayValue}</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New comment input */}
          <div className="flex gap-3">
            <Textarea
              placeholder={user ? "Share your thoughts..." : "Sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
              rows={2}
              className="flex-1"
            />
            <Button
              size="sm"
              disabled={!user || !commentText.trim() || submittingComment}
              onClick={() => postComment(null, commentText)}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
          )}

          <Separator />

          {topComments.map((comment) => {
            const commentReplies = replies.filter((r) => r.parent_id === comment.id);
            return (
              <div key={comment.id} className="space-y-3">
                <CommentItem
                  comment={comment}
                  currentUserId={user?.id}
                  onDelete={deleteComment}
                  onReply={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                />
                {/* Replies */}
                {commentReplies.map((reply) => (
                  <div key={reply.id} className="ml-8 border-l-2 border-muted pl-4">
                    <CommentItem
                      comment={reply}
                      currentUserId={user?.id}
                      onDelete={deleteComment}
                    />
                  </div>
                ))}
                {/* Reply input */}
                {replyTo === comment.id && (
                  <div className="ml-8 flex gap-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      disabled={!replyText.trim() || submittingComment}
                      onClick={() => postComment(comment.id, replyText)}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

function CommentItem({ comment, currentUserId, onDelete, onReply }: {
  comment: any;
  currentUserId?: string;
  onDelete: (id: string) => void;
  onReply?: () => void;
}) {
  const profile = comment.profile || {};
  const initial = (profile.username || "U")[0].toUpperCase();
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={profile.avatar_url || ""} />
        <AvatarFallback className="text-xs">{initial}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{profile.username || "Anonymous"}</span>
          <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-sm mt-0.5 whitespace-pre-wrap">{comment.content}</p>
        <div className="flex gap-2 mt-1">
          {onReply && (
            <button onClick={onReply} className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
          )}
          {currentUserId === comment.user_id && (
            <button onClick={() => onDelete(comment.id)} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceDetail;

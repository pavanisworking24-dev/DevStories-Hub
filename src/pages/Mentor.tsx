import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const suggestedQuestions = [
  "How should I prepare for my first hackathon?",
  "What are common system design interview questions?",
  "How do I choose a tech stack for a side project?",
  "What should I expect at a tech conference?",
];

const Mentor = () => {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">AI Mentor</h1>
        <p className="mt-1 text-muted-foreground">Get personalized advice from community wisdom</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
        <div className="rounded-2xl bg-primary/10 p-5">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ask me anything about tech careers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            I synthesize wisdom from real community experiences to give you grounded advice.
          </p>
        </div>
        <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
          {suggestedQuestions.map((q) => (
            <Card
              key={q}
              className="cursor-pointer transition-all hover:shadow-sm hover:-translate-y-0.5 card-glow"
              onClick={() => setInput(q)}
            >
              <CardContent className="p-3 text-sm">{q}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Mentor;

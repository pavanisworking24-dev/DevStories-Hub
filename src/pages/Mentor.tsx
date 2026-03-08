import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestedQuestions = [
  "How should I prepare for my first hackathon?",
  "What are common system design interview questions?",
  "How do I choose a tech stack for a side project?",
  "What should I expect at a tech conference?",
];

const Mentor = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const errBody = await resp.text();
        let errMsg = "Failed to get response";
        try { errMsg = JSON.parse(errBody).error || errMsg; } catch {}
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${errMsg}` }]);
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">AI Mentor</h1>
        <p className="mt-1 text-muted-foreground">Get personalized advice from community wisdom</p>
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="rounded-2xl bg-primary/10 p-5"><Sparkles className="h-10 w-10 text-primary" /></div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Ask me anything about tech careers</h2>
              <p className="mt-1 text-sm text-muted-foreground">I synthesize wisdom from real community experiences to give you grounded advice.</p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {suggestedQuestions.map((q) => (
                <Card key={q} className="cursor-pointer transition-all hover:shadow-sm hover:-translate-y-0.5 card-glow" onClick={() => send(q)}>
                  <CardContent className="p-3 text-sm">{q}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-2xl bg-accent px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t pt-4">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          className="flex-1"
        />
        <Button size="icon" disabled={!input.trim() || isLoading} onClick={() => send(input)}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Mentor;

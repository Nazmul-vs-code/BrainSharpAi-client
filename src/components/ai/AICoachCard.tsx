"use client";

import { useState, type FormEvent } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input, TextField } from "@heroui/react";

interface AICoachCardProps {
  userId: string;
}

interface CoachResponse {
  status?: boolean;
  data?: {
    coachingAdvice?: string;
  };
  message?: string;
  error?: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const COACH_TIMEOUT_MS = 30000;

export default function AICoachCard({ userId }: AICoachCardProps) {
  const [advice, setAdvice] = useState<string>(
    "Hi! I’m your BrainSharp coach. Ask me about focus, habits, or your next quest—or request a daily brief to get started."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  const fetchCoaching = async (customMessage?: string) => {
    if (!userId || loading) return;

    const message = (customMessage ?? userQuery).trim();

    if (message.length > MAX_MESSAGE_LENGTH) {
      setAdvice(`⚠️ Your question must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    setLoading(true);
    setLastQuestion(message || null);

    try {
      const backendBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      if (!backendBaseUrl) {
        throw new Error("The AI coach backend is not configured.");
      }

      const url = `${backendBaseUrl.replace(/\/+$/, "")}/api/ai/coach`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), COACH_TIMEOUT_MS);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      let payload: CoachResponse | null = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          payload = JSON.parse(responseText) as CoachResponse;
        } catch {
          payload = null;
        }
      }

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(
            payload?.message || payload?.error || "Your question is invalid. Please shorten it and try again."
          );
        }

        if (response.status === 504) {
          throw new Error("The AI coach request timed out. Please try again.");
        }

        throw new Error("The AI coach is temporarily unavailable. Please try again shortly.");
      }

      const coachingAdvice = payload?.data?.coachingAdvice?.trim();
      if (!coachingAdvice) {
        throw new Error("The AI coach returned an empty response.");
      }

      setAdvice(coachingAdvice);
    } catch (err) {
      console.error("AI Coach Fetch Error:", err);

      if (err instanceof Error && err.name === "AbortError") {
        setAdvice("⚠️ The AI coach request timed out after 30 seconds. Please try again.");
      } else {
        const message = err instanceof Error
          ? err.message
          : "The AI coach is temporarily unavailable. Please try again shortly.";
        setAdvice(`⚠️ ${message}`);
      }
    } finally {
      setLoading(false);
      setUserQuery("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = userQuery.trim();
    if (message && !loading) void fetchCoaching(message);
  };

  const suggestions = [
    "How can I improve my focus today?",
    "Help me build a consistent streak",
    "What quest should I do next?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        variant="secondary"
        className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl"
      >
        <Card.Header className="flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/70 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Bot size={23} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <Card.Title className="text-base font-bold text-white">BrainSharp AI Coach</Card.Title>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Personal habit coach
              </p>
            </div>
          </div>
          <Button
            onPress={() => void fetchCoaching()}
            isDisabled={loading}
            className="shrink-0 gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-400"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            Daily brief
          </Button>
        </Card.Header>

        <Card.Content className="space-y-5 p-4 sm:p-6">
          <div
            aria-live="polite"
            className="flex min-h-64 flex-col gap-4 rounded-2xl bg-neutral-900/60 p-4 sm:p-5"
          >
            {lastQuestion && (
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-orange-500 px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[80%]">
                {lastQuestion}
              </div>
            )}
            <div className="flex max-w-[95%] items-start gap-2.5 sm:max-w-[85%]">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-orange-400">
                <Bot size={17} aria-hidden="true" />
              </div>
              <div className="min-w-0 rounded-2xl rounded-tl-md border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm leading-relaxed text-neutral-200">
                {loading ? (
                  <span className="flex items-center gap-2 text-neutral-400">
                    <Loader2 size={15} className="animate-spin text-orange-400" />
                    Thinking about your goals...
                  </span>
                ) : (
                  <p className="whitespace-pre-line">{advice}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-400">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((promptText) => (
                <Button
                  key={promptText}
                  size="sm"
                  variant="outline"
                  isDisabled={loading}
                  onPress={() => void fetchCoaching(promptText)}
                  className="h-auto whitespace-normal rounded-full border-neutral-700 px-3 py-2 text-left text-xs text-neutral-300 hover:border-orange-500/50 hover:text-white"
                >
                  {promptText}
                </Button>
              ))}
            </div>
          </div>
        </Card.Content>

        <Card.Footer className="border-t border-neutral-800 p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <TextField className="min-w-0 flex-1">
              <Input
                aria-label="Message the AI coach"
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                placeholder="Message your coach..."
                maxLength={MAX_MESSAGE_LENGTH}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-orange-500"
              />
            </TextField>
            <Button
              type="submit"
              isDisabled={loading || !userQuery.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-400 disabled:opacity-50"
            >
              <Send size={17} aria-hidden="true" />
            </Button>
          </form>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}
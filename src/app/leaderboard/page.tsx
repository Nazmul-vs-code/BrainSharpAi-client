"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, ListBox, Select } from "@heroui/react";
import { Search, Sparkles, Trophy } from "lucide-react";
import { FetchData } from "@/lib/api/FetchData";
import LeaderboardList from "@/components/leaderboard/LeaderboardList";
import Podium from "@/components/leaderboard/Podium";

const CATEGORIES = [
  { id: "global", label: "Global Rank" },
  { id: "mental", label: "Mental (Meditation)" },
  { id: "physical", label: "Physical Exercise" },
  { id: "puzzle", label: "Puzzle Solving" },
];

interface LeaderboardUser {
  userId: string;
  name: string;
  image?: string;
  xp?: number;
  level?: number;
  streakCount?: number;
  totalCategoryXp?: number;
}

type LeaderboardResponse =
  | LeaderboardUser[]
  | { leaderboard?: LeaderboardUser[] };

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState("global");
  const [leaderboards, setLeaderboards] = useState<
    Record<string, LeaderboardUser[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboards() {
      setLoading(true);
      setLoadError(null);

      try {
        const results = await Promise.all(
          CATEGORIES.map(async (category) => {
            const endpoint =
              category.id === "global"
                ? "/api/leaderboard"
                : `/api/leaderboard?category=${category.id}`;
            const response =
              await FetchData<LeaderboardResponse>(endpoint);

            if (response.error) {
              throw new Error(response.error);
            }

            const data = response.data;
            const users = Array.isArray(data)
              ? data
              : data?.leaderboard ?? [];

            return [category.id, users] as const;
          }),
        );

        if (!cancelled) {
          setLeaderboards(Object.fromEntries(results));
        }
      } catch (error) {
        console.error("Failed to load leaderboards:", error);
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load leaderboard data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchLeaderboards();
    return () => {
      cancelled = true;
    };
  }, []);

  const leaderboardData = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const users = leaderboards[activeCategory] ?? [];

    if (!query) return users;
    return users.filter((user) =>
      user.name.toLocaleLowerCase().includes(query),
    );
  }, [activeCategory, leaderboards, searchQuery]);

  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  return (
    <section className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
            <Trophy size={14} />
            Hall of Fame
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Leaderboard
          </h1>
        </header>

        <div className="flex w-full items-center gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 focus-within:border-orange-500/50">
            <Search
              aria-hidden="true"
              className="shrink-0 text-neutral-500"
              size={17}
            />
            <Input
              aria-label="Search leaderboard"
              className="min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-white outline-none placeholder:text-neutral-500 focus-visible:ring-0"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search players"
              value={searchQuery}
            />
          </div>
          <Select
            aria-label="Filter leaderboard category"
            className="w-36 shrink-0 sm:w-52"
            onSelectionChange={(key) => {
              if (key !== null) setActiveCategory(String(key));
            }}
            selectedKey={activeCategory}
          >
            <Select.Trigger className="h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 text-left text-sm text-white">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Leaderboard categories">
                {CATEGORIES.map((category) => (
                  <ListBox.Item id={category.id} key={category.id}>
                    {category.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : loadError ? (
          <div
            className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-300"
            role="alert"
          >
            {loadError}
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-12 text-center">
            <Sparkles className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
            <p className="text-sm text-neutral-400">
              {searchQuery.trim()
                ? "No players found."
                : "No rankings recorded for this category yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Podium topUsers={topThree} />
            <LeaderboardList users={remainingUsers} />
          </div>
        )}
      </div>
    </section>
  );
}

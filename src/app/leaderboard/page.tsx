"use client";

import { useEffect, useState } from "react";
import { FetchData } from "@/lib/api/FetchData";
import Podium from "@/components/leaderboard/Podium";
import LeaderboardList from "@/components/leaderboard/LeaderboardList";
import { Trophy, Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "global", label: "Global Rank" },
  { id: "mental", label: "Mental (Meditation)" },
  { id: "physical", label: "Physical Exercise" },
  { id: "puzzle", label: "Puzzle Solving" },
];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState("global");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const endpoint = activeCategory === "global" 
        ? "/api/leaderboard" 
        : `/api/leaderboard?category=${activeCategory}`;
      
      const res = await FetchData(endpoint);
      if (res.data) {
        const list = Array.isArray(res.data) 
          ? res.data 
          : res.data.leaderboard || res.data.data || [];
        setLeaderboardData(list);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [activeCategory]);

  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  return (
    <main className="min-h-screen bg-black px-6 py-12 lg:px-8 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
            <Trophy size={14} />
            Hall of Fame
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Leaderboard
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Top explorers leading the ranks across mindfulness, physical endurance, and cognitive agility.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neutral-800 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                  : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-400">No rankings recorded for this category yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Podium for Top 3 */}
            <Podium topUsers={topThree} />

            {/* List for 4th rank onwards */}
            <LeaderboardList users={remainingUsers} />
          </div>
        )}

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { FetchData } from "@/lib/api/FetchData";
import { ActionReq } from "@/lib/actions/ActionReq";
import QuestHeader from "@/components/quest/QuestHeader";
import QuestCard from "@/components/quest/QuestCard";
import ActivityModal from "@/components/quest/ActivityModal";
import toast from "react-hot-toast";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Fallback quests so UI never stays empty if backend is still seeding
const DEFAULT_QUESTS = [
  {
    id: 1,
    title: "Meditate 10 minutes",
    category: "mental",
    durationMinutes: 10,
    xpReward: 20,
    description: "Clear your mind, focus on your breath, and achieve deep mental refreshment.",
  },
  {
    id: 2,
    title: "Physical Exercise",
    category: "physical",
    durationMinutes: 10,
    xpReward: 20,
    description: "Get your blood flowing with light stretching, pushups, or bodyweight movements.",
  },
  {
    id: 3,
    title: "Puzzle Solving",
    category: "puzzle",
    durationMinutes: 10,
    xpReward: 20,
    description: "Boost your cognitive sharpness by solving a quick logic or pattern-matching puzzle.",
  },
];

export default function QuestPage() {
  const [quests, setQuests] = useState<any[]>(DEFAULT_QUESTS);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<any>({ xp: 15, level: 1, streakCount: 3, name: "Explorer" });
  const [loading, setLoading] = useState(true);
  const [activeQuest, setActiveQuest] = useState<any | null>(null);

  const userId = "test-user-id"; 

  useEffect(() => {
    async function loadQuestData() {
      setLoading(true);

      // Fetch Quests with safe data parsing
      const questRes = await FetchData("/api/quests");
      if (questRes.data) {
        const fetchedList = Array.isArray(questRes.data) 
          ? questRes.data 
          : questRes.data.data || questRes.data.Data || questRes.data.quests;
        
        if (fetchedList && fetchedList.length > 0) {
          setQuests(fetchedList);
        }
      }

      // Fetch Profile with safe parsing
      const profileRes = await FetchData(`/api/profile/${userId}`);
      if (profileRes.data) {
        const profileData = profileRes.data.data || profileRes.data.Data || profileRes.data;
        if (profileData) {
          setUserProfile((prev: any) => ({ ...prev, ...profileData }));
        }
      }

      setLoading(false);
    }
    loadQuestData();
  }, [userId]);

  const handleCompleteQuest = async (questId: number) => {
    // Optimistic local update so UI feels instantaneous
    setCompletedQuestIds((prev) => [...prev, questId]);
    setUserProfile((prev: any) => {
      const newXp = prev.xp + 20;
      const newLevel = Math.floor(newXp / 20) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });

    toast.success("Quest completed! +20 XP awarded!");

    // Send to backend
    const res = await ActionReq("/api/quests/complete", {
      method: "POST",
      body: { userId, questId },
    });

    if (res.data) {
      const updatedProfile = res.data.user || res.data.profile || res.data.data;
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* User Stats Header */}
        <QuestHeader
          level={userProfile.level || 1}
          xp={userProfile.xp || 0}
          streak={userProfile.streakCount || 3}
          name={userProfile.name}
        />

        {/* Quests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-orange-400" size={20} />
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Today&apos;s Active Quests</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <QuestCard
                  quest={quest}
                  isCompleted={completedQuestIds.includes(quest.id)}
                  onStartActivity={(q) => setActiveQuest(q)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Timer Modal */}
      <ActivityModal
        quest={activeQuest}
        isOpen={!!activeQuest}
        onClose={() => setActiveQuest(null)}
        onComplete={handleCompleteQuest}
      />
    </main>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FetchData } from "@/lib/api/FetchData";
import { ActionReq } from "@/lib/actions/ActionReq";
import { useSession } from "@/lib/auth-client";
import QuestHeader from "@/components/quest/QuestHeader";
import QuestCard from "@/components/quest/QuestCard";
import ActivityModal from "@/components/quest/ActivityModal";
import type { Quest, UserProfile } from "@/types/quest";
import { QUEST_OPTIONS } from "@/components/quest/questOptions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let current = value;
  for (let depth = 0; depth < 4 && isRecord(current); depth += 1) {
    const nested = current.data ?? current.Data;
    if (nested === undefined) break;
    current = nested;
  }
  return current;
}

function readQuestList(value: unknown): Quest[] {
  const payload = unwrapResponse(value);
  const quests = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.quests)
      ? payload.quests
      : null;

  if (!quests) throw new Error("The quests response did not contain a quest list.");

  return quests.map((quest, index) => {
    if (
      !isRecord(quest) ||
      (typeof quest.id !== "string" && typeof quest.id !== "number") ||
      typeof quest.title !== "string" ||
      typeof quest.category !== "string" ||
      typeof quest.durationMinutes !== "number" ||
      typeof quest.xpReward !== "number" ||
      typeof quest.description !== "string"
    ) {
      throw new Error(`Quest data at position ${index + 1} is incomplete.`);
    }

    return {
      id: quest.id,
      title: quest.title,
      category: quest.category,
      durationMinutes: quest.durationMinutes,
      xpReward: quest.xpReward,
      description: quest.description,
    };
  });
}

function readProfile(value: unknown, fallbackName: string | null): UserProfile | null {
  let payload = unwrapResponse(value);
  if (isRecord(payload) && isRecord(payload.profile)) payload = payload.profile;
  else if (isRecord(payload) && isRecord(payload.user)) payload = payload.user;
  if (!isRecord(payload)) return null;

  const streakCount =
    typeof payload.streakCount === "number"
      ? payload.streakCount
      : typeof payload.streak === "number"
        ? payload.streak
        : null;
  if (
    typeof payload.xp !== "number" ||
    typeof payload.level !== "number" ||
    streakCount === null
  ) {
    return null;
  }

  return {
    id: typeof payload.id === "string" ? payload.id : undefined,
    name: typeof payload.name === "string" ? payload.name : fallbackName,
    xp: payload.xp,
    level: payload.level,
    streakCount,
  };
}

function readCompletedQuestTitles(value: unknown): string[] {
  const payload = unwrapResponse(value);
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.quests)) {
    return payload.quests
      .filter(
        (quest): quest is ApiRecord =>
          isRecord(quest) &&
          typeof quest.title === "string" &&
          isRecord(quest.progress) &&
          quest.progress.status === "completed",
      )
      .map((quest) => quest.title as string);
  }
  const completed = payload.completedQuests;
  if (!Array.isArray(completed)) return [];
  return completed
    .map((item) => (isRecord(item) ? item.title : item))
    .filter((title): title is string => typeof title === "string");
}

export default function QuestPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name ?? null;
  const [quests, setQuests] = useState<Quest[]>(QUEST_OPTIONS);
  const [completedQuestTitles, setCompletedQuestTitles] = useState<Set<string>>(new Set());
  const [questSyncStatus, setQuestSyncStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [questError, setQuestError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completingQuestTitles, setCompletingQuestTitles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isSessionPending) return;
    if (!userId) return;

    const authenticatedUserId = userId;
    let isActive = true;

    async function loadQuestData() {
      const [todayQuestResponse, profileResponse] = await Promise.all([
        FetchData<unknown>(`/api/quests/today/${encodeURIComponent(authenticatedUserId)}`),
        FetchData<unknown>(`/api/profile/${encodeURIComponent(authenticatedUserId)}`),
      ]);
      if (!isActive) return;

      let questResponse = todayQuestResponse;
      if (todayQuestResponse.error || todayQuestResponse.data === undefined) {
        questResponse = await FetchData<unknown>("/api/quests");
      } else {
        try {
          if (readQuestList(todayQuestResponse.data).length === 0) {
            questResponse = await FetchData<unknown>("/api/quests");
          }
        } catch {
          questResponse = await FetchData<unknown>("/api/quests");
        }
      }
      if (!isActive) return;

      if (questResponse.error || questResponse.data === undefined) {
        setQuestError(questResponse.error || "Quest service is unavailable.");
        setQuests(QUEST_OPTIONS);
        setCompletedQuestTitles(new Set());
        setQuestSyncStatus("unavailable");
      } else {
        try {
          const fetchedQuests = readQuestList(questResponse.data);
          if (fetchedQuests.length > 0) {
            setQuests(fetchedQuests);
            setQuestError(null);
            setCompletedQuestTitles(new Set(readCompletedQuestTitles(todayQuestResponse.data)));
            setQuestSyncStatus("ready");
          } else {
            setQuests(QUEST_OPTIONS);
            setQuestError("Quest options are waiting to sync with the database.");
            setQuestSyncStatus("unavailable");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to read quests.";
          setQuestError(message);
          setQuests(QUEST_OPTIONS);
          setCompletedQuestTitles(new Set());
          setQuestSyncStatus("unavailable");
        }
      }

      if (profileResponse.error || profileResponse.data === undefined) {
        const message = profileResponse.error || "Unable to load your profile.";
        setProfileError(message);
        setUserProfile(null);
        toast.error(message);
      } else {
        const profile = readProfile(profileResponse.data, userName);
        if (profile) {
          setUserProfile(profile);
          setProfileError(null);
        } else {
          const message = "The profile response did not contain XP, level, and streak data.";
          setProfileError(message);
          setUserProfile(null);
          toast.error(message);
        }
      }
    }

    void loadQuestData();
    return () => {
      isActive = false;
    };
  }, [isSessionPending, userId, userName]);

  const handleCompleteQuest = useCallback(async (quest: Quest): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to complete a quest.");
      return false;
    }
    if (typeof quest.id !== "number" || questSyncStatus !== "ready") {
      toast.error("This quest is still syncing with the database. Please try again shortly.");
      return false;
    }

    const key = quest.title;
    if (completedQuestTitles.has(key) || completingQuestTitles.has(key)) return false;

    setCompletingQuestTitles((current) => new Set(current).add(key));
    setCompletedQuestTitles((current) => new Set(current).add(key));

    const response = await ActionReq<unknown>("/api/quests/complete", {
      method: "POST",
      body: {
        userId,
        questId: quest.id,
      },
    });

    if (response.error || response.data === undefined) {
      setCompletedQuestTitles((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
      toast.error(response.error || "Unable to complete this quest.");
      setCompletingQuestTitles((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
      return false;
    }

    const returnedProfile = readProfile(response.data, userName);
    if (returnedProfile) {
      setUserProfile(returnedProfile);
    } else {
      const profileResponse = await FetchData<unknown>(
        `/api/profile/${encodeURIComponent(userId)}`,
      );
      const refreshedProfile = profileResponse.data
        ? readProfile(profileResponse.data, userName)
        : null;
      if (refreshedProfile) {
        setUserProfile(refreshedProfile);
        setProfileError(null);
      } else {
        const message = profileResponse.error || "Quest completed, but your profile could not be refreshed.";
        setProfileError(message);
      }
    }

    setCompletingQuestTitles((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
    toast.success("Quest completed!");
    return true;
  }, [completedQuestTitles, completingQuestTitles, questSyncStatus, userId, userName]);

  if (isSessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" aria-label="Loading" />
      </div>
    );
  }

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Sign in to view your quests</h1>
          <p className="mt-3 text-neutral-400">Your quests and progress are linked to your account.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {userProfile && (
          <QuestHeader
            level={userProfile.level}
            xp={userProfile.xp}
            streak={userProfile.streakCount}
            name={userProfile.name || userName || ""}
          />
        )}
        {profileError && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {profileError}
          </p>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <FaBolt className="text-orange-400" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Today&apos;s Active Quests</h2>
          </div>

          {questError && (
            <p role="status" className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              Showing available quest options. Your completion will sync when the quest service is available.
            </p>
          )}
          {(
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <QuestCard
                    quest={quest}
                    isCompleted={completedQuestTitles.has(quest.title)}
                    canStart={questSyncStatus === "ready" && typeof quest.id === "number"}
                    onStartActivity={setActiveQuest}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {activeQuest && (
        <ActivityModal
          key={activeQuest.id}
          quest={activeQuest}
          isOpen
          onClose={() => setActiveQuest(null)}
          onComplete={handleCompleteQuest}
        />
      )}
    </main>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FetchData } from "@/lib/api/FetchData";
import { ActionReq } from "@/lib/actions/ActionReq";
import { useSession } from "@/lib/auth-client";
import QuestHeader from "@/components/quest/QuestHeader";
import QuestCard from "@/components/quest/QuestCard";
import ActivityModal from "@/components/quest/ActivityModal";
import type { Quest, QuestId, UserProfile } from "@/types/quest";
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

export function calculateTrueStreak(completionDates: string[]): number {
  const uniqueDates = [...new Set(
    completionDates
      .map((timestamp) => {
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
      })
      .filter((date): date is string => date !== null),
  )].sort((left, right) => right.localeCompare(left));

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const latestDate = Date.parse(`${uniqueDates[0]}T00:00:00.000Z`);
  const daysSinceLatest = (todayUtc - latestDate) / 86_400_000;
  if (daysSinceLatest < 0 || daysSinceLatest > 1) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDates.length; index += 1) {
    const newerDate = Date.parse(`${uniqueDates[index - 1]}T00:00:00.000Z`);
    const olderDate = Date.parse(`${uniqueDates[index]}T00:00:00.000Z`);
    if (newerDate - olderDate !== 86_400_000) break;
    streak += 1;
  }

  return streak;
}

function readCompletionDates(value: unknown): string[] | null {
  const payload = unwrapResponse(value);
  const completionDates: string[] = [];
  let foundCompletionLogs = false;

  function visit(item: unknown, inCompletionCollection = false): void {
    if (Array.isArray(item)) {
      item.forEach((entry) => visit(entry, inCompletionCollection));
      return;
    }
    if (!isRecord(item)) return;

    if (inCompletionCollection && typeof item.createdAt === "string") {
      completionDates.push(item.createdAt);
    }

    for (const [key, nested] of Object.entries(item)) {
      const isCompletionCollection = /completion|session|activity|quest.?log|history/i.test(key);
      if (isCompletionCollection) foundCompletionLogs = true;
      visit(nested, inCompletionCollection || isCompletionCollection);
    }
  }

  visit(payload);
  return foundCompletionLogs ? completionDates : null;
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
    productiveEnoughProgress: readProductiveEnoughProgress(payload),
  };
}

function readProductiveEnoughProgress(profile: ApiRecord): number | undefined {
  const directProgress = profile.productiveEnoughProgress ?? profile.productiveEnoughDays;
  if (typeof directProgress === "number" && Number.isFinite(directProgress)) {
    return Math.min(30, Math.max(0, directProgress));
  }

  const badgeProgress = profile.badgeProgress;
  if (isRecord(badgeProgress)) {
    const progress = badgeProgress.productiveEnough ?? badgeProgress["productive-enough"];
    const value = typeof progress === "number"
      ? progress
      : isRecord(progress)
        ? progress.progress ?? progress.days ?? progress.current
        : undefined;
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.min(30, Math.max(0, value));
    }
  }

  if (Array.isArray(profile.badges)) {
    for (const badge of profile.badges) {
      if (!isRecord(badge)) continue;
      const badgeName = [badge.id, badge.name, badge.title]
        .find((value): value is string => typeof value === "string")
        ?.toLowerCase()
        .replace(/[^a-z]/g, "");
      if (badgeName !== "productiveenough") continue;

      const value = badge.progress ?? badge.days ?? badge.currentProgress;
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.min(30, Math.max(0, value));
      }
    }
  }

  return undefined;
}

function readXpEarned(value: unknown): number | null {
  const payload = unwrapResponse(value);
  if (!isRecord(payload)) return null;
  const xpEarned = payload.xpEarned;
  return typeof xpEarned === "number" && Number.isFinite(xpEarned) ? xpEarned : null;
}

function readCompletionProfileUpdates(value: unknown): Partial<UserProfile> {
  let payload = unwrapResponse(value);
  if (isRecord(payload) && isRecord(payload.profile)) payload = payload.profile;
  else if (isRecord(payload) && isRecord(payload.user)) payload = payload.user;
  if (!isRecord(payload)) return {};

  const updates: Partial<UserProfile> = {};
  const xp = typeof payload.xp === "number"
    ? payload.xp
    : typeof payload.totalXp === "number"
      ? payload.totalXp
      : undefined;
  const streakCount = typeof payload.streakCount === "number"
    ? payload.streakCount
    : typeof payload.streak === "number"
      ? payload.streak
      : undefined;
  if (xp !== undefined) updates.xp = xp;
  if (typeof payload.level === "number") updates.level = payload.level;
  if (streakCount !== undefined) updates.streakCount = streakCount;
  return updates;
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
  const [quests, setQuests] = useState<Quest[]>([]);
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
        setQuests([]);
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
            setQuests([]);
            setQuestError("No quests are currently available.");
            setQuestSyncStatus("unavailable");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to read quests.";
          setQuestError(message);
          setQuests([]);
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
          const completionDates = readCompletionDates(profileResponse.data);
          setUserProfile({
            ...profile,
            streakCount: completionDates === null
              ? profile.streakCount
              : calculateTrueStreak(completionDates),
          });
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

  const handleCompleteQuest = useCallback(async (
    questId: QuestId,
    durationSpentMinutes: number,
  ): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to complete a quest.");
      return false;
    }
    const quest = quests.find((candidate) => candidate.id === questId);
    if (!quest || typeof questId !== "number" || questSyncStatus !== "ready") {
      toast.error("This quest is still syncing with the database. Please try again shortly.");
      return false;
    }

    const key = quest.title;
    const wasCompleted = completedQuestTitles.has(key);
    if (completingQuestTitles.has(key)) return false;

    setCompletingQuestTitles((current) => new Set(current).add(key));
    setCompletedQuestTitles((current) => new Set(current).add(key));

    const response = await ActionReq<unknown>("/api/quests/complete", {
      method: "POST",
      body: {
        userId,
        questId,
        durationSpentMinutes,
      },
    });

    if (response.error || response.data === undefined) {
      if (!wasCompleted) {
        setCompletedQuestTitles((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
      }
      toast.error(response.error || "Unable to complete this quest.");
      setCompletingQuestTitles((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
      return false;
    }

    const xpEarned = readXpEarned(response.data);
    const completionProfileUpdates = readCompletionProfileUpdates(response.data);
    const returnedProfile = readProfile(response.data, userName);
    const completionDates = readCompletionDates(response.data);
    if (returnedProfile) {
      setUserProfile((current) => ({
        ...current,
        ...returnedProfile,
        streakCount: completionDates === null
          ? returnedProfile.streakCount
          : calculateTrueStreak(completionDates),
        productiveEnoughProgress:
          returnedProfile.productiveEnoughProgress ?? current?.productiveEnoughProgress,
      }));
    } else {
      setUserProfile((current) => {
        if (!current) return current;
        return {
          ...current,
          ...completionProfileUpdates,
          xp: completionProfileUpdates.xp ?? current.xp + (xpEarned ?? 0),
        };
      });
    }

    if (!returnedProfile || completionDates === null) {
      const profileResponse = await FetchData<unknown>(
        `/api/profile/${encodeURIComponent(userId)}`,
      );
      const refreshedProfile = profileResponse.data
        ? readProfile(profileResponse.data, userName)
        : null;
      if (refreshedProfile) {
        const completionDates = readCompletionDates(profileResponse.data);
        setUserProfile({
          ...refreshedProfile,
          streakCount: completionDates === null
            ? refreshedProfile.streakCount
            : calculateTrueStreak(completionDates),
        });
        setProfileError(null);
      } else {
        if (!returnedProfile) {
          const message = profileResponse.error || "Quest completed, but your profile could not be refreshed.";
          setProfileError(message);
        }
      }
    }

    setCompletingQuestTitles((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
    toast.success(xpEarned === null ? "Quest completed!" : `Quest completed! +${xpEarned} XP`);
    return true;
  }, [completedQuestTitles, completingQuestTitles, questSyncStatus, quests, userId, userName]);

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
            productiveEnoughProgress={userProfile.productiveEnoughProgress}
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
              {questError}
            </p>
          )}
          {questSyncStatus === "loading" && (
            <p role="status" className="text-sm text-neutral-400">Loading quests...</p>
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

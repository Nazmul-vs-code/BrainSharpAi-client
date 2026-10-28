"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import ActivityModal from "@/components/quest/ActivityModal";
import QuestCard from "@/components/quest/QuestCard";
import QuestHeader from "@/components/quest/QuestHeader";
import { ActionReq } from "@/lib/actions/ActionReq";
import { FetchData } from "@/lib/api/FetchData";
import { useSession } from "@/lib/auth-client";
import {
  calculateTrueStreak,
  readCompletedQuestTitles,
  readCompletionDates,
  readCompletionProfileUpdates,
  readProfile,
  readQuestList,
  readXpEarned,
} from "@/lib/quest/questData";
import type { Quest, QuestId, UserProfile } from "@/types/quest";

export { calculateTrueStreak } from "@/lib/quest/questData";

export default function QuestPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name ?? null;
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuestTitles, setCompletedQuestTitles] = useState<Set<string>>(
    new Set(),
  );
  const [questSyncStatus, setQuestSyncStatus] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [questError, setQuestError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completingQuestTitles, setCompletingQuestTitles] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (isSessionPending || !userId) return;

    const authenticatedUserId = userId;
    let isActive = true;

    async function loadQuestData() {
      const [todayQuestResponse, profileResponse] = await Promise.all([
        FetchData<unknown>(
          `/api/quests/today/${encodeURIComponent(authenticatedUserId)}`,
        ),
        FetchData<unknown>(
          `/api/profile/${encodeURIComponent(authenticatedUserId)}`,
        ),
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
            setCompletedQuestTitles(
              new Set(readCompletedQuestTitles(todayQuestResponse.data)),
            );
            setQuestSyncStatus("ready");
          } else {
            setQuests([]);
            setQuestError("No quests are currently available.");
            setQuestSyncStatus("unavailable");
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to read quests.";
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
            streakCount:
              completionDates === null
                ? profile.streakCount
                : calculateTrueStreak(completionDates),
          });
          setProfileError(null);
        } else {
          const message =
            "The profile response did not contain XP, level, and streak data.";
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

  const handleCompleteQuest = useCallback(
    async (
      questId: QuestId,
      durationSpentMinutes: number,
    ): Promise<boolean> => {
      if (!userId) {
        toast.error("Please sign in to complete a quest.");
        return false;
      }
      const quest = quests.find((candidate) => candidate.id === questId);
      if (
        !quest ||
        typeof questId !== "number" ||
        questSyncStatus !== "ready"
      ) {
        toast.error(
          "This quest is still syncing with the database. Please try again shortly.",
        );
        return false;
      }

      const key = quest.title;
      const wasCompleted = completedQuestTitles.has(key);
      if (completingQuestTitles.has(key)) return false;

      setCompletingQuestTitles((current) => new Set(current).add(key));
      setCompletedQuestTitles((current) => new Set(current).add(key));

      const response = await ActionReq<unknown>("/api/quests/complete", {
        method: "POST",
        body: { userId, questId, durationSpentMinutes },
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
      const completionProfileUpdates = readCompletionProfileUpdates(
        response.data,
      );
      const returnedProfile = readProfile(response.data, userName);
      const completionDates = readCompletionDates(response.data);
      if (returnedProfile) {
        setUserProfile((current) => ({
          ...current,
          ...returnedProfile,
          streakCount:
            completionDates === null
              ? returnedProfile.streakCount
              : calculateTrueStreak(completionDates),
          productiveEnoughProgress:
            returnedProfile.productiveEnoughProgress ??
            current?.productiveEnoughProgress,
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
          const refreshedCompletionDates = readCompletionDates(
            profileResponse.data,
          );
          setUserProfile({
            ...refreshedProfile,
            streakCount:
              refreshedCompletionDates === null
                ? refreshedProfile.streakCount
                : calculateTrueStreak(refreshedCompletionDates),
          });
          setProfileError(null);
        } else if (!returnedProfile) {
          const message =
            profileResponse.error ||
            "Quest completed, but your profile could not be refreshed.";
          setProfileError(message);
        }
      }

      setCompletingQuestTitles((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
      toast.success(
        xpEarned === null ? "Quest completed!" : `Quest completed! +${xpEarned} XP`,
      );
      return true;
    },
    [
      completedQuestTitles,
      completingQuestTitles,
      questSyncStatus,
      quests,
      userId,
      userName,
    ],
  );

  if (isSessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2
          className="size-8 animate-spin text-orange-400"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!userId) {
    return (
      <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="quest-glass-panel w-full max-w-md rounded-[2rem] p-8 text-center sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-400/[0.08] text-orange-300 shadow-[0_0_24px_rgba(255,107,0,0.12)]">
            <Sparkles aria-hidden="true" className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Sign in to view your quests
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your quests and progress are linked to your account.
          </p>
          <Button
            onPress={() => router.push("/login")}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(0,0,0,0.3)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Sign in <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </main>
    );
  }

  const completedCount = quests.filter((quest) =>
    completedQuestTitles.has(quest.title),
  ).length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 py-5 text-slate-100 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-10">
        {userProfile && (
          <QuestHeader
            level={userProfile.level}
            xp={userProfile.xp}
            streak={userProfile.streakCount}
            name={userProfile.name || userName || ""}
            completedQuests={completedCount}
            totalQuests={quests.length}
            productiveEnoughProgress={userProfile.productiveEnoughProgress}
          />
        )}
        {profileError && (
          <p
            role="alert"
            className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.06] p-4 text-sm text-orange-100 shadow-sm backdrop-blur-xl"
          >
            {profileError}
          </p>
        )}

        <motion.section
          aria-labelledby="active-quests-heading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6 sm:gap-4">
            <div>
              <div className="mb-2 hidden items-center gap-2 text-orange-300 sm:flex">
                <Sparkles aria-hidden="true" className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Your next small win
                </span>
              </div>
              <h2
                id="active-quests-heading"
                className="text-2xl font-semibold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-3xl"
              >
                Today&apos;s quests
              </h2>
            </div>
            {quests.length > 0 && (
              <span className="rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-3 py-1.5 text-xs font-medium text-orange-100 shadow-sm backdrop-blur-xl">
                {completedCount} / {quests.length} complete
              </span>
            )}
          </div>

          {questError && (
            <p
              role="status"
              className="mb-5 rounded-2xl border border-orange-400/20 bg-orange-400/[0.06] p-4 text-sm text-orange-100 shadow-sm backdrop-blur-xl"
            >
              {questError}
            </p>
          )}
          {questSyncStatus === "loading" && (
            <div
              role="status"
              className="quest-glass-panel flex items-center gap-3 rounded-2xl p-5 text-sm text-slate-300"
            >
            <Loader2 aria-hidden="true" className="size-4 animate-spin text-orange-400" />
              Loading your quests...
            </div>
          )}
          {quests.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
              {quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.06, 0.24),
                  }}
                >
                  <QuestCard
                    quest={quest}
                    isCompleted={completedQuestTitles.has(quest.title)}
                    canStart={
                      questSyncStatus === "ready" &&
                      typeof quest.id === "number" &&
                      !completingQuestTitles.has(quest.title)
                    }
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

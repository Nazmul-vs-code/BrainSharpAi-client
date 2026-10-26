import type { Quest, UserProfile } from "@/types/quest";

type ApiRecord = Record<string, unknown>;

export type QuestProgressStatus = "completed" | "pending" | "missed";

export function getQuestProgressStatus(
  progress: {
    status: "pending" | "completed";
    assignedDate: string;
  },
  referenceDate = new Date(),
): QuestProgressStatus {
  if (progress.status === "completed") return "completed";
  if (Number.isNaN(referenceDate.getTime())) return "pending";

  const assignedDate = progress.assignedDate.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(assignedDate)) return "pending";

  const parsedAssignedDate = new Date(`${assignedDate}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedAssignedDate.getTime()) ||
    parsedAssignedDate.toISOString().slice(0, 10) !== assignedDate
  ) {
    return "pending";
  }

  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const day = String(referenceDate.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  return assignedDate < today ? "missed" : "pending";
}

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
  const uniqueDates = [
    ...new Set(
      completionDates
        .map((timestamp) => {
          const date = new Date(timestamp);
          return Number.isNaN(date.getTime())
            ? null
            : date.toISOString().slice(0, 10);
        })
        .filter((date): date is string => date !== null),
    ),
  ].sort((left, right) => right.localeCompare(left));

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
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

export function readCompletionDates(value: unknown): string[] | null {
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
      const isCompletionCollection =
        /completion|session|activity|quest.?log|history/i.test(key);
      if (isCompletionCollection) foundCompletionLogs = true;
      visit(nested, inCompletionCollection || isCompletionCollection);
    }
  }

  visit(payload);
  return foundCompletionLogs ? completionDates : null;
}

export function readQuestList(value: unknown): Quest[] {
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

function readProductiveEnoughProgress(profile: ApiRecord): number | undefined {
  const directProgress =
    profile.productiveEnoughProgress ?? profile.productiveEnoughDays;
  if (typeof directProgress === "number" && Number.isFinite(directProgress)) {
    return Math.min(30, Math.max(0, directProgress));
  }

  const badgeProgress = profile.badgeProgress;
  if (isRecord(badgeProgress)) {
    const progress =
      badgeProgress.productiveEnough ?? badgeProgress["productive-enough"];
    const value =
      typeof progress === "number"
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

export function readProfile(
  value: unknown,
  fallbackName: string | null,
): UserProfile | null {
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

export function readXpEarned(value: unknown): number | null {
  const payload = unwrapResponse(value);
  if (!isRecord(payload)) return null;
  const xpEarned = payload.xpEarned;
  return typeof xpEarned === "number" && Number.isFinite(xpEarned)
    ? xpEarned
    : null;
}

export function readCompletionProfileUpdates(
  value: unknown,
): Partial<UserProfile> {
  let payload = unwrapResponse(value);
  if (isRecord(payload) && isRecord(payload.profile)) payload = payload.profile;
  else if (isRecord(payload) && isRecord(payload.user)) payload = payload.user;
  if (!isRecord(payload)) return {};

  const updates: Partial<UserProfile> = {};
  const xp =
    typeof payload.xp === "number"
      ? payload.xp
      : typeof payload.totalXp === "number"
        ? payload.totalXp
        : undefined;
  const streakCount =
    typeof payload.streakCount === "number"
      ? payload.streakCount
      : typeof payload.streak === "number"
        ? payload.streak
        : undefined;
  if (xp !== undefined) updates.xp = xp;
  if (typeof payload.level === "number") updates.level = payload.level;
  if (streakCount !== undefined) updates.streakCount = streakCount;
  return updates;
}

export function readCompletedQuestTitles(value: unknown): string[] {
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

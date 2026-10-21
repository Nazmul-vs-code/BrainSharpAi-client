export type QuestId = number | string;

export interface Quest {
  id: QuestId;
  title: string;
  category: string;
  durationMinutes: number;
  xpReward: number;
  description: string;
}

export interface UserProfile {
  id?: string;
  name?: string | null;
  xp: number;
  level: number;
  streakCount: number;
}

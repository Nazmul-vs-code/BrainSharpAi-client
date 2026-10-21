import type { Quest } from "@/types/quest";

export const QUEST_OPTIONS: Quest[] = [
  {
    id: "meditate-10-minutes",
    title: "Meditate for 10 minutes",
    category: "mental",
    durationMinutes: 10,
    xpReward: 10,
    description: "Take a few quiet minutes to focus on your breathing.",
  },
  {
    id: "move-your-body",
    title: "Move your body",
    category: "physical",
    durationMinutes: 10,
    xpReward: 10,
    description: "Complete a short exercise or stretching session.",
  },
  {
    id: "solve-a-puzzle",
    title: "Solve a puzzle",
    category: "puzzle",
    durationMinutes: 10,
    xpReward: 10,
    description: "Give your mind a workout with a short puzzle.",
  },
];

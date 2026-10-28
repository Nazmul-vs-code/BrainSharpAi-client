"use client";

import { motion } from "framer-motion";
import { Button, Card } from "@heroui/react";
import { Brain, Dumbbell, Play, Puzzle } from "lucide-react";
import type { Quest } from "@/types/quest";

const categoryStyles: Record<
  string,
  { Icon: typeof Brain }
> = {
  mental: { Icon: Brain },
  physical: { Icon: Dumbbell },
  puzzle: { Icon: Puzzle },
};

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  canStart: boolean;
  onStartActivity: (quest: Quest) => void;
}

export default function QuestCard({
  quest,
  isCompleted,
  canStart,
  onStartActivity,
}: QuestCardProps) {
  const category =
    categoryStyles[quest.category.toLowerCase()] ?? categoryStyles.puzzle;
  const CategoryIcon = category.Icon;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <Card
        className={`quest-glass-panel group relative flex h-full min-w-0 flex-col items-center overflow-hidden rounded-2xl p-2.5 transition-all duration-500 sm:p-3 ${
          isCompleted
            ? "border-emerald-300/25 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            : "hover:border-orange-400/25 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45),0_0_18px_rgba(255,107,0,0.06)]"
        }`}
        variant="secondary"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-16 size-40 rounded-full bg-orange-400/[0.07] blur-3xl transition-all duration-700 group-hover:bg-orange-400/[0.13] group-hover:scale-125"
        />
        <Card.Header className="relative flex w-full flex-col items-center gap-2 p-0">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.07] text-orange-200 shadow-[0_0_18px_rgba(255,107,0,0.08)] transition-all duration-300 group-hover:border-orange-300/35 group-hover:bg-orange-400/[0.12] group-hover:text-orange-100">
            <CategoryIcon aria-hidden="true" className="size-6" />
          </span>
          <Card.Title
            title={quest.title}
            className="w-full truncate text-center text-xs font-semibold leading-tight text-white"
          >
            {quest.title}
          </Card.Title>
          <span className="whitespace-nowrap rounded-full border border-orange-400/20 bg-orange-400/[0.06] px-2 py-1 text-[10px] font-bold text-orange-200">
            +{quest.xpReward} XP
          </span>
        </Card.Header>

        <Card.Footer className="relative mt-2 flex w-full justify-center border-t border-white/10 px-0 pt-2">
          <Button
            onPress={() => onStartActivity(quest)}
            isDisabled={!canStart}
            aria-label={
              canStart
                ? `${isCompleted ? "Do more" : "Start"}: ${quest.title}`
                : `Syncing: ${quest.title}`
            }
            className="group/button inline-flex size-9 min-h-9 min-w-9 items-center justify-center rounded-xl bg-white p-0 text-black shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play aria-hidden="true" className="size-4 fill-current" />
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card, Button } from "@heroui/react";
import { FaBrain, FaCheckCircle, FaDumbbell, FaPlay, FaPuzzlePiece, FaRegClock } from "react-icons/fa";
import type { Quest } from "@/types/quest";

const categoryStyles = {
  mental: {
    className: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    Icon: FaBrain,
  },
  physical: {
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    Icon: FaDumbbell,
  },
  puzzle: {
    className: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Icon: FaPuzzlePiece,
  },
} as const;

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  canStart: boolean;
  onStartActivity: (quest: Quest) => void;
}

export default function QuestCard({ quest, isCompleted, canStart, onStartActivity }: QuestCardProps) {
  const category = categoryStyles[quest.category as keyof typeof categoryStyles] ?? categoryStyles.puzzle;
  const CategoryIcon = category.Icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-950/20"
          : "border-neutral-800 bg-neutral-950/70 shadow-xl hover:border-orange-500/40"
      }`}
        variant="secondary"
      >
        <Card.Header className="flex flex-col gap-4 p-0">
          <div className="flex items-center justify-between gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${category.className}`}>
              <CategoryIcon aria-hidden="true" />
              {quest.category}
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300">
              +{quest.xpReward} XP
            </span>
          </div>
          <Card.Title className="text-xl font-bold text-white">{quest.title}</Card.Title>
        </Card.Header>

        <Card.Content className="px-0 py-4">
          <Card.Description className="text-sm leading-relaxed text-neutral-400">
            {quest.description}
          </Card.Description>
        </Card.Content>

        <Card.Footer className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-800/80 px-0 pt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <FaRegClock aria-hidden="true" className="text-neutral-500" />
            <span>{quest.durationMinutes} minutes</span>
          </div>

          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
              <FaCheckCircle aria-hidden="true" />
              Completed
            </span>
          ) : (
            <Button
              onPress={() => onStartActivity(quest)}
              isDisabled={!canStart}
              className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-md transition-all hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPlay aria-hidden="true" className="transition-transform group-hover:scale-110" />
              <span>{canStart ? "Start Activity" : "Syncing..."}</span>
            </Button>
          )}
        </Card.Footer>
      </Card>
    </motion.div>
  );
}
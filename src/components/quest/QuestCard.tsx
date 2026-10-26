"use client";

import { motion } from "framer-motion";
import { Button, Card } from "@heroui/react";
import {
  ArrowRight,
  Brain,
  Check,
  Clock3,
  Dumbbell,
  Puzzle,
} from "lucide-react";
import type { Quest } from "@/types/quest";

const categoryStyles: Record<
  string,
  { label: string; Icon: typeof Brain }
> = {
  mental: { label: "Mindfulness", Icon: Brain },
  physical: { label: "Movement", Icon: Dumbbell },
  puzzle: { label: "Brain training", Icon: Puzzle },
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border p-5 backdrop-blur-2xl transition-all duration-500 sm:p-6 ${
          isCompleted
            ? "border-orange-500/30 bg-orange-950/10 shadow-[0_0_35px_rgba(249,115,22,0.06)]"
            : "border-orange-500/20 bg-neutral-900/30 shadow-[0_0_35px_rgba(249,115,22,0.06)] hover:border-orange-500/50 hover:shadow-[0_0_50px_rgba(249,115,22,0.15)]"
        }`}
        variant="secondary"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-16 size-40 rounded-full bg-orange-500/[0.06] blur-3xl transition-opacity duration-500 group-hover:bg-orange-500/10"
        />
        <Card.Header className="relative flex flex-col gap-5 p-0">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.08)]">
                <CategoryIcon aria-hidden="true" className="size-5" />
              </span>
              <span className="truncate rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-orange-300">
                {category.label}
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold text-amber-300">
              +{quest.xpReward} XP
            </span>
          </div>

          <Card.Title className="text-balance text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
            {quest.title}
          </Card.Title>
        </Card.Header>

        <Card.Content className="relative flex-1 px-0 py-4">
          <Card.Description className="text-sm leading-6 text-neutral-400">
            {quest.description}
          </Card.Description>
        </Card.Content>

        <Card.Footer className="relative mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-0 pt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Clock3 aria-hidden="true" className="size-4 text-orange-400/80" />
            <span>{quest.durationMinutes} min</span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/20 bg-orange-500/[0.08] px-2.5 py-2 text-[10px] font-semibold text-orange-300">
                <Check aria-hidden="true" className="size-3.5" />
                Done
              </span>
            )}
            <Button
              onPress={() => onStartActivity(quest)}
              isDisabled={!canStart}
              className="group/button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-4 text-xs font-bold text-black shadow-[0_6px_20px_rgba(249,115,22,0.13)] transition-all duration-300 hover:shadow-[0_8px_26px_rgba(249,115,22,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                {canStart
                  ? isCompleted
                    ? "Do more"
                    : "Start Activity"
                  : "Syncing..."}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-1"
              />
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}

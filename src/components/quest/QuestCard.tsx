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
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <Card
        className={`quest-glass-panel group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl p-5 transition-all duration-500 sm:p-6 ${
          isCompleted
            ? "border-emerald-300/25 shadow-[0_18px_45px_rgba(0,0,0,0.4)]"
            : "hover:border-orange-400/25 hover:shadow-[0_24px_55px_rgba(0,0,0,0.55),0_0_24px_rgba(255,107,0,0.06)]"
        }`}
        variant="secondary"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-16 size-40 rounded-full bg-orange-400/[0.07] blur-3xl transition-all duration-700 group-hover:bg-orange-400/[0.13] group-hover:scale-125"
        />
        <Card.Header className="relative flex flex-col gap-5 p-0">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/[0.07] p-3 text-orange-200 shadow-[0_0_18px_rgba(255,107,0,0.08)] transition-all duration-300 group-hover:border-orange-300/35 group-hover:bg-orange-400/[0.12] group-hover:text-orange-100">
                <CategoryIcon aria-hidden="true" className="size-5" />
              </span>
              <span className="truncate rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300">
                {category.label}
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-orange-400/20 bg-orange-400/[0.06] px-3 py-1.5 text-[11px] font-bold text-orange-200">
              +{quest.xpReward} XP
            </span>
          </div>

          <Card.Title className="text-balance text-lg font-semibold leading-snug tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] sm:text-xl">
            {quest.title}
          </Card.Title>
        </Card.Header>

        <Card.Content className="relative flex-1 px-0 py-4">
          <Card.Description className="text-sm leading-6 text-slate-300">
            {quest.description}
          </Card.Description>
        </Card.Content>

        <Card.Footer className="relative mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-0 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 aria-hidden="true" className="size-4 text-emerald-300/80" />
            <span>{quest.durationMinutes} min</span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] px-2.5 py-2 text-[10px] font-semibold text-emerald-200">
                <Check aria-hidden="true" className="size-3.5" />
                Done
              </span>
            )}
            <Button
              onPress={() => onStartActivity(quest)}
              isDisabled={!canStart}
              className="group/button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
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

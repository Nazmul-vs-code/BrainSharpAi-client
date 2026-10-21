"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Play, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";

interface Quest {
  id: number;
  title: string;
  category: string;
  durationMinutes: number;
  xpReward: number;
  description: string;
}

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onStartActivity: (quest: Quest) => void;
}

export default function QuestCard({ quest, isCompleted, onStartActivity }: QuestCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-950/20"
          : "border-neutral-800 bg-neutral-950/70 shadow-xl hover:border-orange-500/40"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            quest.category === "mental" 
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
              : quest.category === "physical"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
          }`}>
            <Sparkles size={12} />
            {quest.category.toUpperCase()}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            +{quest.xpReward} XP
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">{quest.description}</p>
      </div>

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4 mt-auto">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Clock size={15} className="text-neutral-500" />
          <span>{quest.durationMinutes} Minutes</span>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={16} />
            Completed
          </div>
        ) : (
          <Button
            onPress={() => onStartActivity(quest)}
            className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-md hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={14} className="transition-transform group-hover:scale-110" />
            <span>Start Activity</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy, ArrowRight } from "lucide-react";

interface QuestHeaderProps {
  level: number;
  xp: number;
  streak: number;
  name: string;
}

export default function QuestHeader({ level, xp, streak, name }: QuestHeaderProps) {
  const currentLevelXp = xp % 20;
  const progressPercentage = (currentLevelXp / 20) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 p-6 sm:p-8 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      {/* Crazy ambient animated glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-600/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-600/20 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
          >
            <Sparkles size={13} className="animate-spin" />
            Daily Challenge Active
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">{name || "Explorer"}</span> 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-xl">
            Complete your daily micro-habits to sharpen your mind, boost your cognitive flow, and level up.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-4">
          {/* Streak Badge with Burning Fire Animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative flex items-center gap-3.5 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-neutral-900/80 px-5 py-3.5 shadow-[0_0_25px_rgba(249,115,22,0.15)] backdrop-blur-xl"
          >
            {/* Burning Fire Flame Icon with Crazy Flicker & Pulse */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-t from-orange-600 to-amber-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.8)]">
              <motion.div
                animate={{
                  scale: [1, 1.18, 0.95, 1.12, 1],
                  rotate: [0, -4, 4, -2, 0],
                  filter: ["drop-shadow(0 0 2px #fff)", "drop-shadow(0 0 8px #ff4500)", "drop-shadow(0 0 2px #fff)"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Flame size={24} className="fill-black text-amber-200" />
              </motion.div>
              {/* Particle Sparks */}
              <motion.span
                animate={{ y: [-2, -12], opacity: [1, 0], scale: [0.8, 1.2] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute -top-1 right-2 h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#ff0]"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400/80">Streak</p>
              <p className="text-xl font-black text-white tracking-wide">{streak} <span className="text-xs font-medium text-neutral-400">Days</span></p>
            </div>
          </motion.div>

          {/* Level Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-neutral-900/80 px-5 py-3.5 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Trophy size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Rank</p>
              <p className="text-xl font-black text-white tracking-wide">Lvl {level}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-2.5">
          <span className="flex items-center gap-1.5">
            <span>Level {level}</span>
            <ArrowRight size={14} className="text-orange-400" />
            <span>Level {level + 1}</span>
          </span>
          <span className="text-orange-400 font-mono font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            {currentLevelXp} / 20 XP
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-900 border border-white/10 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)] relative"
          >
            {/* Shimmer light effect inside progress bar */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
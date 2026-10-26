"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy } from "lucide-react";

interface QuestHeaderProps {
  level: number;
  xp: number;
  streak: number;
  name: string;
  completedQuests: number;
  totalQuests: number;
  productiveEnoughProgress?: number;
}

function DailyProgressRing({
  completedQuests,
  totalQuests,
}: Pick<QuestHeaderProps, "completedQuests" | "totalQuests">) {
  const percentage =
    totalQuests > 0
      ? Math.min(100, Math.round((completedQuests / totalQuests) * 100))
      : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      aria-label={`${percentage}% of today's quests completed`}
      className="relative flex size-32 shrink-0 items-center justify-center sm:size-36"
      role="img"
    >
      <svg aria-hidden="true" className="size-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-white/[0.08]"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#quest-progress-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - percentage / 100),
          }}
          transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(249,115,22,0.65))",
          }}
        />
        <defs>
          <linearGradient id="quest-progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-white">
          {percentage}%
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Complete
        </span>
      </div>
    </div>
  );
}

export default function QuestHeader({
  level,
  xp,
  streak,
  name,
  completedQuests,
  totalQuests,
  productiveEnoughProgress,
}: QuestHeaderProps) {
  return (
    <motion.section
      aria-label="Your quest progress"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate overflow-hidden rounded-3xl border border-orange-500/20 bg-neutral-900/35 p-5 shadow-[0_0_45px_rgba(249,115,22,0.06)] backdrop-blur-2xl sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-orange-500/[0.09] blur-[90px]"
      />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-300">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Your daily control center
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
            {name ? (
              <>
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  {name}
                </span>
              </>
            ) : (
              "Your progress"
            )}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
            Small daily actions build a stronger mind. Keep your momentum going
            and make today count.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-black/25 px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 text-orange-300">
                <Flame aria-hidden="true" className="size-[18px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Streak
                </span>
                <span className="mt-0.5 block text-sm font-bold text-white">
                  {streak}{" "}
                  <span className="text-xs font-medium text-neutral-400">
                    days
                  </span>
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-black/25 px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                <Trophy aria-hidden="true" className="size-[18px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Level
                </span>
                <span className="mt-0.5 block text-sm font-bold text-white">
                  {level}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-black/25 px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 text-orange-300">
                <Sparkles aria-hidden="true" className="size-[17px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Total XP
                </span>
                <span className="mt-0.5 block text-sm font-bold text-white">
                  {xp.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          {productiveEnoughProgress !== undefined && (
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="font-medium text-neutral-300">
                  Productive Enough
                </p>
                <p className="text-neutral-500">
                  {productiveEnoughProgress}/30 days
                </p>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"
                role="progressbar"
                aria-label="Productive Enough badge progress"
                aria-valuemin={0}
                aria-valuemax={30}
                aria-valuenow={productiveEnoughProgress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 transition-[width]"
                  style={{ width: `${(productiveEnoughProgress / 30) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 self-center rounded-2xl border border-white/[0.06] bg-black/20 py-2 pl-4 pr-5 lg:self-auto">
          <DailyProgressRing
            completedQuests={completedQuests}
            totalQuests={totalQuests}
          />
          <div className="min-w-[90px]">
            <p className="text-sm font-semibold text-white">Today&apos;s goal</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              {completedQuests} of {totalQuests}{" "}
              {totalQuests === 1 ? "quest" : "quests"} complete
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

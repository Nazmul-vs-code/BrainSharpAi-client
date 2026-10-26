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
          className="text-white/10"
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
            filter:
              "drop-shadow(0 0 5px rgba(255,107,0,0.75)) drop-shadow(0 0 14px rgba(255,107,0,0.38))",
          }}
        />
        <defs>
          <linearGradient id="quest-progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5a1f" />
            <stop offset="62%" stopColor="#ff9d2e" />
            <stop offset="100%" stopColor="#8df5bd" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
          {percentage}%
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-200/70">
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
      className="quest-glass-panel rounded-3xl p-5 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-slate-200/[0.06] blur-[90px]"
      />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-200 shadow-sm">
            <Sparkles aria-hidden="true" className="size-3.5 text-orange-300" />
            Your daily control center
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-4xl">
            {name ? (
              <>
                Welcome back,{" "}
                <span className="text-orange-300 [text-shadow:0_0_18px_rgba(255,107,0,0.28)]">
                  {name}
                </span>
              </>
            ) : (
              "Your progress"
            )}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Small daily actions build a stronger mind. Keep your momentum going
            and make today count.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-sm">
              <span className="quest-streak-flame flex size-9 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-400/[0.08]">
                <Flame aria-hidden="true" className="quest-streak-icon size-[18px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Streak
                </span>
                <span className="mt-0.5 block text-sm font-bold text-white">
                  {streak}{" "}
                  <span className="text-xs font-medium text-slate-400">
                    days
                  </span>
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200">
                <Trophy aria-hidden="true" className="size-[18px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Level
                </span>
                <span className="mt-0.5 block text-sm font-bold text-white">
                  {level}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.06] text-orange-200">
                <Sparkles aria-hidden="true" className="size-[17px]" />
              </span>
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
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
                <p className="font-medium text-slate-200">
                  Productive Enough
                </p>
                <p className="text-slate-400">
                  {productiveEnoughProgress}/30 days
                </p>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Productive Enough badge progress"
                aria-valuemin={0}
                aria-valuemax={30}
                aria-valuenow={productiveEnoughProgress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-[width]"
                  style={{ width: `${(productiveEnoughProgress / 30) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 self-center rounded-2xl border border-white/10 bg-white/[0.045] py-2 pl-4 pr-5 shadow-sm backdrop-blur-xl lg:self-auto">
          <DailyProgressRing
            completedQuests={completedQuests}
            totalQuests={totalQuests}
          />
          <div className="min-w-[90px]">
            <p className="text-sm font-semibold text-white">Today&apos;s goal</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {completedQuests} of {totalQuests}{" "}
              {totalQuests === 1 ? "quest" : "quests"} complete
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

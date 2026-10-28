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
      className="relative size-12 shrink-0 sm:size-14 lg:size-16"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="size-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-white/10"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#quest-progress-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - percentage / 100),
          }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(255,107,0,0.5))",
          }}
        />
        <defs>
          <linearGradient
            id="quest-progress-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#ff5a1f" />
            <stop offset="62%" stopColor="#ff9d2e" />
            <stop offset="100%" stopColor="#8df5bd" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white sm:text-sm">
        {percentage}%
      </span>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  color,
  delay,
  accessibleLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color: "orange" | "green" | "amber";
  delay: number;
  accessibleLabel: string;
}) {
  const iconStyles = {
    orange: "border-orange-400/20 bg-orange-400/[0.08] text-orange-200",
    green: "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200",
    amber: "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
  }[color];

  return (
    <motion.div
      aria-label={accessibleLabel}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.045] px-1.5 py-2 text-center shadow-sm sm:flex-row sm:justify-start sm:gap-2 sm:px-3 sm:py-2.5 sm:text-left"
    >
      <span
        aria-hidden="true"
        className={`flex size-6 shrink-0 items-center justify-center rounded-lg border sm:size-8 sm:rounded-xl ${iconStyles}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400 sm:text-[9px] sm:tracking-[0.12em]">
          {label}
        </span>
        <span className="block truncate text-[11px] font-bold leading-tight text-white sm:mt-0.5 sm:text-sm">
          {value}
        </span>
      </span>
    </motion.div>
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
  const boundedBadgeProgress = Math.min(
    30,
    Math.max(0, productiveEnoughProgress ?? 0),
  );

  return (
    <motion.section
      aria-label="Your quest progress"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="quest-glass-panel relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-orange-400/[0.08] blur-[80px]"
      />

      <div className="mb-4 sm:mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-300 sm:text-xs">
          Your progress
        </p>
        <h1 className="mt-1 break-words text-2xl font-semibold tracking-[-0.04em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-3xl">
          {name ? (
            <>
              Welcome,{" "}
              <span className="text-orange-300 [text-shadow:0_0_18px_rgba(255,107,0,0.28)]">
                {name}
              </span>
            </>
          ) : (
            "Your quests"
          )}
        </h1>
      </div>

      <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-2 sm:grid-cols-4 sm:gap-3">
        <motion.div
          aria-label={`Today's goal: ${completedQuests} of ${totalQuests} ${totalQuests === 1 ? "quest" : "quests"} complete`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex min-w-0 items-center gap-2 rounded-xl border border-orange-400/15 bg-orange-400/[0.045] px-2 py-2 shadow-sm sm:gap-3 sm:px-3"
        >
          <DailyProgressRing
            completedQuests={completedQuests}
            totalQuests={totalQuests}
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold text-white sm:text-xs">
              Today&apos;s goal
            </p>
            <p className="mt-0.5 text-[9px] leading-tight text-slate-400 sm:hidden">
              {completedQuests} / {totalQuests} done
            </p>
            <p className="mt-0.5 hidden whitespace-nowrap text-[11px] leading-tight text-slate-400 sm:block">
              {completedQuests} of {totalQuests}{" "}
              {totalQuests === 1 ? "quest" : "quests"} complete
            </p>
          </div>
        </motion.div>

        <StatTile
          icon={<Flame className="quest-streak-icon size-3.5 sm:size-4" />}
          label="Streak"
          value={
            <>
              {streak}
              <span className="sm:hidden">d</span>
              <span className="hidden sm:inline">
                {" "}
                {streak === 1 ? "day" : "days"}
              </span>
            </>
          }
          color="orange"
          delay={0.16}
          accessibleLabel={`Streak: ${streak} ${streak === 1 ? "day" : "days"}`}
        />
        <StatTile
          icon={<Trophy className="size-3.5 sm:size-4" />}
          label="Level"
          value={level}
          color="green"
          delay={0.22}
          accessibleLabel={`Level ${level}`}
        />
        <StatTile
          icon={<Sparkles className="size-3.5 sm:size-4" />}
          label="Total XP"
          value={xp.toLocaleString()}
          color="amber"
          delay={0.28}
          accessibleLabel={`${xp.toLocaleString()} total XP`}
        />
      </div>

      {productiveEnoughProgress !== undefined && (
        <div className="mt-4 max-w-md sm:mt-5">
          <div className="flex items-center justify-between gap-3 text-[10px] sm:text-xs">
            <p className="font-medium text-slate-200">Productive Enough</p>
            <p className="text-slate-400">
              {boundedBadgeProgress}/30 days
            </p>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Productive Enough badge progress"
            aria-valuemin={0}
            aria-valuemax={30}
            aria-valuenow={boundedBadgeProgress}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(boundedBadgeProgress / 30) * 100}%` }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 shadow-[0_0_12px_rgba(255,107,0,0.3)]"
            />
          </div>
        </div>
      )}
    </motion.section>
  );
}

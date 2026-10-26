"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@heroui/react";
import {
  Activity,
  Check,
  Clock3,
  Flame,
  Loader2,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FetchData } from "@/lib/api/FetchData";

interface ActivityGraphProps {
  session?: {
    session?: { userId?: string };
    user?: { id?: string };
  };
}

interface QuestProgressItem {
  id: number;
  questId: number;
  assignedDate: string;
  completedDate: string | null;
  status: "pending" | "completed";
  quest: {
    title: string;
    category: string;
    durationMinutes: number;
    xpReward: number;
    description: string;
  };
}

interface ActivityPoint {
  date: string;
  entries: QuestProgressItem[];
  [key: string]: string | number | QuestProgressItem[];
}

const categoryColors: Record<string, { chart: string; soft: string; text: string }> = {
  mental: { chart: "#fb923c", soft: "bg-orange-500/15", text: "text-orange-300" },
  physical: { chart: "#34d399", soft: "bg-emerald-500/15", text: "text-emerald-300" },
  puzzle: { chart: "#fbbf24", soft: "bg-amber-500/15", text: "text-amber-300" },
};
const fallbackCategoryColors = [
  { chart: "#fb923c", soft: "bg-orange-500/15", text: "text-orange-300" },
  { chart: "#34d399", soft: "bg-emerald-500/15", text: "text-emerald-300" },
  { chart: "#fbbf24", soft: "bg-amber-500/15", text: "text-amber-300" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readQuestProgress(data: unknown): QuestProgressItem[] {
  const items = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.data)
      ? data.data
      : null;

  if (!items) {
    throw new Error("The quest progress response did not contain a list.");
  }

  return items.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "number" ||
      typeof item.questId !== "number" ||
      typeof item.assignedDate !== "string" ||
      (item.status !== "pending" && item.status !== "completed") ||
      !isRecord(item.quest) ||
      typeof item.quest.title !== "string" ||
      typeof item.quest.category !== "string" ||
      typeof item.quest.durationMinutes !== "number" ||
      typeof item.quest.xpReward !== "number" ||
      typeof item.quest.description !== "string"
    ) {
      throw new Error("The quest progress response contains invalid data.");
    }

    return {
      id: item.id,
      questId: item.questId,
      assignedDate: item.assignedDate,
      completedDate: typeof item.completedDate === "string" ? item.completedDate : null,
      status: item.status,
      quest: {
        title: item.quest.title,
        category: item.quest.category,
        durationMinutes: item.quest.durationMinutes,
        xpReward: item.quest.xpReward,
        description: item.quest.description,
      },
    };
  });
}

function categoryKey(category: string): string {
  return category.trim().toLowerCase() || "uncategorized";
}

function getCategoryColors(category: string) {
  if (categoryColors[category]) return categoryColors[category];
  const hash = [...category].reduce((value, character) => value + character.charCodeAt(0), 0);
  return fallbackCategoryColors[hash % fallbackCategoryColors.length];
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, options ?? { month: "short", day: "numeric", year: "numeric" });
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function isActivityPoint(value: unknown): value is ActivityPoint {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    Array.isArray(value.entries)
  );
}

export default function ActivityGraph({ session }: ActivityGraphProps) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<QuestProgressItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredPoint, setHoveredPoint] = useState<ActivityPoint | null>(null);
  const [pinnedPoint, setPinnedPoint] = useState<ActivityPoint | null>(null);
  const suppressHoverRef = useRef(false);
  const userId = session?.session?.userId || session?.user?.id;

  useEffect(() => {
    let isActive = true;

    const fetchUserProgress = async () => {
      if (!userId) {
        setEntries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await FetchData<unknown>("/api/quest/progress", {
          params: { userId },
        });
        if (response.error || response.data === undefined) {
          throw new Error(response.error || "Unable to load quest progress.");
        }
        const progress = readQuestProgress(response.data);
        if (isActive) setEntries(progress);
      } catch (err) {
        console.error("Failed to fetch activity graph data:", err);
        if (isActive) {
          setEntries([]);
          setError(err instanceof Error ? err.message : "Unable to load quest progress.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchUserProgress();
    return () => {
      isActive = false;
    };
  }, [userId]);

  const categories = useMemo(
    () => Array.from(new Set(entries.map((entry) => categoryKey(entry.quest.category)))),
    [entries],
  );
  const visibleEntries = useMemo(
    () => entries
      .filter((entry) => selectedCategory === "all" || categoryKey(entry.quest.category) === selectedCategory)
      .sort((a, b) => b.assignedDate.localeCompare(a.assignedDate) || b.id - a.id)
      .slice(0, 6),
    [entries, selectedCategory],
  );
  const chartData = useMemo(() => {
    const byDate: Record<string, ActivityPoint> = {};
    entries.forEach((entry) => {
      const date = entry.assignedDate.slice(0, 10);
      if (!byDate[date]) byDate[date] = { date, entries: [] };
      byDate[date].entries.push(entry);
      const key = categoryKey(entry.quest.category);
      const statusKey = `${key}${entry.status === "completed" ? "Completed" : "Pending"}`;
      byDate[date][statusKey] = Number(byDate[date][statusKey] ?? 0) + 1;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const completedCount = entries.filter((entry) => entry.status === "completed").length;
  const pendingCount = entries.length - completedCount;
  const totalXp = entries
    .filter((entry) => entry.status === "completed")
    .reduce((total, entry) => total + entry.quest.xpReward, 0);
  const activePoint = pinnedPoint ?? hoveredPoint;
  const activePointEntries =
    activePoint?.entries.filter(
      (entry) =>
        selectedCategory === "all" ||
        categoryKey(entry.quest.category) === selectedCategory,
    ) ?? [];
  const completedForActivePoint = activePointEntries.filter(
    (entry) => entry.status === "completed",
  ).length;

  if (loading) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-3xl border border-orange-500/20 bg-[#050507]">
        <Loader2 size={26} className="animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-6 w-full min-w-0 overflow-hidden rounded-3xl border border-orange-500/20 bg-neutral-900/40 p-4 shadow-[0_0_40px_rgba(249,115,22,0.06)] backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-300">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Quest activity</h2>
              <p className="text-xs text-neutral-400">{entries.length} quest logs · all time</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-300">Completed</p>
              <p className="mt-0.5 text-xl font-black text-white">{completedCount}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">In progress</p>
              <p className="mt-0.5 text-xl font-black text-white">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">XP earned</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xl font-black text-white">
                <Trophy size={15} className="text-amber-300" />
                {totalXp}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex min-h-56 items-center justify-center rounded-2xl border border-orange-500/20 bg-neutral-900/60 px-4 text-center text-sm text-orange-200">
            {error}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
            No quest activity yet.
          </div>
        ) : (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCategory("all");
                  setPinnedPoint(null);
                  setHoveredPoint(null);
                }}
                aria-pressed={selectedCategory === "all"}
                className={`min-h-24 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "border-orange-400/60 bg-orange-500/15 text-white shadow-[0_0_22px_rgba(249,115,22,0.16)]"
                    : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-orange-500/40 hover:bg-orange-500/[0.06]"
                }`}
              >
                <span className="block text-xs font-semibold">All activity</span>
                <span className="mt-1 block text-lg font-black">{entries.length}</span>
              </motion.button>
              {categories.map((category) => {
                const colors = getCategoryColors(category);
                const count = entries.filter((entry) => categoryKey(entry.quest.category) === category).length;
                return (
                  <motion.button
                    key={category}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedCategory(category);
                      setPinnedPoint(null);
                      setHoveredPoint(null);
                    }}
                    aria-pressed={selectedCategory === category}
                    className={`min-h-24 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      selectedCategory === category
                        ? `${colors.soft} border-orange-400/60 text-white shadow-[0_0_22px_rgba(249,115,22,0.16)]`
                        : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-orange-500/40 hover:bg-orange-500/[0.06]"
                    }`}
                  >
                    <span className={`block text-xs font-semibold ${colors.text}`}>{formatCategory(category)}</span>
                    <span className="mt-1 block text-lg font-black">{count}</span>
                  </motion.button>
                );
              })}
            </div>

            <div
              className="relative h-72 w-full min-w-0 sm:h-80"
              onMouseLeave={() => {
                setHoveredPoint(null);
                suppressHoverRef.current = false;
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (suppressHoverRef.current || pinnedPoint) return;
                    const index = state?.activeTooltipIndex;
                    const point =
                      typeof index === "number" ? chartData[index] : undefined;
                    setHoveredPoint(isActivityPoint(point) ? point : null);
                  }}
                  onClick={(state) => {
                    const index = state?.activeTooltipIndex;
                    const point =
                      typeof index === "number" ? chartData[index] : undefined;
                    if (isActivityPoint(point)) {
                      suppressHoverRef.current = false;
                      setPinnedPoint(point);
                      setHoveredPoint(null);
                    }
                  }}
                >
                  <CartesianGrid stroke="#262626" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date: string) => formatDate(date, { month: "short", day: "numeric" })}
                    stroke="#737373"
                    tickLine={false}
                    axisLine={{ stroke: "#404040" }}
                    fontSize={11}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#737373"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    content={() => null}
                  />
                  {categories.map((category) => {
                    if (selectedCategory !== "all" && selectedCategory !== category) return null;
                    const color = getCategoryColors(category).chart;
                    return (
                      <ReactCategoryBars
                        key={category}
                        category={category}
                        color={color}
                      />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
              <AnimatePresence>
                {activePoint && (
                  <motion.aside
                    key={activePoint.date}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    role="dialog"
                    aria-label="Activity details"
                    className="absolute inset-x-2 top-2 z-20 max-h-[calc(100%-1rem)] overflow-hidden rounded-2xl border border-orange-500/25 bg-neutral-950/95 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.65),0_0_24px_rgba(249,115,22,0.1)] backdrop-blur-2xl sm:left-auto sm:right-2 sm:w-96"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-300">
                          {formatDate(activePoint.date)}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {completedForActivePoint} completed ·{" "}
                          {activePointEntries.length - completedForActivePoint} pending
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="outline"
                        aria-label="Close activity details"
                        onPress={() => {
                          setPinnedPoint(null);
                          setHoveredPoint(null);
                          suppressHoverRef.current = true;
                        }}
                        className="shrink-0 border-neutral-700 bg-neutral-900 text-neutral-200 transition-colors hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white"
                      >
                        <X aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                    <div className="max-h-52 space-y-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-60">
                      {activePointEntries.map((entry) => {
                        const colors = getCategoryColors(
                          categoryKey(entry.quest.category),
                        );
                        return (
                          <div
                            key={entry.id}
                            className="rounded-xl border border-neutral-800 bg-neutral-900/75 p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-white">
                                {entry.quest.title}
                              </p>
                              <span
                                className={`shrink-0 text-[10px] font-bold ${colors.text}`}
                              >
                                {formatCategory(entry.quest.category)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-neutral-400">
                              {entry.quest.description}
                            </p>
                            <p className="mt-2 text-[11px] text-neutral-300">
                              {entry.status === "completed" ? "Completed" : "Pending"}
                              {entry.completedDate
                                ? ` · ${formatDate(entry.completedDate)}`
                                : ""}
                              {" · "}
                              {entry.quest.durationMinutes} min · {entry.quest.xpReward} XP
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
              {categories
                .filter((category) => selectedCategory === "all" || selectedCategory === category)
                .map((category) => (
                  <span key={category} className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: getCategoryColors(category).chart }} />
                    {formatCategory(category)}
                  </span>
                ))}
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-white/25" />
                Pending
              </span>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white sm:text-base">Quest history</h3>
                <span className="text-xs text-neutral-500">Latest {visibleEntries.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleEntries.map((entry, index) => {
                  const category = categoryKey(entry.quest.category);
                  const colors = getCategoryColors(category);
                  const isCompleted = entry.status === "completed";
                  return (
                    <motion.article
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(index * 0.025, 0.25) }}
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/65 p-4 transition-colors hover:border-orange-500/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-neutral-500">{formatDate(entry.assignedDate)}</p>
                          <h4 className="mt-1 truncate text-sm font-bold text-white">{entry.quest.title}</h4>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isCompleted ? "bg-orange-500/15 text-orange-300" : "bg-neutral-800 text-neutral-300"
                        }`}>
                          {isCompleted ? <Check size={12} /> : <Clock3 size={12} />}
                          {isCompleted ? "Done" : "Pending"}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-400">{entry.quest.description}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800 pt-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${colors.soft} ${colors.text}`}>
                          {formatCategory(entry.quest.category)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                          <Clock3 size={12} /> {entry.quest.durationMinutes} min
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                          <Flame size={12} /> {entry.quest.xpReward} XP
                        </span>
                      </div>
                      {entry.completedDate && (
                        <p className="mt-2 text-[10px] text-neutral-500">
                          Completed {formatDate(entry.completedDate)}
                        </p>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}

function ReactCategoryBars({ category, color }: { category: string; color: string }) {
  return (
    <>
      <Bar
        dataKey={`${category}Completed`}
        name={`${formatCategory(category)} completed`}
        stackId="completed"
        fill={color}
        radius={[3, 3, 0, 0]}
        maxBarSize={24}
        isAnimationActive
      />
      <Bar
        dataKey={`${category}Pending`}
        name={`${formatCategory(category)} pending`}
        stackId="pending"
        fill={color}
        fillOpacity={0.3}
        radius={[3, 3, 0, 0]}
        maxBarSize={24}
        isAnimationActive
      />
    </>
  );
}

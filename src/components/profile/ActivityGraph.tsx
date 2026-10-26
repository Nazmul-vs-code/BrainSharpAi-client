"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Modal, useOverlayState } from "@heroui/react";
import {
  Activity,
  AlertTriangle,
  Check,
  Clock3,
  Flame,
  Loader2,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { FetchData } from "@/lib/api/FetchData";
import {
  getQuestProgressStatus,
  type QuestProgressStatus,
} from "@/lib/quest/questData";

export { getQuestProgressStatus } from "@/lib/quest/questData";

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

type QuestProgressEntry = Omit<QuestProgressItem, "status"> & {
  status: QuestProgressStatus;
};

interface ActivityPoint {
  date: string;
  entries: QuestProgressEntry[];
  completed: number;
  pending: number;
  missed: number;
  [key: string]: string | number | QuestProgressEntry[];
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

interface ActivityChartDotProps {
  cx?: number;
  cy?: number;
  payload?: unknown;
  color: string;
  onSelect: (point: ActivityPoint) => void;
}

function ActivityChartDot({
  cx,
  cy,
  payload,
  color,
  onSelect,
}: ActivityChartDotProps) {
  if (typeof cx !== "number" || typeof cy !== "number" || !isActivityPoint(payload)) {
    return null;
  }

  const selectPoint = () => onSelect(payload);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`View quest activity for ${formatDate(payload.date)}`}
      style={{ cursor: "pointer" }}
      onClick={(event) => {
        event.stopPropagation();
        selectPoint();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPoint();
        }
      }}
    >
      <circle cx={cx} cy={cy} r={12} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="#09090b"
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  );
}

interface ActivityDetailsModalProps {
  point: ActivityPoint;
  selectedCategory: string;
  onClose: () => void;
}

function ActivityDetailsModal({
  point,
  selectedCategory,
  onClose,
}: ActivityDetailsModalProps) {
  const modalState = useOverlayState({
    isOpen: true,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
  });
  const activityEntries = point.entries.filter(
    (entry) =>
      selectedCategory === "all" ||
      categoryKey(entry.quest.category) === selectedCategory,
  );

  return (
    <Modal state={modalState}>
      <Modal.Backdrop
        isDismissable
        className="bg-black/80 p-3 backdrop-blur-sm sm:p-4"
      >
        <Modal.Container
          placement="center"
          scroll="inside"
          size="lg"
          className="max-h-[90dvh] w-full p-2 sm:p-4"
        >
          <Modal.Dialog className="w-full max-w-lg overflow-hidden rounded-3xl border border-orange-500/25 bg-neutral-950/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.75),0_0_32px_rgba(249,115,22,0.12)] backdrop-blur-2xl">
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-neutral-800 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                  Activity details
                </p>
                <Modal.Heading className="mt-1 text-xl font-bold text-white">
                  {formatDate(point.date)}
                </Modal.Heading>
                <p className="mt-1 text-xs text-neutral-400">
                  {activityEntries.length} {activityEntries.length === 1 ? "quest" : "quests"} assigned
                </p>
              </div>
              <Modal.CloseTrigger
                aria-label="Close activity details"
                className="rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white"
              >
                <X aria-hidden="true" className="size-4" />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body className="max-h-[65dvh] space-y-3 overflow-y-auto p-5 sm:p-6">
              {activityEntries.map((entry) => {
                const status = entry.status;
                const statusStyles: Record<QuestProgressStatus, string> = {
                  completed: "border-orange-500/25 bg-orange-500/10 text-orange-300",
                  pending: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
                  missed: "border-red-500/30 bg-red-500/10 text-red-300",
                };
                const statusLabel =
                  status === "completed"
                    ? "Completed"
                    : status === "missed"
                      ? "Missed"
                      : "Pending";

                return (
                  <article
                    key={entry.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="min-w-0 flex-1 text-sm font-semibold text-white">
                        {entry.quest.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[status]}`}
                      >
                        {status === "completed" ? (
                          <Check size={12} />
                        ) : status === "missed" ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <Clock3 size={12} />
                        )}
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                      {entry.quest.description}
                    </p>
                    {status === "missed" && (
                      <p className="mt-2 text-xs font-medium text-red-300">
                        This quest was not completed by the end of its assigned day.
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-800 pt-3 text-[11px] text-neutral-300">
                      <span>Assigned {formatDate(entry.assignedDate)}</span>
                      {entry.completedDate && (
                        <span>Completed {formatDate(entry.completedDate)}</span>
                      )}
                      <span>{entry.quest.durationMinutes} min</span>
                      <span className="font-semibold text-amber-300">
                        {entry.quest.xpReward} XP
                      </span>
                    </div>
                  </article>
                );
              })}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default function ActivityGraph({ session }: ActivityGraphProps) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<QuestProgressItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPoint, setSelectedPoint] = useState<ActivityPoint | null>(null);
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
      if (!byDate[date]) {
        byDate[date] = {
          date,
          entries: [],
          completed: 0,
          pending: 0,
          missed: 0,
        };
      }
      const status = getQuestProgressStatus(entry);
      const normalizedEntry: QuestProgressEntry = { ...entry, status };
      byDate[date].entries.push(normalizedEntry);
      byDate[date][status] = Number(byDate[date][status] ?? 0) + 1;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);
  const filteredChartData = useMemo(
    () =>
      chartData.map((point) => {
        const filteredEntries =
          selectedCategory === "all"
            ? point.entries
            : point.entries.filter(
                (entry) => categoryKey(entry.quest.category) === selectedCategory,
              );
        return filteredEntries.reduce<ActivityPoint>(
          (result, entry) => {
            result[entry.status] += 1;
            result.entries.push(entry);
            return result;
          },
          {
            date: point.date,
            entries: [],
            completed: 0,
            pending: 0,
            missed: 0,
          },
        );
      }),
    [chartData, selectedCategory],
  );

  const displayedEntries = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        status: getQuestProgressStatus(entry),
      })),
    [entries],
  );
  const completedCount = displayedEntries.filter((entry) => entry.status === "completed").length;
  const pendingCount = displayedEntries.filter((entry) => entry.status === "pending").length;
  const missedCount = displayedEntries.filter((entry) => entry.status === "missed").length;
  const totalXp = entries
    .filter((entry) => entry.status === "completed")
    .reduce((total, entry) => total + entry.quest.xpReward, 0);

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
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-300">Missed</p>
              <p className="mt-0.5 text-xl font-black text-white">{missedCount}</p>
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
                  setSelectedPoint(null);
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
                      setSelectedPoint(null);
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

            <div className="relative h-72 w-full min-w-0 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredChartData}
                  margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  onClick={(state) => {
                    const index = state?.activeTooltipIndex;
                    const point =
                      typeof index === "number"
                        ? filteredChartData[index]
                        : undefined;
                    if (isActivityPoint(point)) setSelectedPoint(point);
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
                  <Tooltip cursor={false} content={() => null} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#f97316"
                    strokeWidth={3}
                    fill="#f97316"
                    fillOpacity={0.12}
                    dot={(props) => (
                      <ActivityChartDot
                        {...props}
                        color="#f97316"
                        onSelect={setSelectedPoint}
                      />
                    )}
                    activeDot={{ r: 5, stroke: "#fed7aa", strokeWidth: 2, fill: "#f97316" }}
                    isAnimationActive
                    animationDuration={900}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    name="Pending"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    fill="#34d399"
                    fillOpacity={0.08}
                    dot={(props) => (
                      <ActivityChartDot
                        {...props}
                        color="#34d399"
                        onSelect={setSelectedPoint}
                      />
                    )}
                    activeDot={{ r: 5, stroke: "#a7f3d0", strokeWidth: 2, fill: "#34d399" }}
                    isAnimationActive
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="missed"
                    name="Missed"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="#ef4444"
                    fillOpacity={0.12}
                    dot={(props) => (
                      <ActivityChartDot
                        {...props}
                        color="#ef4444"
                        onSelect={setSelectedPoint}
                      />
                    )}
                    activeDot={{ r: 5, stroke: "#fecaca", strokeWidth: 2, fill: "#ef4444" }}
                    isAnimationActive
                    animationDuration={1100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {selectedPoint && (
              <ActivityDetailsModal
                point={selectedPoint}
                selectedCategory={selectedCategory}
                onClose={() => setSelectedPoint(null)}
              />
            )}

            <p className="mt-3 text-center text-xs text-neutral-500">
              Select any point on the activity waves to see what you did and what was missed.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Completed
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Pending
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Missed
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
                  const status = getQuestProgressStatus(entry);
                  const isCompleted = status === "completed";
                  const isMissed = status === "missed";
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
                          isCompleted
                            ? "bg-orange-500/15 text-orange-300"
                            : isMissed
                              ? "bg-red-500/15 text-red-300"
                              : "bg-emerald-500/15 text-emerald-300"
                        }`}>
                          {isCompleted ? (
                            <Check size={12} />
                          ) : isMissed ? (
                            <AlertTriangle size={12} />
                          ) : (
                            <Clock3 size={12} />
                          )}
                          {isCompleted ? "Done" : isMissed ? "Missed" : "Pending"}
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

"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { Modal, useOverlayState } from "@heroui/react";
import {
  AlertTriangle,
  Check,
  Clock3,
  Flame,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import type { QuestProgressStatus } from "@/lib/quest/questData";

interface ActivityEntry {
  id: number;
  assignedDate: string;
  completedDate: string | null;
  status: QuestProgressStatus;
  quest: {
    title: string;
    category: string;
    durationMinutes: number;
    xpReward: number;
    description: string;
  };
}

interface ActivityDataModalProps {
  point: {
    date: string;
    entries: ActivityEntry[];
  };
  selectedCategory: string;
  onClose: () => void;
}

const categoryPalette = [
  { chart: "#fb923c", text: "text-orange-300", bg: "bg-orange-400" },
  { chart: "#34d399", text: "text-emerald-300", bg: "bg-emerald-400" },
  { chart: "#fbbf24", text: "text-amber-300", bg: "bg-amber-400" },
  { chart: "#a78bfa", text: "text-violet-300", bg: "bg-violet-400" },
  { chart: "#38bdf8", text: "text-sky-300", bg: "bg-sky-400" },
];

function categoryKey(category: string): string {
  return category.trim().toLowerCase() || "uncategorized";
}

function formatDate(date: string): string {
  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryColor(category: string): (typeof categoryPalette)[number] {
  const key = categoryKey(category);
  if (key === "mental") return categoryPalette[0];
  if (key === "physical") return categoryPalette[1];
  if (key === "puzzle") return categoryPalette[2];
  const hash = [...key].reduce((value, character) => value + character.charCodeAt(0), 0);
  return categoryPalette[hash % categoryPalette.length];
}

export default function ActivityDataModal({
  point,
  selectedCategory,
  onClose,
}: ActivityDataModalProps) {
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
  const completedEntries = activityEntries.filter(
    (entry) => entry.status === "completed",
  );
  const focusedMinutes = completedEntries.reduce(
    (total, entry) => total + entry.quest.durationMinutes,
    0,
  );
  const categoryMinutes = Array.from(
    completedEntries.reduce((minutes, entry) => {
      const category = categoryKey(entry.quest.category);
      minutes.set(
        category,
        (minutes.get(category) ?? 0) + entry.quest.durationMinutes,
      );
      return minutes;
    }, new Map<string, number>()),
    ([category, minutes]) => ({
      category,
      minutes,
      color: getCategoryColor(category).chart,
      share: focusedMinutes > 0 ? Math.round((minutes / focusedMinutes) * 100) : 0,
    }),
  ).sort((a, b) => b.minutes - a.minutes);

  const statusStyles: Record<QuestProgressStatus, string> = {
    completed: "border-orange-500/25 bg-orange-500/10 text-orange-300",
    pending: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    missed: "border-red-500/30 bg-red-500/10 text-red-300",
  };
  const statusLabels: Record<QuestProgressStatus, string> = {
    completed: "Completed",
    pending: "Pending",
    missed: "Missed",
  };

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
          <Modal.Dialog className="w-full max-w-2xl overflow-hidden rounded-3xl border border-orange-500/25 bg-neutral-950/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.75),0_0_32px_rgba(249,115,22,0.12)] backdrop-blur-2xl">
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-neutral-800 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                  Activity details
                </p>
                <Modal.Heading className="mt-1 text-xl font-bold text-white">
                  {formatDate(point.date)}
                </Modal.Heading>
                <p className="mt-1 text-xs text-neutral-400">
                  {activityEntries.length}{" "}
                  {activityEntries.length === 1 ? "quest" : "quests"} assigned
                </p>
              </div>
              <Modal.CloseTrigger
                aria-label="Close activity details"
                className="rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white"
              >
                <X aria-hidden="true" className="size-4" />
              </Modal.CloseTrigger>
            </Modal.Header>

            <Modal.Body className="max-h-[72dvh] space-y-5 overflow-y-auto p-4 sm:p-6">
              <section
                aria-label={`${focusedMinutes} focused minutes by category`}
                className="grid gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:grid-cols-[minmax(160px,0.8fr)_1fr] sm:items-center sm:gap-6 sm:p-5"
              >
                <div className="relative mx-auto h-44 w-full max-w-[210px]">
                  {categoryMinutes.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryMinutes}
                          dataKey="minutes"
                          nameKey="category"
                          innerRadius="68%"
                          outerRadius="92%"
                          paddingAngle={4}
                          stroke="none"
                          isAnimationActive
                          animationBegin={100}
                          animationDuration={900}
                        >
                          {categoryMinutes.map((item) => (
                            <Cell key={item.category} fill={item.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="size-36 rounded-full border-[14px] border-white/[0.08]" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={focusedMinutes}
                      initial={{ opacity: 0, y: 7, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="text-3xl font-black tracking-tight text-white"
                    >
                      {focusedMinutes}
                    </motion.span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      minutes
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-white">
                      Focus time by category
                    </h3>
                    <span className="shrink-0 rounded-full border border-orange-400/20 bg-orange-400/[0.08] px-2.5 py-1 text-[10px] font-semibold text-orange-200">
                      {completedEntries.length} completed
                    </span>
                  </div>
                  {categoryMinutes.length > 0 ? (
                    <ul className="space-y-2.5">
                      {categoryMinutes.map((item, index) => {
                        const style = getCategoryColor(item.category);
                        return (
                          <motion.li
                            key={item.category}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            className="flex items-center gap-2.5"
                          >
                            <span
                              aria-hidden="true"
                              className={`size-2.5 shrink-0 rounded-full ${style.bg}`}
                            />
                            <span className="min-w-0 flex-1 truncate text-xs text-neutral-300">
                              {formatCategory(item.category)}
                            </span>
                            <span className={`text-xs font-bold ${style.text}`}>
                              {item.minutes} min
                            </span>
                            <span className="w-9 text-right text-[10px] text-neutral-500">
                              {item.share}%
                            </span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-3 text-xs leading-relaxed text-neutral-400">
                      Complete a quest to start building your focus-time
                      breakdown.
                    </p>
                  )}
                </div>
              </section>

              <section aria-label="Quests for this day" className="space-y-3">
                <h3 className="text-sm font-bold text-white">Quest details</h3>
                {activityEntries.map((entry, index) => {
                  const status = entry.status;
                  return (
                    <motion.article
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                            {formatCategory(entry.quest.category)}
                          </p>
                          <h4 className="mt-1 text-sm font-semibold text-white">
                            {entry.quest.title}
                          </h4>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[status]}`}
                        >
                          {status === "completed" ? (
                            <Check aria-hidden="true" size={12} />
                          ) : status === "missed" ? (
                            <AlertTriangle aria-hidden="true" size={12} />
                          ) : (
                            <Clock3 aria-hidden="true" size={12} />
                          )}
                          {statusLabels[status]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                        {entry.quest.description}
                      </p>
                      {status === "missed" && (
                        <p className="mt-2 text-xs font-medium text-red-300">
                          This quest was not completed by the end of its
                          assigned day.
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-800 pt-3 text-[11px] text-neutral-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 aria-hidden="true" className="size-3.5 text-sky-300" />
                          {entry.quest.durationMinutes} min{" "}
                          {status === "completed" ? "focused" : "planned"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                          <Flame aria-hidden="true" className="size-3.5" />
                          {entry.quest.xpReward} XP
                        </span>
                        {entry.completedDate && (
                          <span className="text-neutral-500">
                            Completed {formatDate(entry.completedDate)}
                          </span>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </section>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ListItem {
  userId: string;
  name: string;
  image?: string;
  xp?: number;
  level?: number;
  streakCount?: number;
  totalCategoryXp?: number;
}

interface ListProps {
  users: ListItem[];
}

export default function LeaderboardList({ users }: ListProps) {
  if (!users || users.length === 0) return null;

  return (
    <div className="space-y-3">
      {users.map((item, index) => {
        const rank = index + 4; // Since top 3 are in the podium

        return (
          <motion.div
            key={item.userId || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 backdrop-blur-xl hover:border-neutral-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 text-center font-bold text-sm text-neutral-500">
                {String(rank).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl p-0.5 bg-neutral-800">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-900 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-white text-xs">{item.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-neutral-400">Level {item.level || 1}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 text-orange-400 font-bold text-xs">
              <Sparkles size={13} />
              <span>{item.xp || item.totalCategoryXp || 0} XP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
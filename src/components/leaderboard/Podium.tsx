"use client";

import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface UserRank {
  userId: string;
  name: string;
  image?: string;
  xp?: number;
  totalCategoryXp?: number;
}

interface PodiumProps {
  topUsers: UserRank[];
}

export default function Podium({ topUsers }: PodiumProps) {
  const [first, second, third] = topUsers;

  if (!first) return null;

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {/* 2nd Place */}
      {second && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center flex-1 max-w-[120px]"
        >
          <div className="relative mb-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-black font-bold text-xs shadow-lg">
              2
            </div>
            <div className="h-16 w-16 rounded-2xl p-0.5 bg-gradient-to-b from-slate-300 to-slate-600 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-neutral-950 overflow-hidden">
                {second.image ? (
                  <img src={second.image} alt={second.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-bold text-white text-lg">{second.name[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs font-bold text-white truncate max-w-full mb-1">{second.name}</p>
          <div className="flex items-center gap-1 text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            <Sparkles size={11} />
            <span>{second.xp || second.totalCategoryXp || 0} XP</span>
          </div>
          <div className="mt-4 w-full h-24 bg-gradient-to-t from-neutral-900 to-neutral-900/60 rounded-t-2xl border-t border-x border-slate-400/30 flex items-center justify-center">
            <span className="text-3xl font-black text-slate-500/40">2</span>
          </div>
        </motion.div>
      )}

      {/* 1st Place (Center & Highest) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center flex-1 max-w-[130px] -mt-6"
      >
        <div className="relative mb-3">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
            <Crown size={28} className="fill-amber-400" />
          </div>
          <div className="h-20 w-20 rounded-3xl p-0.5 bg-gradient-to-b from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-neutral-950 overflow-hidden">
              {first.image ? (
                <img src={first.image} alt={first.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-white text-xl">{first.name[0]?.toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm font-extrabold text-white truncate max-w-full mb-1">{first.name}</p>
        <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles size={12} />
          <span>{first.xp || first.totalCategoryXp || 0} XP</span>
        </div>
        <div className="mt-4 w-full h-32 bg-gradient-to-t from-amber-950/40 via-neutral-900 to-neutral-900/80 rounded-t-2xl border-t border-x border-amber-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <span className="text-4xl font-black text-amber-500/40">1</span>
        </div>
      </motion.div>

      {/* 3rd Place */}
      {third && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center flex-1 max-w-[120px]"
        >
          <div className="relative mb-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-white font-bold text-xs shadow-lg">
              3
            </div>
            <div className="h-16 w-16 rounded-2xl p-0.5 bg-gradient-to-b from-amber-600 to-amber-900 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-neutral-950 overflow-hidden">
                {third.image ? (
                  <img src={third.image} alt={third.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-bold text-white text-lg">{third.name[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs font-bold text-white truncate max-w-full mb-1">{third.name}</p>
          <div className="flex items-center gap-1 text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            <Sparkles size={11} />
            <span>{third.xp || third.totalCategoryXp || 0} XP</span>
          </div>
          <div className="mt-4 w-full h-20 bg-gradient-to-t from-neutral-900 to-neutral-900/60 rounded-t-2xl border-t border-x border-amber-800/30 flex items-center justify-center">
            <span className="text-3xl font-black text-amber-800/40">3</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
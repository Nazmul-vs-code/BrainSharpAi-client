"use client";

import AICoachSection from "@/components/ai/AICoachSection";
import { Bot, Sparkles, Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrainSharpAIPage() {
  // Replace with your dynamic session/auth user ID from Better-Auth
  const currentUserId = "pscnKTJV2QpFL1eXFkXnCS2BM5LlHQsG";

  return (
    <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Radial Glow Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Navigation Bar Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
          <Link
            href="/quest"
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-orange-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
              Live RAG Service Connected
            </span>
          </div>
        </div>

        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
            <Sparkles size={14} />
            <span>RAG-Powered AI Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            BrainSharp <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">AI Mentor</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            Get personalized cognitive habit coaching, daily focus briefs, and actionable performance advice generated straight from your live database quest logs.
          </p>
        </motion.div>

        {/* Main AI Coach Section Component */}
        <AICoachSection userId={currentUserId} />

        {/* Bottom Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80">
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Brain size={18} />
            </div>
            <h4 className="font-bold text-white text-sm">Real-time Quest Retrieval</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Analyzes your latest completed physical, cognitive, and mental sessions dynamically.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bot size={18} />
            </div>
            <h4 className="font-bold text-white text-sm">Tailored Focus Briefs</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Considers your level milestones, total XP, and streak counts to guide your next step.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles size={18} />
            </div>
            <h4 className="font-bold text-white text-sm">Interactive Habit Chat</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ask direct questions to optimize your clarity, routine, and mental performance daily.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
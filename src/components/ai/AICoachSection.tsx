"use client";

import Image from "next/image";
import AICoachCard from "./AICoachCard";
import { motion } from "framer-motion";

interface AICoachSectionProps {
  userId: string;
}

export default function AICoachSection({ userId }: AICoachSectionProps) {
  return (
    <section className="relative w-full py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Animated Brand Banner */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 relative group"
        >
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black p-2 shadow-2xl">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/ai-coach-banner.png" // Save your generated ChatGPT DALL-E image in public/ai-coach-banner.png
                alt="BrainSharp AI Coach"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="inline-block rounded-full bg-orange-500/20 border border-orange-500/40 px-3 py-1 text-[10px] font-bold text-orange-400 uppercase tracking-widest backdrop-blur-md">
                RAG Engine V1
              </span>
              <h4 className="text-xl font-black text-white">Adaptive Cognitive Mentor</h4>
              <p className="text-xs text-neutral-400">
                Grounded directly in your real-time quest logs, level milestones, and daily habits.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive AI Coach Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <AICoachCard userId={userId} />
        </motion.div>

      </div>
    </section>
  );
}
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function Loading() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Synchronizing your BrainSharp workspace"
      className="fixed inset-0 z-[100] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050507] text-zinc-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.07] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_72%)]" />
      </div>

      <motion.div
        className="relative flex flex-col items-center px-6 text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-orange-500/20"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 18, repeat: Infinity, ease: "linear" }
            }
          >
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300 shadow-[0_0_14px_rgba(251,146,60,0.9)]" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-3 rounded-full border border-dashed border-amber-400/30"
            animate={shouldReduceMotion ? undefined : { rotate: -360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 28, repeat: Infinity, ease: "linear" }
            }
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-7 rounded-full border border-orange-300/20"
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.08, 1], opacity: [0.4, 0.85, 0.4] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <div className="absolute inset-12 rounded-full bg-orange-500/10 shadow-[0_0_45px_rgba(249,115,22,0.18)] backdrop-blur-2xl sm:inset-14" />
          <motion.div
            className="relative flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-orange-400/30 bg-neutral-900/70 text-orange-300 shadow-[0_0_40px_rgba(249,115,22,0.2)] sm:h-24 sm:w-24"
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.06, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <BrainCircuit aria-hidden="true" className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.35} />
          </motion.div>
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-300/80 to-transparent shadow-[0_0_18px_rgba(251,146,60,0.8)]"
              animate={{ y: [-58, 58], opacity: [0, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {!shouldReduceMotion &&
            [
              "left-4 top-1/4",
              "right-2 top-1/3",
              "left-6 bottom-1/4",
              "right-5 bottom-1/4",
            ].map((position, index) => (
              <motion.span
                key={position}
                aria-hidden="true"
                className={`absolute ${position} h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]`}
                animate={{ y: [0, -10, 0], opacity: [0.25, 1, 0.25] }}
                transition={{
                  duration: 2 + index * 0.35,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
        </div>

        <p className="mt-8 font-display text-xs font-medium uppercase tracking-[0.3em] text-orange-200 sm:text-sm">
          Neural synchronization
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Preparing your cognitive workspace
        </p>
        <div
          aria-hidden="true"
          className="mt-6 flex items-center gap-1.5"
        >
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-orange-400"
              animate={
                shouldReduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 1.2,
                      delay: dot * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

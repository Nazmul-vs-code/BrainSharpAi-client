"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Compass,
  Radio,
  SignalZero,
} from "lucide-react";

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-[#050507] px-5 py-16 text-zinc-100 md:min-h-[calc(100svh-4rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49.8%,rgba(249,115,22,0.035)_50%,transparent_50.2%)] bg-[length:100%_6px] opacity-40" />
      </div>

      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mb-5">
          <motion.p
            aria-hidden="true"
            className="select-none bg-gradient-to-b from-white via-orange-100 to-orange-500/60 bg-clip-text font-display text-[8rem] font-extrabold leading-none tracking-[-0.09em] text-transparent drop-shadow-[0_0_40px_rgba(249,115,22,0.2)] sm:text-[11rem] md:text-[14rem]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.82, 1, 0.88, 1],
                    textShadow: [
                      "0 0 24px rgba(249,115,22,0.12)",
                      "0 0 54px rgba(249,115,22,0.3)",
                      "0 0 30px rgba(249,115,22,0.16)",
                    ],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            404
          </motion.p>
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent shadow-[0_0_14px_rgba(251,146,60,0.8)]"
            animate={shouldReduceMotion ? undefined : { opacity: [0.15, 0.8, 0.15] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>

        <div className="relative mb-8 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-orange-400/20"
            animate={shouldReduceMotion ? undefined : { rotate: 360, scale: [1, 1.04, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { rotate: { duration: 24, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
            }
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-3 rounded-full border border-dashed border-amber-400/30"
            animate={shouldReduceMotion ? undefined : { rotate: -360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 34, repeat: Infinity, ease: "linear" }
            }
          />
          <div className="absolute inset-[1.4rem] rounded-full bg-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,0.15)] backdrop-blur-xl" />
          <motion.div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/30 bg-neutral-900/80 text-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
            animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <BrainCircuit aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
            <SignalZero
              aria-hidden="true"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#050507] p-0.5 text-amber-300"
            />
          </motion.div>
          <Radio
            aria-hidden="true"
            className="absolute -right-1 top-3 h-4 w-4 text-orange-200/70"
          />
        </div>

        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-3 py-1.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em] text-orange-300 sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
          Neural link interrupted · Error 404
        </p>
        <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Cognitive Anomaly Detected:
          <span className="mt-1 block bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
            Page Not Found
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-zinc-400 sm:text-base">
          This destination isn&apos;t in your neural map. The signal may have
          shifted, or the page may no longer exist. Let&apos;s get you back on
 course.
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-orange-400/30 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-3 text-sm font-semibold text-[#160b05] shadow-[0_0_30px_rgba(249,115,22,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(249,115,22,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Return to Home
          </Link>
          <Link
            href="/quest"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-orange-500/20 bg-neutral-900/50 px-5 py-3 text-sm font-medium text-zinc-100 shadow-[0_0_40px_rgba(249,115,22,0.08)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/40 hover:bg-orange-500/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
          >
            <Compass aria-hidden="true" className="h-4 w-4 text-orange-300" />
            Explore Quests
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

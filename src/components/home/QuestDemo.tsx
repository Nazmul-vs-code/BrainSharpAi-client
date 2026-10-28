"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const questScreens = [
  {
    src: "/home/quest-demo-1.png",
    alt: "Quest progress dashboard with daily goal, streak, level, and XP",
    className:
      "left-[2%] top-8 z-10 -rotate-[9deg] sm:left-[10%] sm:top-5 sm:-rotate-[11deg]",
    delay: 0.12,
    drift: -9,
  },
  {
    src: "/home/quest-demo-2.png",
    alt: "Daily quest cards for meditation, movement, and puzzles",
    className:
      "right-[2%] top-0 z-20 rotate-[8deg] sm:right-[10%] sm:top-0 sm:rotate-[10deg]",
    delay: 0.28,
    drift: 8,
  },
];

export default function QuestDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { once: true, amount: 0.25 });
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="quest-demo-heading"
      className="relative isolate overflow-hidden bg-[#050507] px-4 py-10 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.09] blur-[100px] sm:size-[34rem]"
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 22 }}
          animate={
            isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
          }
          transition={{
            duration: reducedMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300 sm:text-xs">
            Daily quests
          </p>
          <h2
            id="quest-demo-heading"
            className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl"
          >
            Small wins.
            <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Stronger habits.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7 lg:mx-0">
            Choose a quick meditation, movement, or puzzle quest. Track your
            streak, level, and XP as you build a daily routine.
          </p>
        </motion.div>

        <div
          ref={stageRef}
          className="relative mx-auto h-[390px] w-full max-w-[620px] sm:h-[520px] lg:h-[590px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-1/2 h-12 w-48 -translate-x-1/2 rounded-full bg-orange-500/25 blur-3xl sm:bottom-8 sm:w-72"
          />
          {questScreens.map((screen) => (
            <motion.div
              key={screen.src}
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 80,
                x: reducedMotion ? 0 : screen.drift * 2,
                rotate: reducedMotion ? 0 : screen.drift * 1.8,
                scale: reducedMotion ? 1 : 0.88,
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      x: 0,
                      rotate: reducedMotion ? 0 : screen.drift,
                      scale: 1,
                    }
                  : undefined
              }
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                delay: reducedMotion ? 0 : screen.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`absolute w-[min(48vw,248px)] [perspective:1200px] sm:w-[min(42vw,300px)] ${screen.className}`}
            >
              <motion.div
                animate={
                  isInView && !reducedMotion
                    ? { y: [0, screen.drift > 0 ? -9 : 8, 0] }
                    : undefined
                }
                transition={{
                  duration: screen.drift > 0 ? 5.2 : 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: screen.delay + 0.9,
                }}
                className="rounded-[2.4rem] border-[5px] border-[#303036] bg-[#111114] p-1.5 shadow-[0_35px_80px_-22px_rgba(0,0,0,0.95),0_0_48px_-24px_rgba(249,115,22,0.5)] sm:rounded-[3rem] sm:border-[6px] sm:p-2"
              >
                <div className="relative aspect-[0.61] overflow-hidden rounded-[1.95rem] border border-white/10 bg-[#08080a] sm:rounded-[2.45rem]">
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    priority={screen.delay < 0.2}
                    sizes="(max-width: 640px) 48vw, 300px"
                    className="object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-2 z-10 h-4 w-[28%] -translate-x-1/2 rounded-full border border-white/[0.06] bg-black/95 sm:top-2.5 sm:h-[18px]"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

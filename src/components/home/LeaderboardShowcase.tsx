"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  Crown,
  Globe2,
  Medal,
  Search,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";

interface Player {
  name: string;
  xp: number;
  initials: string;
  rank: number;
}

const podiumPlayers: Player[] = [
  { name: "Avery Morgan", xp: 42, initials: "AM", rank: 2 },
  { name: "Nazmul Huda", xp: 50, initials: "NH", rank: 1 },
  { name: "Jordan Lee", xp: 38, initials: "JL", rank: 3 },
];

const recentPlayers: Player[] = [
  { name: "Maya Chen", xp: 35, initials: "MC", rank: 4 },
  { name: "Ethan Patel", xp: 31, initials: "EP", rank: 5 },
];

const confettiParticles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: (index * 37 + 11) % 100,
  delay: (index % 9) * 0.06,
  size: index % 4 === 0 ? 5 : 3,
  isLine: index % 3 === 0,
}));

function CelebrationParticles({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {confettiParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-12px] ${
            particle.isLine
              ? "rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
              : "rounded-sm bg-orange-300 shadow-[0_0_9px_rgba(251,146,60,0.9)]"
          }`}
          style={{
            left: `${particle.left}%`,
            width: particle.isLine ? 2 : particle.size,
            height: particle.isLine ? 10 : particle.size,
          }}
          initial={{ y: -12, opacity: 0, rotate: 0 }}
          animate={{ y: 620, opacity: [0, 1, 0.9, 0], rotate: 360 }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function PodiumPlace({
  player,
  controls,
  reducedMotion,
}: {
  player: Player;
  controls: ReturnType<typeof useAnimationControls>;
  reducedMotion: boolean;
}) {
  const isWinner = player.rank === 1;
  const isSecond = player.rank === 2;
  const podiumHeight = isWinner ? "h-28" : isSecond ? "h-20" : "h-16";

  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 72 }}
      animate={controls}
      className={`relative flex min-w-0 flex-1 flex-col items-center ${
        isWinner ? "z-10" : "z-0"
      }`}
    >
      <div className="relative mb-2 flex flex-col items-center">
        {isWinner ? (
          <Crown
            aria-label="First place"
            className="mb-1 size-5 fill-amber-400 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
          />
        ) : (
          <span
            aria-label={`${player.rank}${player.rank === 2 ? "nd" : "rd"} place`}
            className={`mb-1 flex size-4 items-center justify-center rounded-full text-[9px] font-black ${
              isSecond
                ? "bg-slate-300 text-slate-950"
                : "bg-amber-800 text-amber-100"
            }`}
          >
            {player.rank}
          </span>
        )}
        <div
          className={`flex size-11 items-center justify-center rounded-2xl border text-xs font-bold ${
            isWinner
              ? "border-amber-300/80 bg-gradient-to-br from-amber-300 via-orange-400 to-amber-600 text-neutral-950 shadow-[0_0_28px_rgba(251,191,36,0.5)]"
              : isSecond
                ? "border-slate-300/50 bg-gradient-to-br from-slate-300 to-slate-600 text-slate-950"
                : "border-amber-700/60 bg-gradient-to-br from-amber-700 to-amber-950 text-amber-100"
          }`}
        >
          {player.initials}
        </div>
      </div>

      <p
        className={`max-w-full truncate text-center font-semibold ${
          isWinner ? "text-[11px] text-white" : "text-[10px] text-neutral-300"
        }`}
      >
        {player.name}
      </p>
      <span
        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
          isWinner
            ? "bg-amber-400/15 text-amber-300"
            : "bg-white/[0.06] text-neutral-400"
        }`}
      >
        <Sparkles aria-hidden="true" className="size-2.5" />
        {player.xp} XP
      </span>
      <div
        className={`mt-2 flex w-full items-center justify-center rounded-t-xl border-x border-t ${
          podiumHeight
        } ${
          isWinner
            ? "border-amber-400/40 bg-gradient-to-t from-amber-950/70 to-amber-400/15 shadow-[0_0_32px_rgba(245,158,11,0.2)]"
            : isSecond
              ? "border-slate-300/20 bg-gradient-to-t from-slate-900 to-slate-400/10"
              : "border-amber-800/30 bg-gradient-to-t from-neutral-900 to-amber-900/10"
        }`}
      >
        <span
          className={`font-black ${
            isWinner
              ? "text-4xl text-amber-300/70"
              : "text-3xl text-white/15"
          }`}
        >
          {player.rank}
        </span>
      </div>
    </motion.div>
  );
}

function PlayerRow({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="w-4 text-center text-[10px] font-bold text-neutral-500">
          {player.rank}
        </span>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-[9px] font-bold text-neutral-300">
          {player.initials}
        </span>
        <span className="truncate text-[10px] font-medium text-neutral-200">
          {player.name}
        </span>
      </div>
      <span className="ml-2 inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-orange-300">
        <Zap aria-hidden="true" className="size-2.5" />
        {player.xp} XP
      </span>
    </div>
  );
}

function LeaderboardPhone() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(phoneRef, { once: true, amount: 0.35 });
  const firstPlaceControls = useAnimationControls();
  const sidePlacesControls = useAnimationControls();
  const reducedMotion = Boolean(useReducedMotion());
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rankScope, setRankScope] = useState("Global Rank");

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;

    async function revealPodium() {
      setCelebrationActive(!reducedMotion);

      await firstPlaceControls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: reducedMotion ? 0 : 0.72,
          ease: [0.22, 1, 0.36, 1],
        },
      });

      if (cancelled) return;

      await sidePlacesControls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: reducedMotion ? 0 : 0.65,
          ease: [0.22, 1, 0.36, 1],
        },
      });
    }

    void revealPodium();

    return () => {
      cancelled = true;
    };
  }, [
    firstPlaceControls,
    isInView,
    reducedMotion,
    sidePlacesControls,
  ]);

  return (
    <motion.div
      ref={phoneRef}
      initial={{
        opacity: 0,
        x: reducedMotion ? 0 : 74,
        y: reducedMotion ? 0 : 76,
        rotate: reducedMotion ? 0 : 10,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, rotate: -4 }
          : {
              opacity: 0,
              x: reducedMotion ? 0 : 74,
              y: reducedMotion ? 0 : 76,
              rotate: reducedMotion ? 0 : 10,
            }
      }
      transition={{
        duration: reducedMotion ? 0 : 0.9,
        delay: reducedMotion ? 0 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto w-full max-w-[330px] [perspective:1200px]"
    >
      <div className="rounded-[3.1rem] border-[5px] border-[#29292e] bg-[#111114] p-2 shadow-[0_45px_100px_-28px_rgba(0,0,0,0.95),0_0_70px_-38px_rgba(249,115,22,0.45)]">
        <div className="relative h-[610px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08080a] px-4 pb-4 pt-5">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-30 h-5 w-[76px] -translate-x-1/2 rounded-full border border-white/[0.04] bg-black"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(249,115,22,0.12),transparent_48%)]"
          />
          <CelebrationParticles active={celebrationActive} />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between pt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-2.5 py-1 text-[9px] font-semibold tracking-wide text-amber-300">
                <Trophy aria-hidden="true" className="size-3" />
                HALL OF FAME
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                LIVE
              </span>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Leaderboard
                </h2>
                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Top minds, moving up
                </p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-orange-300">
                <Medal aria-hidden="true" className="size-4" />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 focus-within:border-orange-400/50">
                <Search
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-neutral-500"
                />
                <input
                  aria-label="Search players"
                  className="min-w-0 flex-1 bg-transparent text-[10px] text-white outline-none placeholder:text-neutral-500"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search players"
                  type="search"
                  value={searchQuery}
                />
              </label>
              <label className="relative flex h-9 w-[112px] shrink-0 items-center rounded-xl border border-white/10 bg-white/[0.04] px-2">
                <Globe2
                  aria-hidden="true"
                  className="mr-1.5 size-3 shrink-0 text-orange-300"
                />
                <select
                  aria-label="Leaderboard ranking scope"
                  className="w-full appearance-none bg-transparent pr-2 text-[9px] font-medium text-neutral-200 outline-none"
                  onChange={(event) => setRankScope(event.target.value)}
                  value={rankScope}
                >
                  <option className="bg-neutral-900" value="Global Rank">
                    Global Rank
                  </option>
                  <option className="bg-neutral-900" value="Weekly Rank">
                    Weekly Rank
                  </option>
                  <option className="bg-neutral-900" value="Friends Rank">
                    Friends Rank
                  </option>
                </select>
              </label>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-neutral-500">
                THIS WEEK&apos;S TOP 3
              </p>
              <span className="inline-flex items-center gap-1 text-[9px] text-neutral-500">
                <Sparkles aria-hidden="true" className="size-3 text-amber-400" />
                XP earned
              </span>
            </div>

            <div className="relative flex h-[232px] items-end justify-center gap-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] px-2 pt-3">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-5 h-24 rounded-full bg-amber-400/10 blur-3xl"
              />
              <div className="relative z-10 flex w-full items-end justify-center gap-2">
                {podiumPlayers.map((player) => (
                  <PodiumPlace
                    key={player.rank}
                    controls={
                      player.rank === 1
                        ? firstPlaceControls
                        : sidePlacesControls
                    }
                    player={player}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-neutral-500">
                CLIMBING THE RANKS
              </p>
              <span className="text-[9px] font-medium text-orange-300">
                View all
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {recentPlayers.map((player) => (
                <PlayerRow key={player.rank} player={player} />
              ))}
            </div>

            <div className="mt-auto flex items-center justify-center gap-1.5 pt-3 text-[9px] text-neutral-600">
              <Sparkles aria-hidden="true" className="size-3" />
              Small wins. Stronger minds.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardShowcase() {
  const router = useRouter();

  return (
    <section
      aria-labelledby="leaderboard-showcase-title"
      className="relative isolate overflow-hidden bg-[#050507] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.06] blur-[110px]"
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-[0.12em] text-orange-300">
            <Trophy aria-hidden="true" className="size-3.5" />
            YOUR NEXT LEVEL STARTS HERE
          </div>
          <h2
            id="leaderboard-showcase-title"
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl"
          >
            Dominate the
            <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Cognitive Arena.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8 lg:mx-0">
            Track your daily quests, mental fitness, and puzzle-solving rank in
            real time. Celebrate every small win, build your streak, and rise to
            the top of the global Hall of Fame.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              onPress={() => router.push("/leaderboard")}
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-extrabold text-black shadow-[0_12px_38px_rgba(249,115,22,0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_46px_rgba(249,115,22,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:translate-y-0"
            >
              Explore the leaderboard
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Button>
            <span className="text-xs font-medium text-neutral-500">
              Your next personal best is one quest away.
            </span>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-neutral-500 lg:justify-start">
            <span className="inline-flex items-center gap-2">
              <Zap aria-hidden="true" className="size-3.5 text-orange-400" />
              Earn XP every day
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 aria-hidden="true" className="size-3.5 text-orange-400" />
              Compete worldwide
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 h-12 w-56 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl"
          />
          <LeaderboardPhone />
        </div>
      </div>
    </section>
  );
}

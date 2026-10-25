"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Brain,
  Focus,
  Heart,
  Puzzle,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";

export interface BrainSharpHeroProps {
  eyebrow?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

const questCards = [
  {
    number: "01",
    category: "FOCUS TRAINING",
    title: "One thing at a time",
    description:
      "A short guided focus session to help you reset your attention and settle into the present.",
    duration: "5 min",
    icon: Focus,
    action: "Start a focus quest",
    href: "/quest",
    image:
      "https://images.pexels.com/photos/8740897/pexels-photo-8740897.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "A person in a quiet moment of reflection",
  },
  {
    number: "02",
    category: "MINDFULNESS",
    title: "Make room to breathe",
    description:
      "A calming breath practice to create a little space between a busy day and your next moment.",
    duration: "4 min",
    icon: Waves,
    action: "Explore mindfulness",
    href: "/quest",
    image:
      "https://images.pexels.com/photos/27582226/pexels-photo-27582226.jpeg",
    imageAlt: "A person practicing meditation",
  },
  {
    number: "03",
    category: "COGNITIVE AGILITY",
    title: "Find the pattern",
    description:
      "Wake up your working memory with a playful challenge built around noticing what comes next.",
    duration: "6 min",
    icon: Puzzle,
    action: "Try a brain game",
    href: "/brainsharp-ai",
    image:
      "https://images.pexels.com/photos/30708395/pexels-photo-30708395.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "A close-up of colorful puzzle pieces",
  },
  {
    number: "04",
    category: "EMOTIONAL WELLNESS",
    title: "Check in with yourself",
    description:
      "A gentle reflection prompt to help you notice how you feel and choose a thoughtful next step.",
    duration: "3 min",
    icon: Heart,
    action: "Explore your practice",
    href: "/quest",
    image:
      "https://images.pexels.com/photos/8133129/pexels-photo-8133129.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "A person writing in a notebook outdoors",
  },
  {
    number: "05",
    category: "DAILY MOMENTUM",
    title: "Build a small win",
    description:
      "Choose one achievable action, complete your daily quest, and make consistency feel more natural.",
    duration: "5 min",
    icon: Zap,
    action: "See today's quests",
    href: "/quest",
    image:
      "https://images.pexels.com/photos/6120402/pexels-photo-6120402.jpeg",
    imageAlt: "A woman practicing a stretch on a yoga mat",
  },
];

function QuestCardDeck({
  activeIndex,
  onNext,
  onPrevious,
  reduceMotion,
}: {
  activeIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="relative h-[350px] w-full sm:h-[410px]">
        {questCards.map((card, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={card.number}
              initial={
                reduceMotion ? false : { opacity: 0, x: "74%", scale: 0.92 }
              }
              animate={{
                opacity: distance === 0 ? 1 : distance === 1 ? 0.35 : 0,
                x: reduceMotion ? 0 : `${offset * 74}%`,
                y: reduceMotion ? 0 : distance * 10,
                scale: reduceMotion
                  ? isActive
                    ? 1
                    : 0.96
                  : isActive
                    ? 1
                    : distance === 1
                      ? 0.92
                      : 0.84,
                rotate: reduceMotion ? 0 : offset * 2.5,
              }}
              transition={{
                type: reduceMotion ? "tween" : "spring",
                stiffness: 180,
                damping: 26,
                mass: 0.75,
                duration: reduceMotion ? 0.2 : undefined,
              }}
              style={{ zIndex: questCards.length - distance }}
              aria-hidden={!isActive}
              className={`absolute left-1/2 top-1/2 w-[88%] max-w-[430px] -translate-x-1/2 -translate-y-1/2 ${
                isActive ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              <Card className="relative h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950 text-left shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:h-[370px]">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 640px) 88vw, 430px"
                  loading={index === activeIndex ? "eager" : "lazy"}
                  className="object-contain"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
                />
                <Card.Content className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
                  <h2 className="inline-block max-w-full rounded-2xl bg-black/45 px-4 py-3 text-balance font-sans text-2xl font-semibold leading-tight tracking-[-0.04em] text-white shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-md sm:text-4xl">
                    {card.title}
                  </h2>
                </Card.Content>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          isIconOnly
          isDisabled={activeIndex === 0}
          aria-label="Show previous quest"
          onPress={onPrevious}
          className="flex size-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] disabled:opacity-40"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Button>
        <div
          role="group"
          aria-label="Quest card progress"
          className="flex items-center gap-2 px-2"
        >
          {questCards.map((card, index) => (
            <span
              key={card.number}
              aria-label={`Quest ${index + 1}${index === activeIndex ? ", current" : ""}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-7 bg-orange-400"
                  : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
        <Button
          isIconOnly
          isDisabled={activeIndex === questCards.length - 1}
          aria-label="Show next quest"
          onPress={onNext}
          className="flex size-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] disabled:opacity-40"
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default function BrainSharpHero({
  eyebrow = "A little stronger, one day at a time",
  description = "Train your focus, make space for mindfulness, and build a steady mental fitness practice through small daily quests designed around real life.",
  primaryCtaText = "Start your practice",
  primaryCtaHref = "/quest",
  secondaryCtaText = "Meet your AI coach",
  secondaryCtaHref = "/brainsharp-ai",
  className = "",
}: BrainSharpHeroProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const visitedCardsRef = useRef(new Set([0]));
  const lastStepTimeRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const changeCard = (nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(questCards.length - 1, nextIndex));
    activeIndexRef.current = clampedIndex;
    visitedCardsRef.current.add(clampedIndex);
    setActiveIndex(clampedIndex);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const cardStage = cardStageRef.current;
    if (!section || !cardStage) return;

    const canCapture = (direction: number) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return false;

      const bounds = cardStage.getBoundingClientRect();
      const isStageVisible =
        bounds.top < window.innerHeight && bounds.bottom > 0;
      if (!isStageVisible) return false;

      if (direction > 0) {
        return (
          activeIndexRef.current < questCards.length - 1 ||
          visitedCardsRef.current.size < questCards.length
        );
      }

      return activeIndexRef.current > 0;
    };

    const advance = (direction: number) => {
      const now = Date.now();
      if (now - lastStepTimeRef.current < 650) return;
      lastStepTimeRef.current = now;
      changeCard(activeIndexRef.current + direction);
    };

    const handleWheel = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY);
      if (!direction || !canCapture(direction)) {
        wheelDeltaRef.current = 0;
        return;
      }

      event.preventDefault();
      wheelDeltaRef.current += event.deltaY;
      if (Math.abs(wheelDeltaRef.current) < 48) return;

      advance(Math.sign(wheelDeltaRef.current));
      wheelDeltaRef.current = 0;
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || currentY === undefined) return;

      const delta = startY - currentY;
      const direction = Math.sign(delta);
      if (!direction || !canCapture(direction)) return;

      event.preventDefault();
      if (Math.abs(delta) < 52) return;

      advance(direction);
      touchStartYRef.current = currentY;
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-grid-avoid
      className={`relative isolate min-h-[calc(100svh-4rem)] overflow-hidden font-sans text-white ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:26px_26px] opacity-35"
      />

      <div className="relative grid min-h-[calc(100svh-4rem)] w-full grid-cols-1 items-stretch gap-0 lg:grid-cols-[1fr_1fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 72 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduceMotion ? 0.25 : 0.85,
            delay: reduceMotion ? 0 : 0.58,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 flex flex-col items-start justify-center bg-[#050507] px-5 py-7 text-left sm:px-8 sm:py-9 lg:px-10 xl:px-14"
        >
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 0.9, 0], scaleY: [0, 1, 1, 0] }}
            transition={{
              duration: 1.25,
              ease: "easeInOut",
              times: [0, 0.18, 0.62, 1],
            }}
            className="pointer-events-none absolute -right-1 top-1/2 z-30 hidden h-32 w-px origin-center -translate-y-1/2 bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.8)] lg:block"
          />

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-2 text-[10px] font-semibold tracking-[0.14em] text-orange-300 backdrop-blur-md sm:mb-7 sm:text-xs">
            <Sparkles aria-hidden="true" className="size-3.5 text-orange-400" />
            {eyebrow}
          </div>

          <h1 className="max-w-[720px] text-balance font-sans text-[clamp(2.8rem,6.2vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-white">
            Train your
            <span className="text-orange-500"> mind.</span>
            <br />
            Find your
            <span className="block">next rhythm.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-sm leading-6 text-white/65 sm:mt-6 sm:text-base sm:leading-7">
            {description}
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              onPress={() => router.push(primaryCtaHref)}
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-6 text-sm font-bold text-black shadow-[0_12px_32px_rgba(255,255,255,0.08)] transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:scale-[0.98]"
            >
              {primaryCtaText}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Button>
            <Button
              onPress={() => router.push(secondaryCtaHref)}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:scale-[0.98]"
            >
              {secondaryCtaText}
              <ArrowDownRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-white/45 sm:mt-9">
            <span className="inline-flex items-center gap-2">
              <Brain aria-hidden="true" className="size-4 text-orange-400" />
              Train your attention
            </span>
            <span className="inline-flex items-center gap-2">
              <AudioLines aria-hidden="true" className="size-4 text-orange-400" />
              Find a moment of calm
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -72 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduceMotion ? 0.25 : 0.9,
            delay: reduceMotion ? 0 : 0.64,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 flex min-h-[520px] flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] px-3 py-5 backdrop-blur-2xl sm:px-6 sm:py-7 lg:min-h-[calc(100svh-8rem)] lg:rounded-none lg:border-y-0 lg:border-r-0 lg:bg-white/[0.045] lg:px-7 xl:px-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(255,255,255,0.13),transparent_58%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:22px_22px] opacity-[0.08]"
          />

          <div
            ref={cardStageRef}
            className="relative z-10 mx-auto flex w-full max-w-[600px] flex-col justify-center"
          >
            <div className="mb-4 flex items-center justify-between gap-4 px-1 sm:mb-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-orange-300">
                  YOUR PRACTICE
                </p>
                <p className="mt-1 hidden text-xs text-white/55 lg:block">
                  Scroll once to reveal each quest
                </p>
                <p className="mt-1 text-xs text-white/55 lg:hidden">
                  Use the arrows to explore quests
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-2 text-[10px] font-semibold text-white/70 backdrop-blur-md">
                <span className="size-1.5 animate-pulse rounded-full bg-orange-400" />
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(questCards.length).padStart(2, "0")}
              </span>
            </div>

            <QuestCardDeck
              activeIndex={activeIndex}
              onNext={() => changeCard(activeIndex + 1)}
              onPrevious={() => changeCard(activeIndex - 1)}
              reduceMotion={reduceMotion}
            />

            <p className="mt-3 text-center text-[10px] text-white/40">
              {activeIndex === questCards.length - 1
                ? "All quests explored"
                : "Use the arrows to continue"}
              <span className="hidden lg:inline">
                {activeIndex === questCards.length - 1
                  ? " — keep scrolling to continue"
                  : " or scroll to continue"}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { BrainSharpHero };

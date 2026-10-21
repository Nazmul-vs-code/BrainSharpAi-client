"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";

export interface HeroCardItem {
  id: string;
  title: string;
  image: string;
  alt: string;
}

export interface BrainSharpHeroProps {
  eyebrow?: string;
  typingPhrases?: string[];
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  cards?: HeroCardItem[];
  className?: string;
}

const defaultCards: HeroCardItem[] = [
  {
    id: "depression",
    title: "Get Out of Depression",
    image: "/images/depression.jpg",
    alt: "Meditation and emotional healing to overcome depression",
  },
  {
    id: "puzzles",
    title: "Solve Puzzles",
    image: "/images/puzzles.jpg",
    alt: "Cognitive brain puzzles and mental exercise",
  },
  {
    id: "brain-sharp",
    title: "Sharpen Your Brain",
    image: "/images/brain-sharp.jpg",
    alt: "Physical exercise and neurological stimulation to sharpen your brain",
  },
];

const defaultPhrases = [
  "Sharpen Your Mind & Body.",
  "Get Out of Depression.",
  "Solve Cognitive Puzzles.",
  "Daily Guided Meditation.",
  "Physical Health & Vitality.",
];

/**
 * Three-Card Compact Composition (\ | /)
 * Aligned flush to the right margin to match the navbar CTA button.
 * Hovering any individual card gives it upper index (z-50), scale, and straightens rotate.
 */
function HeroImageShowcase({ cards = defaultCards }: { cards?: HeroCardItem[] }) {
  // const { playSound } = useSound();
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const cardTransforms = [
    {
      // Left card (\)
      initialRotate: -7,
      initialX: -75,
      initialY: 8,
      spreadRotate: -5,
      spreadX: -125,
      spreadY: 0,
      floatDuration: 5.2,
      baseZ: 10,
    },
    {
      // Center card (|) - visual anchor
      initialRotate: 0,
      initialX: 0,
      initialY: -12,
      spreadRotate: 0,
      spreadX: 0,
      spreadY: -20,
      floatDuration: 4.6,
      baseZ: 20,
    },
    {
      // Right card (/)
      initialRotate: 7,
      initialX: 75,
      initialY: 8,
      spreadRotate: 5,
      spreadX: 125,
      spreadY: 0,
      floatDuration: 5.0,
      baseZ: 10,
    },
  ];

  return (
    <div
      data-grid-avoid
      className="relative flex w-full max-w-[480px] sm:max-w-[520px] items-center justify-center select-none"
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => {
        setIsContainerHovered(false);
        setHoveredCardId(null);
      }}
      tabIndex={0}
      role="region"
      aria-label="Interactive wellness cards"
    >
      {/* Ambient backdrop glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-[#8df5bd]/15 via-[#ff6b00]/10 to-transparent blur-3xl opacity-70"
      />

      <div className="relative flex h-[320px] sm:h-[370px] w-full items-center justify-center perspective-[1200px]">
        {cards.map((card, idx) => {
          const cfg = cardTransforms[idx] || cardTransforms[1];
          const isThisCardHovered = hoveredCardId === card.id;

          // Upper index on hover
          const zIndex = isThisCardHovered
            ? 50
            : isContainerHovered
            ? cfg.baseZ + 5
            : cfg.baseZ;

          let currentX = isContainerHovered ? cfg.spreadX : cfg.initialX;
          let currentY = isContainerHovered ? cfg.spreadY : cfg.initialY;
          let currentRotate = isContainerHovered ? cfg.spreadRotate : cfg.initialRotate;
          let currentScale = 1;

          if (isThisCardHovered) {
            currentScale = 1.12;
            currentRotate = 0;
            currentY -= 16;
          } else if (isContainerHovered && idx === 1 && !hoveredCardId) {
            currentScale = 1.05;
          }

          return (
            <motion.div
              key={card.id}
              className="absolute w-[165px] sm:w-[200px] md:w-[215px] cursor-pointer"
              style={{ zIndex }}
              onMouseEnter={() => {
                setHoveredCardId(card.id);
                playSound("hover", 0.35);
              }}
              onMouseLeave={() => setHoveredCardId(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                x: currentX,
                y: currentY,
                rotate: currentRotate,
                scale: currentScale,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
            >
              {/* Floating idle animation */}
              <motion.div
                animate={{
                  y: isThisCardHovered ? 0 : [0, -8, 0],
                }}
                transition={{
                  duration: cfg.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`group relative overflow-hidden rounded-2xl border bg-zinc-950/95 p-2 backdrop-blur-xl transition-all duration-300 ${
                  isThisCardHovered
                    ? "border-[#8df5bd] shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(141,245,189,0.35)]"
                    : "border-white/15 shadow-xl shadow-black/80 hover:border-white/35"
                }`}
              >
                {/* Image */}
                <div className="relative h-[190px] sm:h-[225px] w-full overflow-hidden rounded-xl bg-zinc-900">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 165px, 215px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    priority={idx === 1}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Pure white text underneath, no shadows */}
                <div className="px-1.5 pt-2 pb-0.5">
                  <h3 className="truncate text-center text-xs sm:text-sm font-semibold tracking-wide text-white">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Cinematic Animated Hero Component for BrainSharp AI
 *
 * Exact Animation Flow:
 * 1. The title appears in very big text in the center of the hero.
 * 2. Writes the full title with typing animation.
 * 3. Once written, it runs away to the left side into its main size.
 * 4. At the same time, the images make their entry from the right.
 * Both animations run in parallel for a high-velocity, video-edited feel!
 *
 * Color palette:
 * - Orange (#FF6B00): Title font color & typing cursor
 * - Soft Orange (#FFA24C): Special texts & eyebrow
 * - Green (#8df5bd): Accents, live badge, and highlights
 * - White (#FFFFFF): Normal texts, descriptions, and CTA
 * - Strictly NO shadows on texts.
 */
export default function BrainSharpHero({
  eyebrow = "Meditation, Movement & Mental Wellness",
  typingPhrases = defaultPhrases,
  description = "A mindful sanctuary uniting guided meditation, daily physical exercise, and cognitive brain puzzles to help you overcome depression, build psychological strength, and sharpen your mind.",
  primaryCtaText = "Start Your Practice",
  primaryCtaHref = "/workspace",
  secondaryCtaText = "Explore Wellness",
  secondaryCtaHref = "/features",
  cards = defaultCards,
  className = "",
}: BrainSharpHeroProps) {
  const { playSound, playTypingSound } = useSound();

  // DOM Refs for dynamic coordinate offset calculation
  const heroRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Animation State: false = Center Big, true = Docked on Left
  const [isDocked, setIsDocked] = useState(false);
  const [centerOffset, setCenterOffset] = useState({ x: 320, y: 30, scale: 1.65 });

  // Typewriter state
  const [currentText, setCurrentText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Measure the exact center vector between the left-docked anchor and the hero center
  useEffect(() => {
    const updateOffset = () => {
      if (!heroRef.current || !anchorRef.current) return;
      const heroRect = heroRef.current.getBoundingClientRect();
      const anchorRect = anchorRef.current.getBoundingClientRect();

      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top + heroRect.height / 2;

      const anchorCenterX = anchorRect.left + anchorRect.width / 2;
      const anchorCenterY = anchorRect.top + anchorRect.height / 2;

      const isMobile = window.innerWidth < 1024;

      setCenterOffset({
        x: heroCenterX - anchorCenterX,
        y: heroCenterY - anchorCenterY,
        scale: isMobile ? 1.25 : 1.65,
      });
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  // Typewriter Engine
  useEffect(() => {
    const firstPhrase = typingPhrases[0] || "Sharpen Your Mind & Body.";
    let timer: NodeJS.Timeout;

    if (!isDocked) {
      // Step 2: Type out the full initial phrase in the big centered position
      if (currentText.length < firstPhrase.length) {
        timer = setTimeout(() => {
          const nextLen = currentText.length + 1;
          setCurrentText(firstPhrase.slice(0, nextLen));
          playTypingSound();
        }, 45);
      } else {
        // Full title is written! Wait 300ms, then trigger the parallel run-away animation with transition sweep!
        timer = setTimeout(() => {
          playSound("sweep", 0.7);
          setIsDocked(true);
        }, 300);
      }
    } else {
      // Subsequent phrases loop smoothly on the left side
      const currentPhrase = typingPhrases[phraseIdx % typingPhrases.length];
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          timer = setTimeout(() => {
            const nextLen = currentText.length + 1;
            setCurrentText(currentPhrase.slice(0, nextLen));
            playTypingSound();
          }, 45 + Math.random() * 20);
        } else {
          timer = setTimeout(() => setIsDeleting(true), 2600);
        }
      } else {
        if (currentText.length > 0) {
          timer = setTimeout(() => {
            setCurrentText(currentPhrase.slice(0, currentText.length - 1));
          }, 28);
        } else {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % typingPhrases.length);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDocked, phraseIdx, isDeleting, typingPhrases, playSound, playTypingSound]);

  return (
    <section
      ref={heroRef}
      data-grid-avoid
      className={`relative w-full bg-[#050507]/95 border-b border-white/[0.08] backdrop-blur-3xl overflow-hidden ${className}`}
    >
      {/* 
        Hero Content Container:
        Exact same alignment and width as Navbar: max-w-7xl mx-auto px-6 lg:px-8.
        No extra vertical/horizontal gaps or margins.
      */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-8 sm:py-10 lg:py-14 min-h-[calc(100vh-64px)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
          
          {/*
            Left Column:
            Strictly left-aligned starting at the exact same horizontal position as the Navbar logo.
          */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20 w-full">
            
            {/* Special Text / Eyebrow Badge (Soft orange text, green pulse dot, no shadows) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isDocked ? 1 : 0,
                y: isDocked ? 0 : -10,
              }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/10 px-3.5 py-1.5 backdrop-blur-md"
            >
              <span className="size-2 rounded-full bg-[#8df5bd] animate-pulse" />
              <Activity className="size-3.5 text-[#8df5bd]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ffa24c]">
                {eyebrow}
              </span>
            </motion.div>

            {/* 
              Stationary Anchor + Dynamic Animated Title:
              Starts centered and big (scale 1.65, x: offset.x, y: offset.y).
              Runs away to (0, 0, scale 1.0) on the left side with spring velocity!
            */}
            <div ref={anchorRef} className="relative w-full min-h-[90px] sm:min-h-[110px] lg:min-h-[120px] flex items-center">
              <motion.div
                animate={{
                  x: isDocked ? 0 : centerOffset.x,
                  y: isDocked ? 0 : centerOffset.y,
                  scale: isDocked ? 1 : centerOffset.scale,
                }}
                transition={{
                  type: "spring",
                  stiffness: 135,
                  damping: 17,
                  mass: 0.7,
                }}
                style={{ transformOrigin: "left center" }}
                className="w-full"
              >
                {/* Title in vibrant futuristic orange font color, NO text shadows */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[#ff6b00] leading-[1.12]">
                  <span>{currentText}</span>
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[0.85em] w-[4px] bg-[#ff6b00] animate-pulse align-middle"
                  />
                </h1>
              </motion.div>
            </div>

            {/* Normal Text: Description (Pure white text, soft orange & green highlights, no shadows) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: isDocked ? 1 : 0,
                y: isDocked ? 0 : 15,
              }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white font-normal"
            >
              A mindful sanctuary uniting{" "}
              <span className="text-[#ffa24c] font-medium">guided meditation</span>,{" "}
              <span className="text-[#8df5bd] font-medium">daily physical exercise</span>, and{" "}
              <span className="text-white font-medium">cognitive puzzles</span> to help you{" "}
              <span className="text-[#ffa24c] font-medium">overcome depression</span>, build resilience, and elevate your psychological health.
            </motion.p>

            {/* Action Buttons (Strictly aligned to left, matching logo guide line) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: isDocked ? 1 : 0,
                y: isDocked ? 0 : 15,
              }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="mt-7 flex flex-wrap items-center gap-3.5"
            >
              {/* Primary Button: White background with dark text */}
              <Link
                href={primaryCtaHref}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 shadow-md transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              {/* Secondary Button: Dark transparent with subtle border */}
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-[#ff6b00]/60 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97]"
              >
                <Sparkles size={16} className="text-[#8df5bd]" />
                <span>{secondaryCtaText}</span>
              </Link>
            </motion.div>
          </div>

          {/*
            Right Column:
            Images make their entry in PARALLEL from the right (x: 500 -> 0)
            at the exact same time the title runs to the left!
            Strictly right-aligned to match the Navbar "Get started" button.
          */}
          <motion.div
            initial={{ opacity: 0, x: 500 }}
            animate={{
              opacity: isDocked ? 1 : 0,
              x: isDocked ? 0 : 500,
            }}
            transition={{
              type: "spring",
              stiffness: 135,
              damping: 17,
              mass: 0.7,
            }}
            className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full z-10"
          >
            <HeroImageShowcase cards={cards} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export { BrainSharpHero };

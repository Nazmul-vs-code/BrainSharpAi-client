"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, House, Info, Sparkles, Trophy } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";

const navigation = [
  { label: "Home", href: "/", icon: House },
  { label: "BrainSharp AI", href: "/brainsharp-ai", icon: Sparkles },
  { label: "The Quest", href: "/quest", icon: BrainCircuit },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "About", href: "/about", icon: Info },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { playSound } = useSound();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)_+_1rem)] z-0 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-full border border-neutral-800 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-2xl md:hidden"
    >
      <div className="flex items-center gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
              onClick={() => playSound("navigation", 0.7)}
              className={`relative z-0 flex size-10 items-center justify-center rounded-full transition-all duration-300 sm:size-12 ${
                active
                  ? "z-10 scale-105 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobileActiveTab"
                  transition={{ type: "spring", stiffness: 380, damping: 35 }}
                  className="absolute inset-0 z-0 rounded-full border border-orange-500/30 bg-neutral-800 shadow-lg"
                />
              )}
              {active && (
                <span className="absolute left-1/2 top-0 z-20 h-1 w-6 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-orange-400 to-amber-500 shadow-[0_4px_12px_rgba(249,115,22,0.8)]" />
              )}
              <Icon
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                className="relative z-10"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

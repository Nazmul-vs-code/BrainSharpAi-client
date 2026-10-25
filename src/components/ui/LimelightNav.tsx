"use client";

import React, {
  useState,
  cloneElement,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";

export type NavItem = {
  id: string | number;
  icon: React.ReactElement<{ className?: string }>;
  label?: string;
  href?: string;
  onClick?: () => void;
};

export type LimelightNavProps = {
  items?: NavItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item,
 * featuring interactive icon animations and tactile clicking feedback.
 */
export const LimelightNav = ({
  items = [],
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onTabChange,
  className = "",
  limelightClassName = "",
  iconContainerClassName = "",
  iconClassName = "",
}: LimelightNavProps) => {
  const { playSound } = useSound();
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internalActiveIndex;
  const [isFlashing, setIsFlashing] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    playSound("navigation", 0.75);
    setInternalActiveIndex(index);
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 450);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={`relative inline-flex items-center h-full bg-transparent text-foreground ${className}`}
    >
      {items.map(({ id, icon, label, href, onClick }, index) => {
        const isActive = activeIndex === index;
        const innerContent = (
          <>
            {isActive && (
              <motion.div
                layoutId="limelight-indicator"
                transition={{ layout: { type: "spring", stiffness: 380, damping: 35 } }}
                className={`pointer-events-none absolute left-1 right-1 top-0 z-30 h-[3.5px] rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(249,115,22,0.9),0_0_24px_rgba(249,115,22,0.7),0_1px_3px_rgba(251,191,36,1)] ${
                  isFlashing ? "animate-pulse" : ""
                } ${limelightClassName}`}
              >
                <div className="absolute left-[-15%] top-[3.5px] h-14 w-[130%] [clip-path:polygon(0%_100%,12%_0,88%_0,100%_100%)] bg-gradient-to-b from-orange-500/35 via-amber-500/10 to-transparent" />
              </motion.div>
            )}
            {/* Interactive Animated Nav Icon */}
            {cloneElement(icon, {
              className: `w-4 h-4 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isActive
                  ? "scale-110 opacity-100 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                  : "opacity-45 text-zinc-400 group-hover:text-orange-300 group-hover:opacity-100 group-hover:scale-125 group-hover:-translate-y-0.5 group-hover:-rotate-6"
              } group-active:scale-90 group-active:rotate-0 ${icon.props.className || ""} ${iconClassName}`,
            })}

            {/* Nav Label with subtle text hover & click dynamics */}
            {label && (
              <span
                className={`text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "opacity-100 text-orange-300 font-semibold drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
                    : "opacity-60 text-zinc-300 group-hover:opacity-100 group-hover:text-white group-hover:translate-x-0.5"
                } group-active:scale-95`}
              >
                {label}
              </span>
            )}
          </>
        );

        // Tactile click compression and spring hover styling
        const aClasses = `group relative z-20 flex h-full cursor-pointer select-none items-center justify-center gap-2.5 px-4 transition-all duration-200 hover:bg-white/[0.04] active:scale-95 active:translate-y-[1px] ${iconContainerClassName}`;

        if (href) {
          return (
            <Link
              key={id}
              href={href}
              className={aClasses}
              onClick={() => handleItemClick(index, onClick)}
              aria-label={label}
            >
              {innerContent}
            </Link>
          );
        }

        return (
          <a
            key={id}
            className={aClasses}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {innerContent}
          </a>
        );
      })}

    </nav>
  );
};

export default LimelightNav;

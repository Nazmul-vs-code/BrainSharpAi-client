"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  cloneElement,
  useCallback,
} from "react";
import Link from "next/link";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type NavItem = {
  id: string | number;
  icon: React.ReactElement<any>;
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
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = activeIndexProp !== undefined ? activeIndexProp : internalActiveIndex;
  const [isReady, setIsReady] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  const updateLimelight = useCallback(() => {
    if (!items || items.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const itemWidth = activeItem.offsetWidth;
      // Make the upper line wide enough to cover the icon and full text
      const targetWidth = Math.max(itemWidth - 6, 52);
      const newLeft = activeItem.offsetLeft + (itemWidth - targetWidth) / 2;

      limelight.style.width = `${targetWidth}px`;
      limelight.style.left = `${newLeft}px`;
      limelight.style.opacity = "1";

      if (!isReady) {
        setIsReady(true);
      }
    }
  }, [activeIndex, isReady, items]);

  useIsomorphicLayoutEffect(() => {
    updateLimelight();
    const timer = setTimeout(updateLimelight, 30);
    return () => clearTimeout(timer);
  }, [updateLimelight]);

  useEffect(() => {
    window.addEventListener("resize", updateLimelight);
    document.fonts?.ready.then(updateLimelight).catch(() => {});
    return () => window.removeEventListener("resize", updateLimelight);
  }, [updateLimelight]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
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
            {/* Interactive Animated Nav Icon */}
            {cloneElement(icon, {
              className: `w-4 h-4 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isActive
                  ? "scale-110 opacity-100 text-[#8df5bd] drop-shadow-[0_0_8px_rgba(141,245,189,0.8)]"
                  : "opacity-45 text-zinc-400 group-hover:text-emerald-300 group-hover:opacity-100 group-hover:scale-125 group-hover:-translate-y-0.5 group-hover:-rotate-6"
              } group-active:scale-90 group-active:rotate-0 ${(icon.props as any)?.className || ""} ${iconClassName}`,
            })}

            {/* Nav Label with subtle text hover & click dynamics */}
            {label && (
              <span
                className={`text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "opacity-100 text-[#8df5bd] font-semibold drop-shadow-[0_0_6px_rgba(141,245,189,0.5)]"
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
              ref={(el) => {
                navItemRefs.current[index] = el;
              }}
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
            ref={(el) => {
              navItemRefs.current[index] = el;
            }}
            className={aClasses}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {innerContent}
          </a>
        );
      })}

      {/* Adaptive full-width glowing upper line covering text & icon */}
      <div
        ref={limelightRef}
        className={`absolute top-0 z-30 h-[3.5px] rounded-full bg-[#8df5bd] shadow-[0_0_12px_#8df5bd,0_0_24px_rgba(141,245,189,0.7),0_1px_3px_rgba(141,245,189,1)] ${
          isReady ? "transition-[left,width] duration-300 ease-in-out" : ""
        } ${isFlashing ? "animate-limelight-flash" : ""} ${limelightClassName}`}
        style={{ left: "-999px", width: "52px", opacity: 0 }}
      >
        {/* Broad spotlight cone showering the entire icon & text in light */}
        <div className="absolute left-[-15%] top-[3.5px] w-[130%] h-14 [clip-path:polygon(0%_100%,12%_0,88%_0,100%_100%)] bg-gradient-to-b from-[#8df5bd]/35 via-[#8df5bd]/10 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};

export default LimelightNav;

"use client";

import * as React from "react";
import { GridPulse, type GridPulseProps } from "@/components/ui/grid-pulse";

export type GridPulseBackgroundProps = GridPulseProps;

export default function GridPulseBackground({
  cell = 28,
  reach = 2.6,
  ambient = 2,
  maxLit = 180,
  className,
  ...props
}: GridPulseBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <GridPulse
        cell={cell}
        reach={reach}
        ambient={ambient}
        maxLit={maxLit}
        className={className}
        {...props}
      />
    </div>
  );
}

export { GridPulseBackground, GridPulse };

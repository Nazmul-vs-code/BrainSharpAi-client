'use client';

import { CSSProperties, useId } from 'react';
import './LivingBrainLogo.css';

type LivingBrainLogoProps = {
  src?: string;
  width?: number | string;
  animationEnabled?: boolean;
  intensity?: number;
  pulseSpeed?: number;
  ambientGlow?: number;
  className?: string;
  alt?: string;
};

/**
 * Keeps the supplied PNG as the unchanged base image and draws a lightweight
 * SVG energy overlay above it. Path coordinates use the source PNG's 2103×748
 * coordinate system. They are hand-traced approximations, not pixel-perfect
 * reconstructions; tune PATHS below if the source artwork changes.
 */
export default function LivingBrainLogo({
  src = '/images/brainsharp-logo.png',
  width = 'min(100%, 1050px)',
  animationEnabled = true,
  intensity = 1,
  pulseSpeed = 1,
  ambientGlow = 0.45,
  className = '',
  alt = 'BrainSharp AI logo',
}: LivingBrainLogoProps) {
  const uid = useId().replace(/:/g, '');
  const safeIntensity = Math.max(0, Math.min(2, intensity));
  const safeSpeed = Math.max(0.25, Math.min(3, pulseSpeed));
  const style = {
    width,
    '--pulse-intensity': safeIntensity,
    '--ambient-intensity': Math.max(0, Math.min(1.5, ambientGlow)),
    '--pulse-speed': safeSpeed,
    '--flow-duration': `${2.8 / safeSpeed}s`,
  } as CSSProperties;

  return (
    <div className={`living-brain-logo ${className}`} style={style}>
      <img className="living-brain-logo__base" src={src} alt={alt} draggable={false} />
      {animationEnabled && (
        
<svg
  className="living-brain-logo__overlay"
  viewBox="0 0 2103 748"
  preserveAspectRatio="none"
  aria-hidden="true"
>

          <defs>
            {/* Clip masks constrain light to the icon, never the wordmark. */}
            <clipPath id={`${uid}-brain`}>
              <path d="M70 105 Q78 55 145 55 L330 52 Q480 57 540 155 Q585 225 548 300 Q520 340 468 350 L105 350 L102 310 Q95 250 100 185 Q95 135 70 105Z" />
            </clipPath>
            <clipPath id={`${uid}-circuits`}>
              <path d="M105 318 Q210 320 330 320 L485 345 Q565 365 580 450 L592 540 Q590 635 505 675 L160 675 Q85 670 65 640 L100 565 L100 390Z" />
            </clipPath>
            <filter id={`${uid}-green-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={`${uid}-amber-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id={`${uid}-green-trail`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#39ff88" stopOpacity="0" />
              <stop offset="0.65" stopColor="#39ff88" stopOpacity="0.35" />
              <stop offset="1" stopColor="#d7ffe8" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id={`${uid}-amber-trail`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff7a32" stopOpacity="0" />
              <stop offset="0.7" stopColor="#ffb347" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff4d5" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Editable neural paths, traced approximately over visible artwork. */}
          <g clipPath={`url(#${uid}-brain)`} className="pulse-layer pulse-layer--brain" filter={`url(#${uid}-green-glow)`}>
            <path id={`${uid}-n1`} className="energy-path energy-path--green" d="M125 125 C180 95 185 165 235 150 S290 80 335 110 S390 190 455 145" />
            <path id={`${uid}-n2`} className="energy-path energy-path--green" d="M135 205 C165 250 195 190 235 225 S285 300 340 260 S410 210 485 285" />
            <path id={`${uid}-n3`} className="energy-path energy-path--green" d="M170 85 C205 125 245 105 260 165 S315 205 350 180 S420 115 470 185" />
            <path id={`${uid}-n4`} className="energy-path energy-path--green" d="M115 285 C165 315 195 270 225 300 S280 325 315 305 L330 355" />
            <circle r="4.2" className="moving-node moving-node--green"><animateMotion dur={`${3.2 / safeSpeed}s`} repeatCount="indefinite"><mpath href={`#${uid}-n1`} /></animateMotion></circle>
            <circle r="3.2" className="moving-node moving-node--mint"><animateMotion dur={`${4.4 / safeSpeed}s`} begin="-1.7s" repeatCount="indefinite"><mpath href={`#${uid}-n2`} /></animateMotion></circle>
            <circle r="3.7" className="moving-node moving-node--green"><animateMotion dur={`${3.8 / safeSpeed}s`} begin="-2.2s" repeatCount="indefinite"><mpath href={`#${uid}-n3`} /></animateMotion></circle>
            <circle r="3" className="moving-node moving-node--cyan"><animateMotion dur={`${4.8 / safeSpeed}s`} begin="-0.9s" repeatCount="indefinite"><mpath href={`#${uid}-n4`} /></animateMotion></circle>
          </g>

          {/* Circuit paths follow the lower orange bowl and stay clipped to the B. */}
          <g clipPath={`url(#${uid}-circuits)`} className="pulse-layer pulse-layer--circuit" filter={`url(#${uid}-amber-glow)`}>
            <path id={`${uid}-c1`} className="energy-path energy-path--amber" d="M112 385 L180 410 L180 485 Q180 525 230 535 L320 535 Q380 535 420 495 L470 450 L525 450" />
            <path id={`${uid}-c2`} className="energy-path energy-path--amber" d="M135 470 L135 555 Q145 610 205 620 L305 620 L350 590 L435 590 Q500 580 545 520" />
            <path id={`${uid}-c3`} className="energy-path energy-path--cyan" d="M160 425 L160 540 Q165 585 205 595 L250 595 L285 630 L325 650" />
            <path id={`${uid}-c4`} className="energy-path energy-path--amber" d="M285 370 L285 430 Q285 460 330 460 L395 460 Q435 460 455 425 L485 400 L520 400" />
            <path id={`${uid}-c5`} className="energy-path energy-path--amber" d="M210 650 L250 650 L285 665 L390 665 Q470 665 510 620" />
            <circle r="4" className="moving-node moving-node--amber"><animateMotion dur={`${3.4 / safeSpeed}s`} repeatCount="indefinite"><mpath href={`#${uid}-c1`} /></animateMotion></circle>
            <circle r="3.4" className="moving-node moving-node--amber"><animateMotion dur={`${4.6 / safeSpeed}s`} begin="-2.4s" repeatCount="indefinite"><mpath href={`#${uid}-c2`} /></animateMotion></circle>
            <circle r="3.1" className="moving-node moving-node--cyan"><animateMotion dur={`${4.1 / safeSpeed}s`} begin="-1.2s" repeatCount="indefinite"><mpath href={`#${uid}-c3`} /></animateMotion></circle>
            <circle r="3.8" className="moving-node moving-node--amber"><animateMotion dur={`${3.8 / safeSpeed}s`} begin="-2.7s" repeatCount="indefinite"><mpath href={`#${uid}-c4`} /></animateMotion></circle>
            <circle r="3.1" className="moving-node moving-node--amber"><animateMotion dur={`${5.1 / safeSpeed}s`} begin="-3.3s" repeatCount="indefinite"><mpath href={`#${uid}-c5`} /></animateMotion></circle>
          </g>

          {/* Signature transfer: green approaches the central seam, then amber branches ignite. */}
          <g className="transfer-event" filter={`url(#${uid}-amber-glow)`}>
            <circle cx="255" cy="350" r="7" className="transfer-core" />
            <circle cx="255" cy="350" r="17" className="transfer-halo" />
            <path d="M205 323 Q230 340 255 350 Q290 365 325 388" className="transfer-bridge" />
          </g>
        </svg>
      )}
    </div>
  );
}

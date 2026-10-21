"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Volume1,
  VolumeX,
  Sliders,
  Check,
  Play,
  Sparkles,
  MousePointer,
  Compass,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";

export default function SoundSettings() {
  const {
    settings,
    setMasterEnabled,
    setVolume,
    setCategoryEnabled,
    playSound,
    playTestSound,
  } = useSound();

  const [isOpen, setIsOpen] = useState(false);
  const [testPlaying, setTestPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          playSound("close", 0.7);
          setIsOpen(false);
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        playSound("close", 0.7);
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, playSound]);

  const toggleOpen = () => {
    if (!isOpen) {
      playSound("open", 0.8);
      setIsOpen(true);
    } else {
      playSound("close", 0.7);
      setIsOpen(false);
    }
  };

  const handleMasterToggle = () => {
    const next = !settings.enabled;
    playSound("toggle", 0.8);
    setMasterEnabled(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const handleTestClick = () => {
    if (!settings.enabled || settings.volume <= 0) return;
    setTestPlaying(true);
    playTestSound();
    setTimeout(() => setTestPlaying(false), 400);
  };

  // Determine volume icon based on current state
  const VolumeIcon = !settings.enabled || settings.volume === 0
    ? VolumeX
    : settings.volume < 0.5
    ? Volume1
    : Volume2;

  const volumePercent = Math.round(settings.volume * 100);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Trigger Button inside Navbar */}
      <button
        type="button"
        onClick={toggleOpen}
        onMouseEnter={() => playSound("hover", 0.5)}
        aria-label="Sound settings"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`group relative flex size-9 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95 ${
          isOpen
            ? "border-[#8df5bd] bg-[#8df5bd]/15 text-[#8df5bd] shadow-sm shadow-[#8df5bd]/20"
            : !settings.enabled || settings.volume === 0
            ? "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-white"
            : "border-white/15 bg-white/5 text-zinc-200 hover:border-[#8df5bd]/50 hover:bg-white/10 hover:text-white"
        }`}
      >
        <VolumeIcon
          size={17}
          className={`transition-transform duration-200 ${
            isOpen ? "scale-110" : "group-hover:scale-110"
          }`}
        />

        {/* Small live indicator dot */}
        {settings.enabled && settings.volume > 0 && (
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[#8df5bd] shadow-[0_0_6px_#8df5bd]" />
        )}
      </button>

      {/* Floating Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Audio Interface Settings"
            aria-modal="true"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2.5 w-[310px] sm:w-[330px] rounded-2xl border border-white/15 bg-[#09090b]/98 p-4.5 shadow-2xl shadow-black/95 backdrop-blur-2xl z-50 text-white"
          >
            {/* Header with Title & Master Status */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-[#8df5bd]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Audio Interface
                </span>
              </div>

              {/* Status pill */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                  settings.enabled && settings.volume > 0
                    ? "bg-[#8df5bd]/15 text-[#8df5bd] border border-[#8df5bd]/30"
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    settings.enabled && settings.volume > 0
                      ? "bg-[#8df5bd] animate-pulse"
                      : "bg-zinc-500"
                  }`}
                />
                {settings.enabled && settings.volume > 0 ? "ACTIVE" : "MUTED"}
              </span>
            </div>

            {/* Master Sound Switch */}
            <div className="mt-3.5 flex items-center justify-between rounded-xl bg-white/[0.04] p-2.5 border border-white/8">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Master Audio</span>
                <span className="text-[11px] text-zinc-400">
                  {settings.enabled ? "UI sounds enabled" : "All audio silenced"}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.enabled}
                aria-label="Toggle master audio"
                onClick={handleMasterToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8df5bd] ${
                  settings.enabled ? "bg-[#8df5bd]" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-zinc-950 shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.enabled ? "translate-x-5" : "translate-x-0 bg-zinc-400"
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="mt-3.5 space-y-2 rounded-xl bg-white/[0.04] p-3 border border-white/8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Volume</span>
                <span className="text-xs font-mono font-bold text-[#8df5bd]">
                  {volumePercent}%
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.volume}
                  onChange={handleVolumeChange}
                  disabled={!settings.enabled}
                  aria-label="Master volume"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-[#8df5bd] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, #8df5bd ${
                      settings.enabled ? volumePercent : 0
                    }%, #27272a ${settings.enabled ? volumePercent : 0}%)`,
                  }}
                />
              </div>
            </div>

            {/* Category Toggles */}
            <div className="mt-3.5 space-y-1.5">
              <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Categories
              </div>

              <div className="space-y-1">
                {/* Interactions */}
                <label className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <MousePointer size={13} className="text-[#8df5bd]" />
                    <span>Interactions & Clicks</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.categories.interaction}
                    disabled={!settings.enabled}
                    onChange={(e) => {
                      playSound("toggle", 0.6);
                      setCategoryEnabled("interaction", e.target.checked);
                    }}
                    className="size-3.5 rounded border-white/20 bg-zinc-900 accent-[#8df5bd] cursor-pointer disabled:opacity-40"
                  />
                </label>

                {/* Navigation */}
                <label className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <Compass size={13} className="text-[#8df5bd]" />
                    <span>Navigation & Routes</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.categories.navigation}
                    disabled={!settings.enabled}
                    onChange={(e) => {
                      playSound("toggle", 0.6);
                      setCategoryEnabled("navigation", e.target.checked);
                    }}
                    className="size-3.5 rounded border-white/20 bg-zinc-900 accent-[#8df5bd] cursor-pointer disabled:opacity-40"
                  />
                </label>

                {/* Feedback */}
                <label className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <Bell size={13} className="text-[#8df5bd]" />
                    <span>Alerts & Sweeps</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.categories.feedback}
                    disabled={!settings.enabled}
                    onChange={(e) => {
                      playSound("toggle", 0.6);
                      setCategoryEnabled("feedback", e.target.checked);
                    }}
                    className="size-3.5 rounded border-white/20 bg-zinc-900 accent-[#8df5bd] cursor-pointer disabled:opacity-40"
                  />
                </label>
              </div>
            </div>

            {/* Test Sound Button */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestClick}
                disabled={!settings.enabled || settings.volume <= 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#8df5bd]/30 bg-[#8df5bd]/10 px-3 py-2 text-xs font-semibold text-[#8df5bd] hover:bg-[#8df5bd]/20 hover:border-[#8df5bd]/50 active:scale-[0.98] transition-all disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <Play
                  size={12}
                  className={`transition-transform ${testPlaying ? "scale-125" : ""}`}
                />
                <span>Test Sound</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

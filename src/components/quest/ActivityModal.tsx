"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, X, Volume2, VolumeX, CheckCircle } from "lucide-react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

interface Quest {
  id: number;
  title: string;
  category: string;
  durationMinutes: number;
  xpReward: number;
  description: string;
}

interface ActivityModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (questId: number) => void;
}

export default function ActivityModal({ quest, isOpen, onClose, onComplete }: ActivityModalProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (quest) {
      setTimeLeft(quest.durationMinutes * 60);
      setIsRunning(false);
      setIsCompleted(false);
      setIsPlayingAudio(false);
    }
  }, [quest]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      toast.success("Activity completed! Claim your XP.");
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  if (!isOpen || !quest) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleExtend = () => {
    setTimeLeft((prev) => prev + 5 * 60); // Add 5 mins
    toast("Added 5 more minutes!");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-orange-600/20 blur-[80px]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              {quest.category} Session
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{quest.title}</h2>
            <p className="text-sm text-neutral-400 mt-1">{quest.description}</p>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative flex items-center justify-center h-48 w-48 rounded-full border-4 border-neutral-800 bg-neutral-900/50 shadow-inner">
              <span className="text-4xl font-mono font-bold tracking-wider text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Audio toggle for meditation */}
          {quest.category === "mental" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Button
                size="sm"
                variant="outline"
                onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`border-neutral-800 text-xs gap-2 ${isPlayingAudio ? "bg-orange-500/20 text-orange-400 border-orange-500/40" : "text-neutral-400"}`}
              >
                {isPlayingAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{isPlayingAudio ? "Ambient Nature Audio Playing" : "Play Nature Sound"}</span>
              </Button>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Button
              onPress={() => setIsRunning(!isRunning)}
              className="h-12 px-6 rounded-2xl bg-white font-semibold text-black hover:bg-neutral-200 transition-all cursor-pointer"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? "Pause" : "Start Timer"}</span>
            </Button>

            <Button
              onPress={handleExtend}
              variant="outline"
              className="h-12 px-4 rounded-2xl border-neutral-800 text-neutral-300 hover:bg-white/10"
            >
              <Plus size={16} />
              <span>+5 Min</span>
            </Button>
          </div>

          {/* Complete Button when done or forced */}
          <div className="border-t border-neutral-800/80 pt-6">
            <Button
              onPress={() => {
                onComplete(quest.id);
                onClose();
              }}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <CheckCircle size={18} />
              <span>Complete & Claim +{quest.xpReward} XP</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
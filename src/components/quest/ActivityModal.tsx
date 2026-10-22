"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  FaCheckCircle,
  FaPause,
  FaPlay,
  FaPlus,
  FaTimes,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import type { Quest, QuestId } from "@/types/quest";
import { startRainAmbience } from "@/lib/audio/rainAmbience";
import { useSound } from "@/components/providers/SoundProvider";

interface ActivityModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (questId: QuestId, durationSpentMinutes: number) => Promise<boolean>;
}

export default function ActivityModal({ quest, isOpen, onClose, onComplete }: ActivityModalProps) {
  const { playSound } = useSound();
  const modalState = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });
  const [timeLeft, setTimeLeft] = useState(() => quest ? quest.durationMinutes * 60 : 0);
  const [durationSpentMinutes, setDurationSpentMinutes] = useState(
    () => quest?.durationMinutes ?? 0,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stopAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    stopAudioRef.current?.();
    stopAudioRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0);
        setIsRunning(false);
        stopAudioRef.current?.();
        stopAudioRef.current = null;
        setIsPlayingAudio(false);
        playSound("notification", 1);
        toast.success("Activity completed! Claim your XP.");
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, playSound, timeLeft]);

  if (!quest) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (await onComplete(quest.id, durationSpentMinutes)) modalState.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRainAudio = async () => {
    if (isPlayingAudio) {
      stopAudioRef.current?.();
      stopAudioRef.current = null;
      setIsPlayingAudio(false);
      return;
    }

    try {
      stopAudioRef.current = await startRainAmbience();
      setIsPlayingAudio(true);
    } catch (error) {
      console.error("Unable to start rain ambience:", error);
      toast.error(error instanceof Error ? error.message : "Unable to start ambient audio.");
    }
  };

  return (
    <Modal state={modalState}>
      <Modal.Backdrop
        isDismissable={!isSubmitting}
        className="overflow-y-auto bg-black/80 p-2 backdrop-blur-md sm:p-4"
      >
        <Modal.Container
          placement="center"
          scroll="inside"
          size="lg"
          className="max-h-[100dvh] min-h-0 w-full overflow-y-auto p-2 sm:p-4"
        >
          <Modal.Dialog className="my-auto max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-x-hidden overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative flex min-h-0 flex-col"
            >
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-orange-600/20 blur-[80px]" />
              <Modal.Header className="relative flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                    {quest.category} session
                  </p>
                  <Modal.Heading className="mt-1 break-words text-xl font-bold sm:text-2xl">
                    {quest.title}
                  </Modal.Heading>
                  <p className="mt-2 break-words text-sm text-neutral-400">{quest.description}</p>
                </div>
                <Modal.CloseTrigger
                  isDisabled={isSubmitting}
                  aria-label="Close activity"
                  className="shrink-0 rounded-lg p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                >
                  <FaTimes aria-hidden="true" />
                </Modal.CloseTrigger>
              </Modal.Header>

              <Modal.Body className="relative min-h-0 px-5 pb-5 sm:px-8 sm:pb-8">
                <div className="my-4 flex justify-center sm:my-6">
                  <div
                    className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-neutral-800 bg-neutral-900/70 sm:h-44 sm:w-44"
                    aria-live="polite"
                    aria-label={`${formatTime(timeLeft)} remaining`}
                  >
                    <span className="font-mono text-3xl font-bold tracking-wider sm:text-4xl">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {quest.category === "mental" && (
                  <div className="mb-5 flex justify-center">
                    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">Rain ambience</p>
                          <p className="mt-1 text-xs text-neutral-400">Soft rain and nature sounds for focus</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={toggleRainAudio}
                          className="gap-2 border-neutral-700 text-xs text-neutral-200"
                          aria-pressed={isPlayingAudio}
                        >
                          {isPlayingAudio
                            ? <FaVolumeUp aria-hidden="true" />
                            : <FaVolumeMute aria-hidden="true" />}
                          {isPlayingAudio ? "Pause rain" : "Play rain"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onPress={() => setIsRunning((running) => !running)}
                    className="h-12 gap-2 rounded-2xl bg-white px-6 font-semibold text-black hover:bg-neutral-200"
                  >
                    {isRunning ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                    {isRunning ? "Pause timer" : "Start timer"}
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => {
                      setTimeLeft((remaining) => remaining + 5 * 60);
                      setDurationSpentMinutes((minutes) => minutes + 5);
                    }}
                    className="h-12 gap-2 rounded-2xl border-neutral-700 px-4 text-neutral-300 hover:bg-white/10"
                  >
                    <FaPlus aria-hidden="true" />
                    Add 5 min
                  </Button>
                </div>

                <div className="mt-6 border-t border-neutral-800/80 pt-5">
                  <Button
                    onPress={handleComplete}
                    isDisabled={isSubmitting}
                    className="h-12 w-full gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaCheckCircle aria-hidden="true" />
                    {isSubmitting
                      ? "Saving progress..."
                      : `Complete & claim +${quest.xpReward} XP`}
                  </Button>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  soundEngine,
  SoundType,
  SoundCategory,
  SoundSettings,
  DEFAULT_SOUND_SETTINGS,
} from "@/lib/sounds";

interface SoundContextValue {
  settings: SoundSettings;
  setMasterEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setCategoryEnabled: (category: SoundCategory, enabled: boolean) => void;
  playSound: (type: SoundType, customVolumeMultiplier?: number) => void;
  playTypingSound: (customVolumeMultiplier?: number) => void;
  playTestSound: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "brainsharp_sound_settings";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preferences safely on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: SoundSettings = {
          enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_SOUND_SETTINGS.enabled,
          volume: typeof parsed.volume === "number" ? Math.max(0, Math.min(1, parsed.volume)) : DEFAULT_SOUND_SETTINGS.volume,
          categories: {
            interaction:
              typeof parsed.categories?.interaction === "boolean"
                ? parsed.categories.interaction
                : DEFAULT_SOUND_SETTINGS.categories.interaction,
            navigation:
              typeof parsed.categories?.navigation === "boolean"
                ? parsed.categories.navigation
                : DEFAULT_SOUND_SETTINGS.categories.navigation,
            feedback:
              typeof parsed.categories?.feedback === "boolean"
                ? parsed.categories.feedback
                : DEFAULT_SOUND_SETTINGS.categories.feedback,
            typing:
              typeof parsed.categories?.typing === "boolean"
                ? parsed.categories.typing
                : DEFAULT_SOUND_SETTINGS.categories.typing,
          },
        };
        setSettings(merged);
        soundEngine.updateSettings(merged);
      }
    } catch {
      // Fallback gracefully on storage error
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage whenever settings update after initial hydration
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      soundEngine.updateSettings(settings);
    } catch {
      // Storage unavailable / quota exceeded
    }
  }, [settings, isInitialized]);

  // Global Button & Link Interaction Sounds
  // Automatically attaches click and hover sounds to all buttons and links in the app globally.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastHovered: Element | null = null;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        "button, a, [role='button'], input[type='button'], input[type='submit']"
      );
      if (!target) return;
      if (target.getAttribute("data-no-sound") === "true") return;

      // Don't play for disabled elements
      if (
        target.hasAttribute("disabled") ||
        target.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      soundEngine.play("click");
    };

  const handleGlobalMouseOver = (e: MouseEvent) => {
  const target = (e.target as HTMLElement | null)?.closest?.(
    "button, a, [role='button']"
  );

  if (!target || e.relatedTarget instanceof Node && target.contains(e.relatedTarget)) {
    return;
  }

  if (target.getAttribute("data-no-sound") === "true") return;

  if (
    target.hasAttribute("disabled") ||
    target.getAttribute("aria-disabled") === "true"
  ) {
    return;
  }

  soundEngine.play("hover", 0.3);
};

    const handleGlobalMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        "button, a, [role='button']"
      );
      if (target === lastHovered) {
        lastHovered = null;
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    document.addEventListener("mouseover", handleGlobalMouseOver, { capture: true, passive: true });
    document.addEventListener("mouseout", handleGlobalMouseOut, { capture: true, passive: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      document.removeEventListener("mouseover", handleGlobalMouseOver, { capture: true });
      document.removeEventListener("mouseout", handleGlobalMouseOut, { capture: true });
    };
  }, []);

  const setMasterEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, enabled };
      soundEngine.updateSettings(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    setSettings((prev) => {
      const next = { ...prev, volume: clamped };
      soundEngine.updateSettings(next);
      return next;
    });
  }, []);

  const setCategoryEnabled = useCallback((category: SoundCategory, enabled: boolean) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          [category]: enabled,
        },
      };
      soundEngine.updateSettings(next);
      return next;
    });
  }, []);

  const playSound = useCallback((type: SoundType, customVolumeMultiplier?: number) => {
    soundEngine.play(type, customVolumeMultiplier);
  }, []);

  const playTypingSound = useCallback((customVolumeMultiplier = 0.22) => {
    soundEngine.play("typing", customVolumeMultiplier);
  }, []);

  const playTestSound = useCallback(() => {
    soundEngine.play("success", 1);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setMasterEnabled,
      setVolume,
      setCategoryEnabled,
      playSound,
      playTypingSound,
      playTestSound,
    }),
    [settings, setMasterEnabled, setVolume, setCategoryEnabled, playSound, playTypingSound, playTestSound]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    // Return a safe dummy fallback if accessed outside provider
    return {
      settings: DEFAULT_SOUND_SETTINGS,
      setMasterEnabled: () => {},
      setVolume: () => {},
      setCategoryEnabled: () => {},
      playSound: () => {},
      playTypingSound: () => {},
      playTestSound: () => {},
    };
  }
  return context;
}

/**
 * Reusable typing sound hook for any typing animation across the app.
 */
export function useTypingSound(volumeMultiplier = 0.22) {
  const { playTypingSound } = useSound();
  return useCallback(() => {
    playTypingSound(volumeMultiplier);
  }, [playTypingSound, volumeMultiplier]);
}

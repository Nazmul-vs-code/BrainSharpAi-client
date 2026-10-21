/**
 * BrainSharp AI — Futuristic UI Web Audio Synthesizer
 *
 * Implements lightweight, zero-dependency, synthesized UI sound effects
 * using the browser Web Audio API. Designed for high-tech, subtle,
 * intelligent operating system acoustics (no noisy arcade game sounds).
 */

export type SoundType =
  | "click"
  | "hover"
  | "navigation"
  | "open"
  | "close"
  | "typing"
  | "success"
  | "error"
  | "toggle"
  | "notification"
  | "sweep";

export type SoundCategory =
  | "interaction"
  | "navigation"
  | "feedback"
  | "typing";

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  categories: {
    interaction: boolean;
    navigation: boolean;
    feedback: boolean;
    typing: boolean;
  };
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.35,
  categories: {
    interaction: true,
    navigation: true,
    feedback: true,
    typing: true,
  },
};

const SOUND_CATEGORY_MAP: Record<SoundType, SoundCategory> = {
  click: "interaction",
  hover: "interaction",
  toggle: "interaction",
  navigation: "navigation",
  open: "navigation",
  close: "navigation",
  typing: "typing",
  success: "feedback",
  error: "feedback",
  notification: "feedback",
  sweep: "feedback",
};

// Rate-limiting intervals in milliseconds to prevent audio spam
const RATE_LIMITS: Record<SoundType, number> = {
  hover: 45,
  typing: 25,
  click: 30,
  toggle: 50,
  navigation: 80,
  open: 100,
  close: 100,
  success: 150,
  error: 150,
  notification: 200,
  sweep: 350,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private lastPlayed: Partial<Record<SoundType, number>> = {};
  private settings: SoundSettings = { ...DEFAULT_SOUND_SETTINGS };

  public updateSettings(newSettings: Partial<SoundSettings>) {
    this.settings = {
      ...this.settings,
      ...newSettings,
      categories: {
        ...this.settings.categories,
        ...(newSettings.categories || {}),
      },
    };
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  /**
   * Lazily initialize or resume the AudioContext upon user gesture.
   */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Check if sound type should be played based on master switch,
   * volume, category toggle, and rate limit.
   */
  public canPlay(type: SoundType): boolean {
    if (!this.settings.enabled || this.settings.volume <= 0) return false;

    const category = SOUND_CATEGORY_MAP[type];
    if (!this.settings.categories[category]) return false;

    const now = Date.now();
    const last = this.lastPlayed[type] || 0;
    const limit = RATE_LIMITS[type] || 50;

    if (now - last < limit) return false;

    return true;
  }

  /**
   * Play a named sound event
   */
  public play(type: SoundType, customVolumeMultiplier = 1): void {
    if (!this.canPlay(type)) return;

    const ctx = this.getContext();
    if (!ctx) return;

    this.lastPlayed[type] = Date.now();

    const masterGain = ctx.createGain();
    // Non-linear perceptual volume curve
    const effectiveVol = Math.min(
      1,
      Math.max(0, this.settings.volume * customVolumeMultiplier)
    );
    masterGain.gain.setValueAtTime(effectiveVol * 0.45, ctx.currentTime);
    masterGain.connect(ctx.destination);

    switch (type) {
      case "click":
        this.synthClick(ctx, masterGain);
        break;
      case "hover":
        this.synthHover(ctx, masterGain);
        break;
      case "navigation":
        this.synthNavigation(ctx, masterGain);
        break;
      case "open":
        this.synthOpen(ctx, masterGain);
        break;
      case "close":
        this.synthClose(ctx, masterGain);
        break;
      case "typing":
        this.synthTyping(ctx, masterGain);
        break;
      case "toggle":
        this.synthToggle(ctx, masterGain);
        break;
      case "success":
        this.synthSuccess(ctx, masterGain);
        break;
      case "error":
        this.synthError(ctx, masterGain);
        break;
      case "notification":
        this.synthNotification(ctx, masterGain);
        break;
      case "sweep":
        this.synthSweep(ctx, masterGain);
        break;
    }
  }

  /**
   * Crisp, subtle tactile digital click
   */
  private synthClick(ctx: AudioContext, dest: GainNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  }

  /**
   * Ultra-soft high-frequency micro-blip for hover
   */
  private synthHover(ctx: AudioContext, dest: GainNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.022);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.022);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  }

  /**
   * Harmonious futuristic navigation transition (two subtle ascending tones)
   */
  private synthNavigation(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(520, t);
    osc1.frequency.exponentialRampToValueAtTime(780, t + 0.07);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(780, t + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(1040, t + 0.09);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(t);
    osc1.stop(t + 0.08);
    osc2.start(t + 0.03);
    osc2.stop(t + 0.1);
  }

  /**
   * Sci-fi popover / modal expand sweep
   */
  private synthOpen(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.08);

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.08);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Sci-fi popover / modal collapse settle
   */
  private synthClose(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(760, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.07);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * Minimal data-processing keystroke tick
   */
  private synthTyping(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1550 + (Math.random() - 0.5) * 350, t);
    filter.Q.setValueAtTime(3.0, t);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400 + (Math.random() - 0.5) * 300, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.022);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  /**
   * Crisp toggle snap (ascending tone)
   */
  private synthToggle(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.045);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Elegant futuristic success chime (triad arpeggio)
   */
  private synthSuccess(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 0.08;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = t + idx * 0.04;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  /**
   * Discreet low double-blip for error / alert
   */
  private synthError(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    [260, 200].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = t + idx * 0.06;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.05);
    });
  }

  /**
   * Futuristic pulse notification chime
   */
  private synthNotification(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1320, t + 0.12);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1320, t);
    osc2.frequency.exponentialRampToValueAtTime(1760, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(t);
    osc1.stop(t + 0.15);
    osc2.start(t);
    osc2.stop(t + 0.18);
  }

  /**
   * Cinematic transition sweep / whoosh for hero milestones
   */
  private synthSweep(ctx: AudioContext, dest: GainNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1800, t + 0.18);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.35);
    filter.Q.setValueAtTime(2.5, t);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.35);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.36);
  }
}

// Global engine singleton
export const soundEngine = new SoundEngine();

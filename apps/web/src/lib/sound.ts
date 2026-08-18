let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioCtx ??= new Ctor();
  return audioCtx;
}

function tone(ctx: AudioContext, frequency: number, startTime: number, duration: number, peakGain: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** Soft two-note rising chime for a successful save. */
export function playSaveChime() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 660, now, 0.14, 0.05);
  tone(ctx, 880, now + 0.09, 0.18, 0.05);
}

/** Single soft click for a lightweight confirmation (e.g. quick-add). */
export function playTick() {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 520, ctx.currentTime, 0.08, 0.035);
}

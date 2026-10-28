import { Ingredient, UnitSystem } from '../types';

export function formatScaledAmount(
  ingredient: Ingredient,
  scaleFactor: number,
  unitSystem: UnitSystem
): string {
  const raw =
    unitSystem === UnitSystem.Metric
      ? ingredient.metricAmount * scaleFactor
      : ingredient.imperialAmount * scaleFactor;
  const unit =
    unitSystem === UnitSystem.Metric
      ? ingredient.metricUnit
      : ingredient.imperialUnit;

  if (unitSystem === UnitSystem.Metric) {
    const rounded = raw >= 20 ? Math.round(raw) : Math.round(raw * 10) / 10;
    return `${rounded} ${unit}`;
  }

  // Friendly kitchen fractions for imperial
  const whole = Math.floor(raw + 0.01);
  const rem = raw - whole;
  let frac = '';
  if (Math.abs(rem - 0.25) < 0.08) frac = '¼';
  else if (Math.abs(rem - 0.33) < 0.08) frac = '⅓';
  else if (Math.abs(rem - 0.5) < 0.08) frac = '½';
  else if (Math.abs(rem - 0.66) < 0.08) frac = '⅔';
  else if (Math.abs(rem - 0.75) < 0.08) frac = '¾';

  if (frac) {
    return `${whole > 0 ? `${whole} ` : ''}${frac} ${unit}`;
  }
  const clean = Math.round(raw * 10) / 10;
  return `${clean} ${unit}`;
}

export function formatTimerClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function playKitchenChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99]; // Soft C5 - E5 - G5 triad
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        ctx.currentTime + idx * 0.16 + 0.04
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + idx * 0.16 + 0.9
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.95);
    });
  } catch {
    // Audio playback silently ignored if blocked by browser autoplay policy
  }
}

export function speakInstructionText(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.94;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

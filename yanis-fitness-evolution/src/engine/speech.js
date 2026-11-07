export const DEFAULT_SPEECH_RATE = 1;
export const MIN_SPEECH_RATE = 0.5;
export const MAX_SPEECH_RATE = 2;

/** Keep the same safe range for Android TextToSpeech and browser voices. */
export function normalizeSpeechRate(value) {
  if (value == null || value === "") return DEFAULT_SPEECH_RATE;
  const rate = Number(value);
  if (!Number.isFinite(rate)) return DEFAULT_SPEECH_RATE;
  return Math.min(MAX_SPEECH_RATE, Math.max(MIN_SPEECH_RATE, rate));
}

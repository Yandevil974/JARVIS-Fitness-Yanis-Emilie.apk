/* Réglages voix JARVIS (taux de parole). Noyau pur, testable sans DOM. */
export const RATE_MIN = 0.7;
export const RATE_MAX = 1.6;
export const RATE_DEFAULT = 0.98;
export function clampRate(r) {
  if (r == null) return RATE_DEFAULT;
  if (typeof r === "string" && r.trim() === "") return RATE_DEFAULT;
  const n = Number(r);
  if (!Number.isFinite(n)) return RATE_DEFAULT;
  return Math.min(RATE_MAX, Math.max(RATE_MIN, Math.round(n * 100) / 100));
}

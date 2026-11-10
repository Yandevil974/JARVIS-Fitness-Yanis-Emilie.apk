import { normalizeUtterance } from './coach.js';

// Seules des demandes explicites concernant la séance en cours sont exécutées.
// Une question, une négation ou une référence au futur ne doit rien clôturer.
export function isStopWorkoutCommand(text) {
  const raw = String(text || '');
  const q = normalizeUtterance(raw);
  if (/[?]/.test(raw) || /\b(?:ne|n|pas|jamais|sans|demain|prochaine|prochain|hier|comment|pourquoi|quand|si|retiens|rappelle|savoir)\b/.test(q)) return false;
  if (/douleur|j ai mal|mal au|mal a la|mal aux|bless|vertige|oppression|malaise|essoufflement inhabituel/.test(q)) return false;
  if (!/\b(?:ma|la|cette|notre) seance\b/.test(q)) return false;
  if (!/\b(?:en cours|maintenant|actuelle|ma seance|cette seance|la seance|notre seance)\b/.test(q)) return false;
  return /\b(?:stop|stoppe|stoppes|stopper|arrete|arretes|arreter|termine|termines|terminer|finis|finir|cloture|cloturer)\b/.test(q);
}

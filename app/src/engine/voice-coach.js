/* ============================================================
   COACH VOCAL DE SÉANCE
   ------------------------------------------------------------
   Guidage à la voix pendant l'entraînement, sans avoir à regarder
   l'écran : décompte du repos, annonce de la série et de la charge,
   guidage du tempo, changement d'exercice, fin de séance.

   Principes :
   - Une annonce n'est jamais répétée : chaque message porte une clé,
     et une clé déjà prononcée est ignorée.
   - Les annonces sont hiérarchisées : la sécurité et le changement
     d'exercice passent avant le confort.
   - Le tempo est lu depuis la prescription source (ex. « 3012 ») et
     traduit en consignes compréhensibles, sans inventer de cadence.
   - Rien n'est annoncé si la voix est désactivée dans les préférences.
   ============================================================ */
import { num } from "./utils.js";

/* --------------------------------------------------------------
   Tempo
   -------------------------------------------------------------- */

/**
 * Décode un tempo à quatre chiffres : excentrique, pause basse,
 * concentrique, pause haute. « X » ou « x » signifie « explosif ».
 * @returns {{eccentric:number|null, bottom:number|null, concentric:number|string|null, top:number|null, total:number|null}|null}
 */
export function parseTempo(tempo) {
  const raw = String(tempo ?? "").trim();
  const digits = raw.match(/^([0-9xX])\s*([0-9xX])\s*([0-9xX])\s*([0-9xX])$/);
  if (!digits) return null;
  const value = (c) => (/[xX]/.test(c) ? "explosif" : Number(c));
  const eccentric = value(digits[1]);
  const bottom = value(digits[2]);
  const concentric = value(digits[3]);
  const top = value(digits[4]);
  const numeric = [eccentric, bottom, concentric, top].map((v) =>
    typeof v === "number" ? v : 0.5,
  );
  return {
    eccentric,
    bottom,
    concentric,
    top,
    total: numeric.reduce((a, b) => a + b, 0),
  };
}

/** Traduit un tempo en consigne parlée courte. */
export function tempoSpoken(tempo) {
  const t = parseTempo(tempo);
  if (!t) return null;
  const phase = (v, verb) =>
    v === "explosif"
      ? `${verb} explosif`
      : v === 0
        ? null
        : `${verb} ${v} seconde${v > 1 ? "s" : ""}`;
  const parts = [
    phase(t.eccentric, "Descente en"),
    t.bottom && t.bottom !== 0
      ? `pause ${t.bottom} seconde${t.bottom > 1 ? "s" : ""} en bas`
      : null,
    phase(t.concentric, "montée en"),
    t.top && t.top !== 0
      ? `contraction ${t.top} seconde${t.top > 1 ? "s" : ""} en haut`
      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") + "." : null;
}

/** Durée estimée d'une répétition au tempo prescrit, en secondes. */
export function repDuration(tempo) {
  const t = parseTempo(tempo);
  return t?.total || null;
}

/* --------------------------------------------------------------
   Annonces de repos
   -------------------------------------------------------------- */

/** Paliers du décompte de récupération, du plus long au plus court. */
const REST_MARKS = [60, 30, 15, 10, 5, 3, 2, 1];

/**
 * Annonce à prononcer pour un repos en cours.
 * @param {number} remaining secondes restantes
 * @param {number} total durée totale du repos
 * @returns {{key:string, text:string, priority:number}|null}
 */
export function restAnnouncement(remaining, total) {
  const left = Math.round(remaining);
  if (left <= 0) return null;
  // On n'annonce un palier que s'il est pertinent pour la durée totale :
  // inutile d'annoncer « 60 secondes » sur un repos de 45 secondes.
  for (const mark of REST_MARKS) {
    if (left !== mark) continue;
    if (mark >= 30 && total < mark + 10) return null;
    if (mark <= 3)
      return {
        key: `rest-${mark}`,
        text: String(mark),
        priority: 2,
      };
    if (mark === 5)
      return { key: "rest-5", text: "Cinq secondes. En place.", priority: 2 };
    if (mark === 10)
      return { key: "rest-10", text: "Dix secondes.", priority: 1 };
    return {
      key: `rest-${mark}`,
      text: `${mark} secondes de récupération.`,
      priority: 1,
    };
  }
  return null;
}

/* --------------------------------------------------------------
   Annonces de séance
   -------------------------------------------------------------- */

/** Annonce de démarrage d'un exercice. */
export function exerciseAnnouncement(exercise, target, { first = false } = {}) {
  if (!exercise) return null;
  const sets = target?.targetSets || exercise.defaultSets;
  const reps = target?.repScheme || exercise.repScheme;
  const tempo = tempoSpoken(target?.tempo || exercise.tempo);
  const load = target?.recommendation?.weight;
  const parts = [
    first ? `On commence par ${exercise.name}.` : `Exercice suivant : ${exercise.name}.`,
    sets && reps ? `${sets} séries de ${reps} répétitions.` : null,
    load != null
      ? `Charge suggérée : ${load} kilos${exercise.unit === "kg/main" ? " par haltère" : ""}.`
      : null,
    tempo,
  ].filter(Boolean);
  return {
    key: `exercise-${target?.exerciseId || exercise.id}-${first ? "first" : "next"}`,
    text: parts.join(" "),
    priority: 3,
  };
}

/** Annonce au moment de démarrer une série. */
export function setAnnouncement(index, total, exercise, load) {
  const parts = [
    `Série ${index} sur ${total}.`,
    load != null ? `${load} kilos.` : null,
    index === total ? "Dernière série, donnez tout ce qui reste de propre." : null,
  ].filter(Boolean);
  return {
    key: `set-${exercise?.id}-${index}`,
    text: parts.join(" "),
    priority: 2,
  };
}

/** Annonce de fin de repos. */
export function restOverAnnouncement(nextExercise) {
  return {
    key: "rest-over",
    text: nextExercise
      ? `Récupération terminée. Reprenez sur ${nextExercise}.`
      : "Récupération terminée. Série suivante.",
    priority: 3,
  };
}

/** Annonce de fin de séance. */
export function finishAnnouncement(summary = {}) {
  const parts = ["Séance terminée."];
  if (summary.sets) parts.push(`${summary.sets} séries enregistrées.`);
  if (summary.tonnage)
    parts.push(`${Math.round(summary.tonnage)} kilos déplacés au total.`);
  parts.push("Pensez au retour au calme et à vous réhydrater.");
  return { key: "finish", text: parts.join(" "), priority: 3 };
}

/** Encouragement de mi-série, calé sur le tempo prescrit. */
export function midSetCue(exercise, tempo) {
  const t = parseTempo(tempo || exercise?.tempo);
  if (!t) return null;
  const cues = [];
  if (typeof t.eccentric === "number" && t.eccentric >= 3)
    cues.push("Contrôlez la descente, ne lâchez pas la charge.");
  if (typeof t.top === "number" && t.top >= 1)
    cues.push("Serrez fort en haut.");
  if (typeof t.bottom === "number" && t.bottom >= 1)
    cues.push("Marquez la pause en bas, sans rebond.");
  if (!cues.length) return null;
  return { key: `cue-${exercise?.id}`, text: cues.join(" "), priority: 1 };
}

/* --------------------------------------------------------------
   File d'annonces
   -------------------------------------------------------------- */

/**
 * Petite file qui empêche les répétitions et les chevauchements.
 * Utilisée par le composant de séance : il pousse des annonces, la file
 * décide laquelle prononcer.
 */
export function createAnnouncer(speakFn) {
  const spoken = new Set();
  let lastAt = 0;
  return {
    /** Prononce une annonce si elle est nouvelle et non redondante. */
    say(announcement, { enabled = true, force = false } = {}) {
      if (!announcement || !enabled) return false;
      const { key, text, priority = 1 } = announcement;
      if (!force && spoken.has(key)) return false;
      const now = Date.now();
      // Deux annonces de faible priorité ne se bousculent pas.
      if (!force && priority < 3 && now - lastAt < 1200) return false;
      spoken.add(key);
      lastAt = now;
      speakFn(text);
      return true;
    },
    /** Réinitialise l'historique (nouvel exercice, nouvelle séance). */
    reset(prefix) {
      if (!prefix) {
        spoken.clear();
        return;
      }
      for (const key of [...spoken])
        if (key.startsWith(prefix)) spoken.delete(key);
    },
    has: (key) => spoken.has(key),
  };
}

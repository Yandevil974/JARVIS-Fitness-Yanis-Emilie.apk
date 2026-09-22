// Guidage vocal de séance, porté de la 1.5.0 : file d'annonce anti-répétition
// (clés + anti-throttle 1,2 s pour les annonces non prioritaires), intro
// d'exercice, validation de série, compte à rebours de récupération, fin de
// repos, rappel de tempo — tout est déduit de la séance, jamais inventé.

// Tempo "3111" / "3x11" (x = explosif) : [excentrique, bas, concentrique, haut].
export function parseTempo(value) {
  const m = String(value ?? "")
    .trim()
    .match(/^([0-9xX])\s*([0-9xX])\s*([0-9xX])\s*([0-9xX])$/);
  if (!m) return null;
  const v = (x) => (/[xX]/.test(x) ? "explosif" : Number(x));
  const eccentric = v(m[1]),
    bottom = v(m[2]),
    concentric = v(m[3]),
    top = v(m[4]);
  const total = [eccentric, bottom, concentric, top].map((x) =>
    typeof x === "number" ? x : 0.5,
  ).reduce((a, b) => a + b, 0);
  return { eccentric, bottom, concentric, top, total };
}
export function tempoCueSentence(value) {
  const o = parseTempo(value);
  if (!o) return null;
  const phrase = (c, u) =>
    c === "explosif"
      ? `${u} explosif`
      : c === 0
        ? null
        : `${u} ${c} seconde${c > 1 ? "s" : ""}`,
    parts = [
      phrase(o.eccentric, "Descente en"),
      o.bottom && o.bottom !== 0
        ? `pause ${o.bottom} seconde${o.bottom > 1 ? "s" : ""} en bas`
        : null,
      phrase(o.concentric, "montée en"),
      o.top && o.top !== 0
        ? `contraction ${o.top} seconde${o.top > 1 ? "s" : ""} en haut`
        : null,
    ].filter(Boolean);
  return parts.length ? parts.join(", ") + "." : null;
}
const COUNTDOWNS = [60, 30, 15, 10, 5, 3, 2, 1];
export function restCountdownCue(secondsRemaining, stepSeconds) {
  const n = Math.round(secondsRemaining);
  if (n <= 0) return null;
  for (const v of COUNTDOWNS)
    if (n === v)
      // Une étape courte ne mérite pas les jalons longs : uniquement si le
      // seuil est à portée de main (<= seuil + 10 s au-dessus).
      return v >= 30 && stepSeconds < v + 10
        ? null
        : v <= 3
          ? { key: `rest-${v}`, text: String(v), priority: 2 }
          : v === 5
            ? { key: "rest-5", text: "Cinq secondes. En place.", priority: 2 }
            : v === 10
              ? { key: "rest-10", text: "Dix secondes.", priority: 1 }
              : {
                  key: `rest-${v}`,
                  text: `${v} secondes de récupération.`,
                  priority: 1,
                };
  return null;
}
export function exerciseIntroCue(exercise, row, { first = false } = {}) {
  if (!exercise) return null;
  const sets = row?.targetSets || exercise.defaultSets,
    scheme = row?.repScheme || exercise.repScheme,
    tempo = tempoCueSentence(row?.tempo || exercise.tempo),
    weight = row?.recommendation?.weight,
    parts = [
      first ? `On commence par ${exercise.name}.` : `Exercice suivant : ${exercise.name}.`,
      sets && scheme ? `${sets} séries de ${scheme} répétitions.` : null,
      weight != null
        ? `Charge suggérée : ${weight} kilos${exercise.unit === "kg/main" ? " par haltère" : ""}.`
        : null,
      tempo,
    ].filter(Boolean);
  return {
    key: `exercise-${row?.exerciseId || exercise.id}-${first ? "first" : "next"}`,
    text: parts.join(" "),
    priority: 3,
  };
}
export function setCompleteCue(setNumber, totalSets, exercise, weight) {
  const parts = [
    `Série ${setNumber} sur ${totalSets}.`,
    weight != null ? `${weight} kilos.` : null,
    setNumber === totalSets
      ? "Dernière série, donnez tout ce qui reste de propre."
      : null,
  ].filter(Boolean);
  return {
    key: `set-${exercise?.id}-${setNumber}`,
    text: parts.join(" "),
    priority: 2,
  };
}
export function restOverCue(nextExerciseName) {
  return {
    key: "rest-over",
    text: nextExerciseName
      ? `Récupération terminée. Reprenez sur ${nextExerciseName}.`
      : "Récupération terminée. Série suivante.",
    priority: 3,
  };
}
export function tempoReminderCue(exercise, rowTempo) {
  const t = parseTempo(rowTempo || exercise?.tempo);
  if (!t) return null;
  const lines = [];
  if (typeof t.eccentric === "number" && t.eccentric >= 3)
    lines.push("Contrôlez la descente, ne lâchez pas la charge.");
  if (typeof t.top === "number" && t.top >= 1) lines.push("Serrez fort en haut.");
  if (typeof t.bottom === "number" && t.bottom >= 1)
    lines.push("Marquez la pause en bas, sans rebond.");
  return lines.length
    ? { key: `cue-${exercise?.id}`, text: lines.join(" "), priority: 1 }
    : null;
}
// Annonce des minuteurs de protocole (repos inclus) : fin par type, passage
// d'étape, compte à rebours 5-3-2-1. Le mémo rend chaque phrase unique.
const STEP_COUNTDOWN = [5, 3, 2, 1];
export const newTimerMemo = () => ({ spoken: {}, index: null, done: false });
export function timerStepAnnouncement(t, memo = newTimerMemo()) {
  const m = { spoken: { ...memo.spoken }, index: memo.index, done: memo.done };
  if (!t) return { text: null, memo: newTimerMemo() };
  if (t.done) {
    if (m.done) return { text: null, memo: m };
    m.done = true;
    const type = t.meta?.type,
      name = t.meta?.name || "";
    return {
      text:
        type === "rest"
          ? "Récupération terminée. On reprend."
          : /tirements/i.test(name)
            ? "Étirements terminés. Bonne récupération."
            : type === "warmup"
              ? "Échauffement terminé. Vous pouvez commencer."
              : "Séance terminée. Bravo.",
      memo: m,
    };
  }
  if (t.paused) return { text: null, memo: m };
  const index = t.index ?? 0;
  if (m.index !== index) {
    const first = m.index === null;
    m.index = index;
    m.spoken = {};
    if (!first) {
      const step = t.steps?.[index],
        stepName = step?.name || "";
      return {
        text:
          step?.kind === "rest" || step?.type === "rest"
            ? "Récupération."
            : stepName
              ? `Au suivant : ${stepName}.`
              : "Étape suivante.",
        memo: m,
      };
    }
    return { text: null, memo: m };
  }
  const secs = Math.ceil(t.remaining ?? 0);
  return STEP_COUNTDOWN.includes(secs) && !m.spoken[secs]
    ? ((m.spoken[secs] = true), { text: String(secs), memo: m })
    : { text: null, memo: m };
}
// File d'annonce : chaque clé n'est parlée qu'une fois ; les annonces de
// priorité < 3 sont limitées à une toutes les 1,2 s (anti-brouhaha).
export function createAnnouncer(speakFn) {
  const spoken = new Set();
  let lastAt = 0;
  return {
    say(cue, { enabled = true, force = false } = {}) {
      if (!cue || !enabled) return false;
      const { key, text, priority = 1 } = cue;
      if (!force && spoken.has(key)) return false;
      const now = Date.now();
      if (!force && priority < 3 && now - lastAt < 1200) return false;
      spoken.add(key);
      lastAt = now;
      speakFn(text);
      return true;
    },
    reset(prefix) {
      if (!prefix) {
        spoken.clear();
        return;
      }
      for (const k of [...spoken]) if (k.startsWith(prefix)) spoken.delete(k);
    },
    has: (key) => spoken.has(key),
  };
}

import { SCHEMA_VERSION, num, today } from "../engine/utils.js";
import {
  validDate,
  numeric,
  checkInEntry,
  VALID_UNITS,
} from "../engine/validation.js";
const object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const fail = (message) => {
  throw new Error(message);
};
function array(v, label, limit = 100000) {
  if (!Array.isArray(v) || v.length > limit)
    fail(`${label} : liste invalide ou trop volumineuse.`);
  return v;
}
function text(v, label, max = 5000) {
  if (typeof v !== "string" || v.length > max)
    fail(`${label} : texte invalide.`);
  return v;
}
function date(v, label, { undated = false, future = false } = {}) {
  if (undated && v === "") return;
  if (!validDate(v) || (!future && v > today()))
    fail(`${label} : date invalide.`);
}
function unique(items, label) {
  const ids = new Set();
  for (const item of items) {
    if (!object(item)) fail(`${label} : entrée invalide.`);
    text(item.id, label + " identifiant", 250);
    if (ids.has(item.id)) fail(`${label} : identifiant dupliqué.`);
    ids.add(item.id);
  }
}
function session(s, planned = false) {
  if (!object(s)) fail("Séance invalide.");
  date(s.date, "Séance", { future: planned });
  text(s.id, "Identifiant de séance", 250);
  text(s.name || "", "Nom de séance", 300);
  if (
    ![
      "planned",
      "completed",
      "partial",
      "missed",
      "inProgress",
      "superseded",
    ].includes(s.status)
  )
    fail("Statut de séance invalide.");
  numeric(s.durationSec, 0, 86400, "Durée de séance");
  numeric(s.rpe, 1, 10, "RPE de séance");
  const exercises = array(s.exercises, "Exercices", 300);
  for (const e of exercises) {
    if (!object(e)) fail("Exercice invalide.");
    text(e.exerciseId, "Exercice", 300);
    if (!VALID_UNITS.includes(e.unit)) fail("Convention de charge invalide.");
    numeric(e.targetSets, 0, 100, "Séries cibles", {
      optional: false,
      integer: true,
    });
    numeric(e.repsLow, 1, 3600, "Répétitions cibles");
    numeric(e.repsHigh, 1, 3600, "Répétitions cibles");
    numeric(e.targetLoad, 0, 1000, "Charge cible");
    numeric(e.seconds, 1, 3600, "Durée cible");
    numeric(e.rest, 0, 3600, "Repos");
    const sets = array(e.sets, "Séries", 1000);
    unique(sets, "Séries");
    for (const set of sets) {
      if (typeof set.completed !== "boolean")
        fail("Validation de série absente.");
      if (!VALID_UNITS.includes(set.unit)) fail("Unité de série invalide.");
      for (const [k, min, max] of [
        ["weight", 0, 1000],
        ["reps", 1, 3600],
        ["rpe", 1, 10],
        ["rir", 0, 10],
        ["count", 1, 100],
      ]) {
        const n = numeric(set[k], min, max, k, {
          optional:
            k !== "reps" ||
            (set.legacyAggregate === true && set.needsReps === true),
          integer: ["reps", "count"].includes(k),
        });
        if (set[k] != null) set[k] = n;
      }
      if (set.unit !== "secondes" && set.reps > 100)
        fail("Plus de 100 répétitions : vérifiez la convention de série.");
    }
  }
}
function plan(p) {
  if (!object(p)) fail("Programme invalide.");
  text(p.id, "Programme", 250);
  const sessions = array(p.sessions, "Séances prévues", 1000);
  unique(sessions, "Programme");
  for (const s of sessions) session(s, true);
}
function timer(t) {
  if (t == null) return;
  if (!object(t) || !object(t.meta)) fail("Minuteur invalide.");
  text(t.id, "Minuteur", 250);
  const steps = array(t.steps, "Étapes", 5000);
  if (!steps.length) fail("Minuteur sans étape.");
  for (const s of steps) {
    text(s.name, "Étape", 300);
    numeric(s.seconds, 1, 86400, "Durée étape", {
      optional: false,
      integer: true,
    });
  }
  numeric(t.index, 0, steps.length - 1, "Index du minuteur", {
    optional: false,
    integer: true,
  });
  for (const k of ["deadline", "checkpoint"])
    numeric(t[k], 0, 8640000000000000, k, { optional: false });
  numeric(t.elapsed, 0, 10000000, "Temps écoulé", { optional: false });
  numeric(t.remaining, 0, 86400, "Temps restant", { optional: false });
  if (typeof t.paused !== "boolean" || typeof t.done !== "boolean")
    fail("État du minuteur invalide.");
}
/** Validate a detached copy; an invalid import never partially mutates live profiles. */
export function validateState(input) {
  if (
    !object(input) ||
    input.schemaVersion !== SCHEMA_VERSION ||
    !object(input.profiles) ||
    !input.profiles.elite ||
    !input.profiles.emilie
  )
    fail(
      "Format JARVIS incompatible. Importez une sauvegarde JSON JARVIS ou un export Transformation.",
    );
  if (!["elite", "emilie"].includes(input.activeProfile))
    fail("Profil actif invalide.");
  numeric(input.updatedAt, 0, 8640000000000000, "Date de sauvegarde", {
    optional: false,
  });
  const d = structuredClone(input);
  for (const id of ["elite", "emilie"]) {
    const p = d.profiles[id];
    if (
      !object(p) ||
      p.id !== id ||
      !object(p.user) ||
      !object(p.preferences) ||
      !object(p.nutrition) ||
      !object(p.checkIns)
    )
      fail(`Profil ${id} incomplet.`);
    for (const k of [
      "sessions",
      "activities",
      "measurements",
      "photos",
      "forceTests",
      "messages",
      "adaptations",
      "goals",
    ])
      array(p[k], k);
    for (const k of ["archivedPlans", "reports", "notifications", "badges"]) {
      p[k] = p[k] ?? [];
      array(p[k], k);
    }
    for (const key of ["dayReports", "teamReviews"]) {
      p[key] = p[key] || [];
      array(p[key], key);
      unique(p[key], key);
    }
    for (const r of p.dayReports) {
      date(r.date, "Journée déclarée");
      if (!["completed", "partial", "missed"].includes(r.status))
        fail("Statut de journée invalide.");
    }
    for (const r of p.teamReviews) {
      date(r.date, "Bilan équipe", { undated: !!r.needsDate });
      numeric(r.week, 0, 51, "Semaine de bilan", {
        integer: true,
        optional: false,
      });
      for (const k of ["energy", "fatigue", "pain", "motivation"])
        numeric(r[k], 1, 5, k);
      for (const k of ["feelings", "difficulties", "questions"])
        text(r[k] || "", k, 10000);
      array(r.advice || [], "Conseils");
    }
    array(p.equipment, "Matériel", 30);
    for (const k of ["favorites", "refused", "priorities"])
      array(p.preferences[k], k, 1000);
    if (!object(p.preferences.muscleTargets))
      fail("Repères musculaires invalides.");
    array(p.preferences.poolDays, "Jours piscine", 7);
    for (const [key, min, max] of [
      ["age", 10, 110],
      ["height", 100, 250],
      ["weight", 25, 350],
      ["targetWeight", 25, 350],
      ["frequency", 1, 6],
      ["increment", 0.1, 20],
    ])
      if (p.user[key] != null)
        p.user[key] = numeric(p.user[key], min, max, key);
    text(p.user.name, "Nom du profil", 100);
    if (!["", "female", "male"].includes(p.user.sex))
      fail("Sexe de calcul invalide.");
    for (const s of p.sessions) session(s);
    unique(p.sessions, "Historique");
    if (p.workout) session(p.workout);
    if (p.plan) plan(p.plan);
    for (const a of p.archivedPlans) plan(a);
    for (const a of p.activities) {
      date(a.date, "Activité");
      if (
        !["cardio", "swim", "aqua", "hiit", "recovery", "rest"].includes(a.type)
      )
        fail("Discipline invalide.");
      for (const [k, min, max] of [
        ["durationSec", 1, 86400],
        ["distance", 0, 1000000],
        ["rpe", 1, 10],
        ["calories", 0, 10000],
        ["rounds", 1, 500],
        ["rest", 0, 3600],
      ])
        if (a[k] != null) a[k] = numeric(a[k], min, max, k);
      if (a.durationSec == null) fail("Durée réelle absente.");
    }
    unique(p.activities, "Activités");
    for (const [day, entry] of Object.entries(p.checkIns)) {
      date(day, "Bilan");
      p.checkIns[day] = checkInEntry(entry);
    }
    for (const m of p.measurements) {
      date(m.date, "Relevé", { undated: !!m.needsDate });
      numeric(m.weight, 25, 350, "Poids");
      numeric(m.bodyFat, 1, 70, "Masse grasse");
      if (!object(m.values)) fail("Mensurations invalides.");
      for (const v of Object.values(m.values))
        numeric(v, 1, 300, "Mensuration");
    }
    for (const photo of p.photos) {
      date(photo.date, "Photo", { undated: !!photo.needsDate });
      if (
        typeof photo.data !== "string" ||
        (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(
          photo.data,
        ) &&
          !/^\/media\/[a-zA-Z0-9_.-]+$/.test(photo.data))
      )
        fail("Image non autorisée. JPEG, PNG ou WebP uniquement.");
      if (photo.data.length > 22 * 1024 * 1024) fail("Photo trop volumineuse.");
    }
    for (const f of p.forceTests) {
      date(f.date, "Référence de force", { undated: !!f.needsDate });
      text(f.exerciseId, "Exercice de force", 300);
      if (!VALID_UNITS.includes(f.unit)) fail("Unité de référence invalide.");
      numeric(f.estimate, 0.1, 2000, "1RM", { optional: false });
    }
    for (const m of p.messages) {
      text(m.text, "Message", 10000);
      if (!["user", "assistant"].includes(m.role))
        fail("Auteur du message invalide.");
    }
    for (const n of p.notifications) text(n.text, "Notification", 5000);
    for (const g of p.goals) text(g.title, "Objectif", 1000);
    for (const r of p.reports) {
      if (!object(r.stats) || !Array.isArray(r.recommendations))
        fail("Rapport invalide.");
      for (const t of r.recommendations) text(t, "Recommandation", 5000);
    }
    array(p.nutrition.logs, "Journal alimentaire");
    numeric(p.nutrition.manualCalories, 1000, 6000, "Calories manuelles");
    numeric(p.nutrition.activityFactor, 1, 2.5, "Facteur activité");
    for (const log of p.nutrition.logs) {
      date(log.date, "Journal alimentaire");
      text(log.food, "Aliment", 300);
      numeric(log.grams, 0.1, 10000, "Quantité consommée", { optional: false });
    }
    timer(p.timer);
  }
  return d;
}

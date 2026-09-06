import { num, today } from "./utils.js";
export const VALID_UNITS = [
  "kg total",
  "kg/main",
  "kg ajouté",
  "secondes",
  "source à vérifier",
];
export function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(value + "T12:00:00Z");
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function numeric(
  value,
  min,
  max,
  label,
  { optional = true, integer = false } = {},
) {
  const n = num(value);
  if (n == null) {
    if (optional && (value == null || String(value).trim() === "")) return null;
    throw new Error(`${label} : valeur numérique requise.`);
  }
  if (n < min || n > max || (integer && !Number.isInteger(n)))
    throw new Error(
      `${label} : ${integer ? "nombre entier " : ""}entre ${min} et ${max}.`,
    );
  return n;
}
export function actualDate(date) {
  if (!validDate(date) || date > today())
    throw new Error(
      "Choisissez une date réelle valide, au plus tard aujourd’hui.",
    );
  return date;
}
export function actualSet(input, ex) {
  const timed = !!ex.timed;
  if (
    !VALID_UNITS.includes(input.unit) ||
    (!timed && input.unit === "secondes") ||
    (timed && input.unit !== "secondes")
  )
    throw new Error(
      "La convention de charge doit correspondre à cet exercice.",
    );
  const reps = numeric(
    input.reps,
    1,
    timed ? 3600 : 100,
    timed ? "Secondes" : "Répétitions",
    { optional: false, integer: true },
  );
  const weight = timed
    ? null
    : numeric(input.weight, 0, 1000, "Charge", { optional: !!ex.bodyweight });
  const rpe = numeric(input.rpe, 1, 10, "RPE"),
    rir = numeric(input.rir, 0, 10, "RIR");
  return {
    ...input,
    weight,
    reps,
    rpe,
    rir,
    unit: timed ? "secondes" : input.unit,
    note: String(input.note || "").slice(0, 800),
  };
}
export function actualActivity(a) {
  actualDate(a.date);
  if (!["cardio", "swim", "aqua", "hiit", "recovery", "rest"].includes(a.type))
    throw new Error("Discipline invalide.");
  return {
    ...a,
    durationSec: numeric(a.durationSec, 1, 86400, "Durée", {
      optional: false,
      integer: true,
    }),
    distance: numeric(a.distance, 0, 1000000, "Distance"),
    rpe: numeric(a.rpe, 1, 10, "RPE"),
    calories: numeric(a.calories, 0, 10000, "Calories"),
    rounds: numeric(a.rounds, 1, 500, "Séries", { integer: true }),
    rest: numeric(a.rest, 0, 3600, "Repos"),
    name: String(a.name || "Activité").slice(0, 150),
    note: String(a.note || "").slice(0, 1500),
  };
}
export function actualMeasurement(m) {
  actualDate(m.date);
  const values = {};
  for (const [key, v] of Object.entries(m.values || {})) {
    const n = numeric(v, 1, 300, "Mensuration");
    if (n != null) values[key] = n;
  }
  const weight = numeric(m.weight, 25, 350, "Poids"),
    bodyFat = numeric(m.bodyFat, 1, 70, "Masse grasse");
  if (weight == null && bodyFat == null && !Object.keys(values).length)
    throw new Error("Ajoutez au moins une mesure.");
  return { ...m, weight, bodyFat, values };
}
export function checkInEntry(entry) {
  const result = { ...entry };
  result.sleep = numeric(entry.sleep, 0, 24, "Sommeil");
  for (const key of [
    "quality",
    "energy",
    "fatigue",
    "stress",
    "soreness",
    "motivation",
  ])
    result[key] = numeric(entry[key], 1, 5, "Ressenti", { integer: true });
  return result;
}
export function userProfile(u) {
  return {
    ...u,
    name: String(u.name || "").slice(0, 60),
    age: numeric(u.age, 18, 110, "Âge", { integer: true }),
    height: numeric(u.height, 120, 240, "Taille"),
    weight: numeric(u.weight, 25, 350, "Poids"),
    targetWeight: numeric(u.targetWeight, 25, 350, "Poids cible"),
    frequency: numeric(u.frequency, 1, 6, "Fréquence", {
      optional: false,
      integer: true,
    }),
    increment: numeric(u.increment, 0.1, 20, "Incrément", { optional: false }),
  };
}

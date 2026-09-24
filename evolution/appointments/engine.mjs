import {
  today,
  validDate,
  addDays,
  hasCircumferences,
} from "../reminders/engine.mjs";
const object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const list = (v) => (Array.isArray(v) ? v.filter(object) : []);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
export const TITLES = {
  pre: "Avant ma séance",
  post: "Après ma séance",
  weekly: "Bilan hebdomadaire guidé",
  monthly: "Mensurations guidées",
};
export const MEASURES = [
  ["taille", "Tour de taille"],
  ["hanches", "Hanches"],
  ["cou", "Tour de cou"],
  ["poitrine", "Poitrine"],
  ["epaules", "Épaules"],
  ["brasD", "Bras droit"],
  ["brasG", "Bras gauche"],
  ["avBrasD", "Avant-bras droit"],
  ["avBrasG", "Avant-bras gauche"],
  ["ventre", "Ventre"],
  ["fessiers", "Fessiers"],
  ["cuisseD", "Cuisse droite"],
  ["cuisseG", "Cuisse gauche"],
  ["molletD", "Mollet droit"],
  ["molletG", "Mollet gauche"],
];
export function sessions(p, day = today()) {
  return [
    ...list(p.sessions)
      .filter((s) => ["completed", "partial"].includes(s.status))
      .map((s) => ({ ...s, ref: "session:" + s.id })),
    ...list(p.activities)
      .filter(
        (s) =>
          ["cardio", "swim", "aqua", "hiit"].includes(s.type) &&
          Number(s.durationSec) >= 1 &&
          Number(s.durationSec) <= 86400,
      )
      .map((s) => ({ ...s, ref: "activity:" + s.id })),
  ]
    .filter(
      (s) =>
        typeof s.id === "string" &&
        s.id.length <= 250 &&
        validDate(s.date) &&
        s.date <= day &&
        !s.needsDate,
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        Number(b.finishedAt || 0) - Number(a.finishedAt || 0),
    );
}
export function context(p, kind, ref = "", day = today()) {
  if (!own(TITLES, kind) || !validDate(day))
    throw new Error("Rendez-vous invalide.");
  const source =
    kind === "post" ? sessions(p, day).find((s) => s.ref === ref) : null;
  if (kind === "post" && !source)
    throw new Error("Choisis une séance réellement enregistrée.");
  const workoutId =
    kind === "pre" && typeof p.workout?.id === "string" ? p.workout.id : null;
  return {
    kind,
    day,
    ref: source?.ref || "",
    sourceDate: source?.date || day,
    workoutId,
    key:
      kind +
      ":" +
      (source ? source.ref : day + (workoutId ? ":" + workoutId : "")),
  };
}
export function defaults(c) {
  return {
    date: c.sourceDate,
    energy: "",
    minutes: "",
    pain: "",
    location: "",
    effort: "",
    problems: "",
    fatigue: "",
    motivation: "",
    feelings: "",
    difficulties: "",
    questions: "",
    weight: "",
    values: {},
    photos: false,
  };
}
function store(p) {
  return object(p.appointments) ? p.appointments : {};
}
export function record(p, c) {
  const r = store(p).records;
  return object(r) && own(r, c.key) && object(r[c.key]) ? r[c.key] : null;
}
export function draft(p, c) {
  const d = store(p).drafts;
  return object(d) && own(d, c.key) && object(d[c.key]) ? d[c.key] : null;
}
// Pick known fields only; malformed imports cannot inject actions or unbounded text into forms.
export function answers(p, c) {
  const raw = draft(p, c)?.answers || record(p, c)?.answers || {},
    result = defaults(c);
  for (const k of Object.keys(result))
    if (
      k !== "values" &&
      k !== "photos" &&
      ["string", "number"].includes(typeof raw[k])
    )
      result[k] = String(raw[k]).slice(0, 2000);
  result.photos = raw.photos === true;
  for (const [key] of MEASURES)
    if (["string", "number"].includes(typeof raw.values?.[key]))
      result.values[key] = String(raw.values[key]).slice(0, 12);
  return result;
}
export function saveDraft(p, c, form, step = 0) {
  const s = store(p);
  const drafts = {
    ...(object(s.drafts) ? s.drafts : {}),
    [c.key]: {
      kind: c.kind,
      context: c,
      answers: structuredClone(form),
      step: Math.max(0, Math.min(2, step)),
      updatedAt: Date.now(),
    },
  };
  p.appointments = { ...s, version: 1, drafts };
}
export function clearDraft(p, c) {
  const s = store(p),
    drafts = { ...(object(s.drafts) ? s.drafts : {}) };
  delete drafts[c.key];
  p.appointments = { ...s, version: 1, drafts };
}
function number(v, min, max, label, optional = false) {
  if (optional && (v === "" || v == null)) return null;
  if (
    v === "" ||
    v == null ||
    typeof v === "boolean" ||
    !Number.isFinite(Number(v)) ||
    Number(v) < min ||
    Number(v) > max
  )
    throw new Error(
      label + " : valeur requise entre " + min + " et " + max + ".",
    );
  return Number(v);
}
function text(v, label) {
  if (typeof v !== "string" || v.length > 2000)
    throw new Error(label + " : texte limité à 2 000 caractères.");
  return v.trim();
}
export function prepare(
  p,
  c,
  input,
  {
    makeReview,
    day = today(),
    id = globalThis.crypto?.randomUUID?.() || String(Date.now()),
  } = {},
) {
  if (!validDate(c.day) || c.day > day)
    throw new Error("Contexte de date invalide.");
  const current = context(
    p,
    c.kind,
    c.ref,
    ["weekly", "monthly"].includes(c.kind) ? c.day : day,
  );
  if (current.key !== c.key)
    throw new Error(
      "La date ou la séance a changé. Ferme puis rouvre ce rendez-vous.",
    );
  const a = { ...input, values: { ...input.values } };
  if (!validDate(a.date) || a.date > day)
    throw new Error("Choisis une date réelle, pas une date future.");
  if (c.kind === "pre" && a.date !== day)
    throw new Error("La préparation concerne aujourd’hui.");
  if (c.kind === "post" && a.date !== current.sourceDate)
    throw new Error(
      "Ce retour appartient à la date de la séance sélectionnée.",
    );
  for (const k of [
    "location",
    "problems",
    "feelings",
    "difficulties",
    "questions",
  ])
    a[k] = text(a[k] || "", k);
  if (["pre", "post"].includes(c.kind) && !["yes", "no"].includes(a.pain))
    throw new Error("Indique si une douleur importante est présente.");
  if (c.kind === "pre") {
    a.energy = number(a.energy, 1, 5, "Énergie");
    a.minutes = number(a.minutes, 5, 240, "Temps disponible");
    if (!Number.isInteger(a.energy) || !Number.isInteger(a.minutes))
      throw new Error("Utilise des valeurs entières.");
  }
  if (c.kind === "post") a.effort = number(a.effort, 1, 10, "Effort ressenti");
  let review = null,
    measurement = null;
  if (c.kind === "weekly") {
    if (typeof makeReview !== "function")
      throw new Error("Le moteur de bilan est indisponible.");
    review = makeReview(p, a); // Existing dated team review, advice and previousVersions semantics.
  }
  if (c.kind === "monthly") {
    const values = {};
    for (const [key, label] of MEASURES) {
      const v = number(a.values[key], 1, 300, label, true);
      if (v != null) values[key] = v;
    }
    if (!hasCircumferences({ values }))
      throw new Error(
        "Renseigne au moins un tour corporel en cm. Le poids seul ne valide pas ce rendez-vous.",
      );
    a.values = values;
    a.weight = number(a.weight, 25, 350, "Poids", true);
    a.photos = a.photos === true;
    const measurementId =
      record(p, c)?.measurementId || "appointment-measure-" + id;
    const existing = list(p.measurements).find((m) => m.id === measurementId);
    measurement = {
      ...existing,
      id: measurementId,
      date: a.date,
      weight: a.weight,
      bodyFat: existing?.bodyFat ?? null,
      values,
      source: "appointment",
    };
  }
  return {
    context: current,
    answers: a,
    review,
    measurement,
    savedAt: Date.now(),
    token: id,
  };
}
export function apply(p, prepared, day = today()) {
  const {
    context: c,
    answers: a,
    review,
    measurement,
    savedAt,
    token,
  } = prepared;
  // Do not throw inside the host React state updater when a source was deleted/changed.
  let current;
  try {
    current = context(
      p,
      c.kind,
      c.ref,
      ["weekly", "monthly"].includes(c.kind) ? c.day : day,
    );
  } catch {
    return false;
  }
  if (current.key !== c.key || current.sourceDate !== c.sourceDate)
    return false;
  if (review) {
    p.teamReviews = [
      ...list(p.teamReviews).filter((r) => r.id !== review.id),
      review,
    ];
  }
  if (measurement) {
    p.measurements = [
      ...list(p.measurements).filter((r) => r.id !== measurement.id),
      measurement,
    ];
  }
  if (["pre", "post"].includes(c.kind) && a.pain === "yes") {
    // Join the existing safety signal; a "no" answer must never erase an earlier warning.
    p.checkIns = {
      ...p.checkIns,
      [a.date]: { ...p.checkIns?.[a.date], painReported: true },
    };
  }
  const s = store(p),
    old = record(p, c);
  p.appointments = {
    ...s,
    version: 1,
    records: {
      ...(object(s.records) ? s.records : {}),
      [c.key]: {
        kind: c.kind,
        key: c.key,
        date: a.date,
        ref: c.ref,
        workoutId: c.workoutId,
        answers: a,
        savedAt,
        token,
        ...(review ? { reviewId: review.id } : {}),
        ...(measurement ? { measurementId: measurement.id } : {}),
        ...(old ? { previousSavedAt: old.savedAt } : {}),
      },
    },
  };
  clearDraft(p, c);
  return true;
}
export function recentRecords(p) {
  return Object.values(object(store(p).records) ? store(p).records : {})
    .filter((r) => object(r) && own(TITLES, r.kind) && validDate(r.date))
    .sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0))
    .slice(0, 12);
}
export function weekFacts(p, day = today()) {
  const start = addDays(day, -6),
    rows = sessions(p, day).filter((s) => s.date >= start);
  return {
    start,
    end: day,
    count: rows.length,
    partial: rows.filter((s) => s.status === "partial").length,
  };
}

export function drafts(p) {
  return Object.entries(object(store(p).drafts) ? store(p).drafts : {})
    .filter(
      ([key, d]) =>
        object(d) &&
        object(d.context) &&
        own(TITLES, d.kind) &&
        validDate(d.context.day) &&
        key === d.context.key,
    )
    .sort((a, b) => Number(b[1].updatedAt || 0) - Number(a[1].updatedAt || 0));
}

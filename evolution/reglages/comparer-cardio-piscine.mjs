/**
 * comparer-cardio-piscine.mjs
 * ---------------------------
 * Compare, jour par jour, le placement du CARDIO et de la PISCINE :
 *   - REFERENCE  : weekPlan() des deux HTML sources (Transformation_Elite_V2 = Yanis,
 *                  Emilie_transformation_V7 = Émilie), telles qu'extraites dans
 *                  audit/reference/*.js
 *   - APPLICATION: src/engine/source-schedule.js (le moteur réel, importé tel quel)
 *
 * Ne touche à aucun média, ne modifie aucune donnée, n'écrit rien hors du rapport.
 *
 * Usage : node evolution/reglages/comparer-cardio-piscine.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const APP = resolve(ROOT, "yanis-fitness-evolution");

const { sourceDay, sourcePosition, sourceTrainingDays, sourceCardioDay } =
  await import(resolve(APP, "src/engine/source-schedule.js"));
const legacy = JSON.parse(
  readFileSync(resolve(APP, "src/data/legacy.json"), "utf8"),
);

/* ------------------------------------------------------------------ outils */
const DAY = 86400000;
const parseDate = (s) => {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const addDays = (d, n) => new Date(d.getTime() + n * DAY);
const dateKey = (d) => d.toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((parseDate(a) - parseDate(b)) / DAY);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* --------------------------------------------- programPos (commun aux deux) */
function programPos(id, dateStr, start) {
  const d = parseDate(dateStr),
    s = parseDate(start);
  const diff = Math.max(0, Math.floor((d - s) / DAY));
  const weekGlobal = Math.min(51, Math.floor(diff / 7));
  if (weekGlobal >= 48)
    return {
      idx: "F",
      weekGlobal,
      phase: legacy[id].PROGRAM.finale,
      deload: true,
    };
  const idx = Math.min(12, Math.floor(weekGlobal / 4) + 1);
  return {
    idx,
    week: (weekGlobal % 4) + 1,
    weekGlobal,
    phase: legacy[id].PROGRAM[String(idx)],
    deload: (weekGlobal % 4) + 1 === 4,
  };
}

/* ============================== REFERENCE : weekPlan du HTML source ====== */
function legacyWeekPlan(id, weekStart, { frequency, poolJsDays, equip, start }) {
  // le HTML calcule pos une seule fois, sur le 1er jour affiché de la semaine
  const pos = programPos(id, weekStart, start);
  const phase = pos.phase,
    a = clamp(frequency, 3, 5);
  const out = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(parseDate(weekStart), i);
    const wk = day.getUTCDay(); // 0 dim .. 6 sam
    const dk = dateKey(day);
    let key = null,
      type = null,
      cardio = null;
    if (id === "elite") {
      const keys = Object.keys(phase.sessions || {}),
        n = keys.length,
        eff = Math.min(a, n),
        off = pos.weekGlobal % n;
      const trainDays = a === 3 ? [1, 3, 5] : a === 4 ? [1, 2, 4, 5] : [1, 2, 4, 5, 6];
      if (trainDays.includes(wk)) {
        const idx = trainDays.indexOf(wk);
        if (idx < eff) {
          key = "J" + (((idx + off) % n) + 1);
          type = "seance";
        }
      }
      if (!key && !pos.deload && phase.type !== "finale") {
        const metDays = a === 3 ? [2, 6] : a === 4 ? [3, 6] : [3, 0];
        if (metDays.includes(wk)) {
          key = "METCON";
          type = "metcon";
        }
      }
      if (!key && !pos.deload && phase.type !== "finale") {
        if (poolJsDays.includes(wk)) {
          key = "PISCINE";
          type = "piscine";
        }
      }
    } else {
      const seq = legacy.emilie.SEQUENCE_SEANCES[String(a)];
      const trainDays = legacy.emilie.JOURS_SEANCES[String(a)];
      let cardioDays = legacy.emilie.JOURS_CARDIO[String(a)];
      if (pos.deload) cardioDays = cardioDays.slice(0, 1);
      if (trainDays.includes(wk)) {
        const idx = trainDays.indexOf(wk);
        if (idx < seq.length && phase.sessions?.[seq[idx]]) {
          key = seq[idx];
          type = "seance";
        }
      }
      if (!key && cardioDays.includes(wk)) {
        cardio = legacyCardioDuJour(id, dk, wk, pos, equip);
        key = "CARDIO";
        type = "metcon"; // le HTML source range le cardio sous 'metcon'
      }
      if (!key && !type && poolJsDays.includes(wk)) type = "piscine";
    }
    out.push({ date: dk, wk, key, type, cardio });
  }
  return out;
}
/** Copie fidèle de emilie-cardioDuJour.js (audit/reference). */
function legacyCardioDuJour(id, dateStr, wkDay, pos, equip) {
  const dispo = equip || {};
  let format;
  if (pos.deload) format = dispo.piscine !== false ? "piscine" : "repos";
  else
    format =
      wkDay === 5 && dispo.piscine !== false
        ? "piscine"
        : dispo.elliptique !== false
          ? "elliptique"
          : "repos";
  let duree, zone;
  if (pos.deload) {
    duree = format === "piscine" ? 30 : 25;
    zone = 0;
  } else if (pos.phase.type === "developpement") {
    duree = format === "piscine" ? 25 : 20;
    zone = 1;
  } else if (pos.phase.type === "composition") {
    duree = format === "piscine" ? 30 : 28;
    zone = wkDay === 3 ? 2 : 1;
  } else if (["maintien", "finale"].includes(pos.phase.type)) {
    duree = format === "piscine" ? 30 : 25;
    zone = 1;
  } else {
    duree = format === "piscine" ? 25 : 20;
    zone = 1;
  }
  if (format === "repos") {
    duree = 35;
    zone = 0;
  }
  return { format, duree, zone };
}

/* ============================== APPLICATION : le moteur réel ============= */
function appProfile(id, { frequency, poolMondayDays, equipment, startDate }) {
  const em = id === "emilie";
  return {
    id,
    user: { frequency, startDate, name: em ? "Émilie" : "Yanis" },
    equipment,
    preferences: {
      poolDays: poolMondayDays,
      cardioChoices: {},
      priorities: [],
    },
    plan: null,
    sessions: [],
    activities: [],
    checkIns: {},
    measurements: [],
    dayReports: [],
  };
}

/* ============================== MISE EN ÉQUIVALENCE ====================== */
// types HTML -> types application
function ref2app(id, ref) {
  if (ref.type === "seance") return "strength:" + ref.key;
  if (ref.type === "piscine") return "swim";
  if (ref.type === "metcon") {
    if (id === "elite") return "metcon";
    const f = ref.cardio?.format;
    return f === "piscine" ? "swim" : f === "repos" ? "recovery" : "cardio";
  }
  return "rest";
}
function app2ref(day) {
  if (day.type === "strength") return "strength:" + day.sessionKey;
  return day.type; // metcon | swim | cardio | recovery | rest
}

const LABEL = {
  rest: "Repos",
  metcon: "METCON",
  swim: "Piscine",
  cardio: "Cardio",
  recovery: "Récup. active",
};

/* ============================== SCÉNARIOS ================================ */
const START = "2026-09-07"; // un lundi
const SCENARIOS = [];
for (const id of ["elite", "emilie"])
  for (const frequency of [3, 4, 5])
    for (const pool of [
      { name: "aucun jour piscine", monday: [] },
      { name: "jeudi + dimanche (L=0)", monday: [3, 6] },
      { name: "toute la semaine", monday: [0, 1, 2, 3, 4, 5, 6] },
    ])
      SCENARIOS.push({ id, frequency, pool });

const report = { start: START, scenarios: [], divergences: {}, totals: {} };

for (const sc of SCENARIOS) {
  const em = sc.id === "emilie";
  const equipment = em
    ? ["bodyweight", "band", "dumbbell", "barbell", "bench", "pool", "elliptical"]
    : ["bodyweight", "dumbbell", "barbell", "bench", "cable", "machine", "band", "pullup", "pool", "elliptical"];
  // jours piscine : l'app stocke en base lundi (0=lundi) ; le HTML en base JS (0=dimanche)
  const poolJsDays = sc.pool.monday.map((i) => (i + 1) % 7);
  const p = appProfile(sc.id, {
    frequency: sc.frequency,
    poolMondayDays: sc.pool.monday,
    equipment,
    startDate: START,
  });

  const rows = [];
  let diff = 0;
  const samples = {};
  // 52 semaines du programme
  for (let w = 0; w < 52; w++) {
    const weekStart = dateKey(addDays(parseDate(START), w * 7));
    const ref = legacyWeekPlan(sc.id, weekStart, {
      frequency: sc.frequency,
      poolJsDays,
      equip: { piscine: true, elliptique: true },
      start: START,
    });
    const pos = sourcePosition(p, weekStart);
    for (const r of ref) {
      const a = sourceDay(p, r.date);
      const ra = ref2app(sc.id, r),
        aa = app2ref(a);
      const same = ra === aa;
      if (!same) {
        diff++;
        const tag = `${ra} -> ${aa}`;
        report.divergences[tag] = (report.divergences[tag] || 0) + 1;
        if (!samples[tag])
          samples[tag] = {
            date: r.date,
            semaine: w + 1,
            phase: a.phase?.type || pos.phase.type,
            deload: pos.deload,
            jour: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][r.wk],
          };
      }
      rows.push({ date: r.date, ref: ra, app: aa, same });
    }
  }
  report.scenarios.push({
    profil: sc.id,
    nom: em ? "Émilie" : "Yanis",
    frequence: sc.frequency,
    joursPiscine: sc.pool.name,
    jours: rows.length,
    divergents: diff,
    echantillons: samples,
  });
}

/* ============================== ÉQUIPEMENT : que se passe-t-il sans... ==== */
const equipmentCases = [];
for (const id of ["elite", "emilie"]) {
  for (const [label, equipment] of [
    ["piscine + elliptique", ["pool", "elliptical"]],
    ["elliptique seulement", ["elliptical"]],
    ["piscine seulement", ["pool"]],
    ["ni l’un ni l’autre", []],
  ]) {
    const p = appProfile(id, {
      frequency: 4,
      poolMondayDays: id === "emilie" ? [4] : [],
      equipment,
      startDate: START,
    });
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = dateKey(addDays(parseDate(START), i));
      const d = sourceDay(p, date);
      week.push({
        jour: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][parseDate(date).getUTCDay()],
        type: d.type,
        nom: d.name,
        cardio: d.cardio ? `${d.cardio.format} ${d.cardio.minutes} min Z${d.cardio.zone}` : null,
      });
    }
    equipmentCases.push({
      profil: id === "emilie" ? "Émilie" : "Yanis",
      materiel: label,
      semaine1: week,
    });
  }
}
report.equipmentCases = equipmentCases;

/* ============================== DURÉES / ZONES ============================ */
const durees = [];
for (const id of ["elite", "emilie"]) {
  const p = appProfile(id, {
    frequency: 4,
    poolMondayDays: id === "emilie" ? [4] : [],
    equipment: ["pool", "elliptical"],
    startDate: START,
  });
  for (const [phaseKey, label] of [
    ["1", "Mois 1 · adaptation"],
    ["7", "Mois 7 · développement"],
    ["10", "Mois 10 · composition"],
    ["12", "Mois 12 · maintien"],
    ["finale", "Finale (S49+)"],
  ]) {
    const weekStart = dateKey(
      addDays(parseDate(START), (phaseKey === "finale" ? 48 : (Number(phaseKey) - 1) * 4) * 7),
    );
    const pos = sourcePosition(p, weekStart);
    for (let i = 0; i < 7; i++) {
      const date = dateKey(addDays(parseDate(weekStart), i));
      const d = sourceDay(p, date);
      if (!["cardio", "swim", "recovery", "metcon"].includes(d.type)) continue;
      durees.push({
        profil: id === "emilie" ? "Émilie" : "Yanis",
        moment: label,
        deload: pos.deload,
        jour: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][parseDate(date).getUTCDay()],
        type: d.type,
        nom: d.name,
        cardio: d.cardio,
      });
    }
  }
}
report.durees = durees;

/* ============ REGLE D'AUTO-REGULATION : « 3 séances dures / 7 j » ======== */
/* Source (elite-coachExtra.js)                                              */
/*   hard = sessions des 7 derniers jours :                                  */
/*     tabata                      -> toujours dure                          */
/*     cardio dont proto ~ /HIIT|Intervalles/                                */
/*     natation dont proto ~ !/Recovery|Endurance/                           */
/*   puis : moderate = score<65 || hard>=3                                   */
/* Application (source-schedule.js, sourceExtra)                             */
/*   hard = activités des 7 derniers jours : type 'hiit' ou 'aqua', ou rpe>=8*/
/*   puis : moderate = (score!=null && score<65) || hard>=3                  */
const SEANCES = {
  "METCON elliptique HIIT + Swim Sprint": {
    legacy: [
      { kind: "cardio", proto: "METCON Elliptique HIIT 20 min" },
      { kind: "natation", proto: "Swim Sprint BEGINNER" },
    ],
    app: [
      { type: "cardio", protocolId: "hiit", rpe: 6 },
      { type: "swim", protocolId: "sprint", rpe: 6 },
    ],
  },
  "METCON elliptique Intervalles + Swim Interval": {
    legacy: [
      { kind: "cardio", proto: "METCON Elliptique Intervalles 20 min" },
      { kind: "natation", proto: "Swim Interval BEGINNER" },
    ],
    app: [
      { type: "cardio", protocolId: "inter", rpe: 6 },
      { type: "swim", protocolId: "interval", rpe: 6 },
    ],
  },
  "Aqua HIIT seul": {
    legacy: [{ kind: "natation", proto: "Aqua HIIT BEGINNER" }],
    app: [{ type: "aqua", protocolId: "aquahiit", rpe: 6 }],
  },
  "Aqua Tabata seul": {
    legacy: [{ kind: "tabata", proto: "Tabata" }],
    app: [{ type: "hiit", protocolId: null, rpe: 6 }],
  },
  "Swim Endurance seul": {
    legacy: [{ kind: "natation", proto: "Swim Endurance BEGINNER" }],
    app: [{ type: "swim", protocolId: "endurance", rpe: 6 }],
  },
  "Aqua Recovery seul": {
    legacy: [{ kind: "natation", proto: "Aqua Recovery douce (12 min)" }],
    app: [{ type: "recovery", protocolId: "recovery", rpe: 3 }],
  },
  "Cardio endurance seul": {
    legacy: [{ kind: "cardio", proto: "METCON Elliptique Endurance 20 min" }],
    app: [{ type: "cardio", protocolId: "endu", rpe: 5 }],
  },
  "Cardio libre noté RPE 9": {
    legacy: [{ kind: "cardio", proto: "Endurance libre" }],
    app: [{ type: "cardio", protocolId: null, rpe: 9 }],
  },
};
const hardLegacy = (sessions) =>
  sessions.filter((s) => {
    if (s.kind === "tabata") return true;
    if (s.kind === "cardio") return /HIIT|Intervalles/.test(s.proto || "");
    return !/Recovery|Endurance/.test(s.proto || ""); // natation
  }).length;
const hardApp = (activities, date) =>
  activities.filter((a) => ["hiit", "aqua"].includes(a.type) || a.rpe >= 8)
    .length;

const regulation = [];
for (const [label, def] of Object.entries(SEANCES))
  for (const count of [1, 3]) {
    const legacySessions = Array.from({ length: count }, () => def.legacy).flat();
    const appActivities = Array.from({ length: count }, () =>
      def.app.map((a) => ({ date: "2026-11-02", ...a })),
    ).flat();
    const score = 70; // bonne fraîcheur : seul le compte de séances dures peut basculer
    const hL = hardLegacy(legacySessions),
      hA = hardApp(appActivities);
    regulation.push({
      cas: `${label} ×${count}`,
      dureSource: hL,
      dureApp: hA,
      basculeSource: score < 65 || hL >= 3 ? "modéré" : "intense",
      basculeApp: score < 65 || hA >= 3 ? "modéré" : "intense",
    });
  }
report.regulation = regulation;

/* ============ DUREES / ZONES : Émilie, source vs application ============= */
const dureesZones = [];
{
  const id = "emilie";
  const p = appProfile(id, {
    frequency: 4,
    poolMondayDays: [4],
    equipment: ["pool", "elliptical"],
    startDate: START,
  });
  const equip = { piscine: true, elliptique: true };
  for (let w = 0; w < 52; w++) {
    const weekStart = dateKey(addDays(parseDate(START), w * 7));
    const pos = programPos(id, weekStart, START);
    for (let i = 0; i < 7; i++) {
      const day = addDays(parseDate(weekStart), i),
        dk = dateKey(day),
        wk = day.getUTCDay();
      const app = sourceDay(p, dk);
      if (!app.cardio) continue;
      const ref = legacyCardioDuJour(id, dk, wk, pos, equip);
      const same =
        ref.format === app.cardio.format &&
        ref.duree === app.cardio.minutes &&
        ref.zone === app.cardio.zone;
      if (!same)
        dureesZones.push({
          date: dk,
          semaine: w + 1,
          source: `${ref.format} ${ref.duree} min Z${ref.zone}`,
          app: `${app.cardio.format} ${app.cardio.minutes} min Z${app.cardio.zone}`,
        });
    }
  }
}
report.dureesZones = dureesZones;

report.totals = {
  scenarios: report.scenarios.length,
  joursComparés: report.scenarios.reduce((n, s) => n + s.jours, 0),
  divergents: report.scenarios.reduce((n, s) => n + s.divergents, 0),
  cardioDureesDivergentes: dureesZones.length,
  regulationDivergente: regulation.filter(
    (r) => r.basculeSource !== r.basculeApp,
  ).length,
};

console.log(JSON.stringify(report, null, 1));

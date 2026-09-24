import { legacy } from "../data/library.js";
import { today, parseDate, addDays, dayDiff, clamp, num } from "./utils.js";

export const SOURCE_SCHEDULE_REVISION = 3;
export function sourcePosition(p, date = today()) {
  const start = p.user?.startDate || today(),
    diff = dayDiff(date, start),
    weekGlobal = clamp(Math.floor(Math.max(0, diff) / 7), 0, 51),
    phaseKey =
      weekGlobal >= 48 ? "finale" : String(Math.floor(weekGlobal / 4) + 1);
  return {
    start,
    beforeStart: diff < 0,
    afterEnd: diff >= 364,
    weekGlobal,
    week: (weekGlobal % 4) + 1,
    phaseKey,
    phase: legacy[p.id].PROGRAM[phaseKey],
    deload: weekGlobal >= 48 || weekGlobal % 4 === 3,
    weekStart: addDays(start, Math.floor(Math.max(0, diff) / 7) * 7),
  };
}
export function sourceTrainingDays(id, frequency = 4) {
  const f = Math.round(frequency);
  const js = (
    id === "elite"
      ? { 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 4, 5, 6] }
      : { 3: [1, 3, 5], 4: [1, 2, 4, 6], 5: [1, 2, 4, 5, 6] }
  )[f];
  return js
    ? js.map((d) => (d + 6) % 7)
    : { 1: [0], 2: [0, 3], 6: [0, 1, 2, 3, 4, 5] }[f] || [0, 1, 3, 4];
}
export function sourceCardioDay(p, date, jsDay, pos = sourcePosition(p, date)) {
  const choices = p.preferences.cardioChoices || {},
    pool = p.equipment.includes("pool"),
    elliptical = p.equipment.includes("elliptical");
  let format =
    choices[date] ||
    (pos.deload
      ? pool
        ? "piscine"
        : "repos"
      : jsDay === 5 && pool
        ? "piscine"
        : elliptical
          ? "elliptique"
          : "repos");
  if (!["piscine", "elliptique", "repos"].includes(format)) format = "repos";
  let minutes, detail, zone;
  if (pos.deload) {
    minutes = format === "piscine" ? 30 : 25;
    zone = 0;
    detail =
      "Semaine de deload : récupération active uniquement, aucune intensité.";
  } else if (pos.phase.type === "developpement") {
    minutes = format === "piscine" ? 25 : 20;
    zone = 1;
    detail =
      "Cardio modéré et réduit pour préserver la récupération des fessiers.";
  } else if (pos.phase.type === "composition") {
    minutes = format === "piscine" ? 30 : 28;
    zone = jsDay === 3 ? 2 : 1;
    detail =
      "Cardio de la phase de composition : intensité maîtrisée, en respectant la récupération.";
  } else if (["maintien", "finale"].includes(pos.phase.type)) {
    minutes = format === "piscine" ? 30 : 25;
    zone = 1;
    detail = "Entretien de la condition physique à allure modérée.";
  } else {
    minutes = format === "piscine" ? 25 : 20;
    zone = 1;
    detail = "Cardio modéré, conversation possible par phrases courtes.";
  }
  if (format === "repos") {
    minutes = 35;
    zone = 0;
    detail = "Marche active et mobilité, sans séance intense.";
  }
  return { format, minutes, zone, detail };
}
/** Port of each HTML weekPlan: frequency means availability, not invented extra muscle sessions. */
export function sourceDay(
  p,
  date,
  { frequency = p.user.frequency || 4, days } = {},
) {
  const pos = sourcePosition(p, date),
    jsDay = parseDate(date).getDay(),
    keys = Object.keys(pos.phase.sessions || {}),
    f = Math.round(frequency);
  if (pos.beforeStart || pos.afterEnd)
    return {
      date,
      type: "rest",
      name: pos.beforeStart ? "Programme pas encore commencé" : "Cycle terminé",
      ...pos,
    };
  const training = (days || sourceTrainingDays(p.id, f)).map(
    (d) => (d + 1) % 7,
  );
  let key = null,
    type = "rest",
    cardio = null;
  if (training.includes(jsDay)) {
    const i = training.indexOf(jsDay);
    if (p.id === "elite") {
      if (i < Math.min(f, keys.length))
        key = keys[(i + (pos.weekGlobal % keys.length)) % keys.length];
    } else {
      const seq =
        {
          3: ["J1", "J3", "J4"],
          4: ["J1", "J2", "J3", "J4"],
          5: ["J1", "J2", "J3", "J4", "J5"],
        }[f] || keys.slice(0, f);
      if (pos.phase.sessions[seq[i]]) key = seq[i];
    }
    if (key) type = "strength";
  }
  if (!key) {
    if (p.id === "elite") {
      const met = { 3: [2, 6], 4: [3, 6], 5: [3, 0] }[f] || [2, 6];
      if (!pos.deload && pos.phase.type !== "finale" && met.includes(jsDay))
        type = "metcon";
      else if (!pos.deload && p.preferences.poolDays?.includes((jsDay + 6) % 7))
        type = "swim";
    } else {
      let cd = { 3: [2, 6], 4: [3, 5], 5: [3] }[f] || [2, 6];
      if (pos.deload) cd = cd.slice(0, 1);
      if (cd.includes(jsDay)) {
        cardio = sourceCardioDay(p, date, jsDay, pos);
        type =
          cardio.format === "piscine"
            ? "swim"
            : cardio.format === "repos"
              ? "recovery"
              : "cardio";
      } else if (p.preferences.poolDays?.includes((jsDay + 6) % 7))
        type = "swim";
    }
  }
  const original = key ? pos.phase.sessions[key] : null;
  return {
    ...pos,
    date,
    jsDay,
    type,
    sessionKey: key,
    original,
    cardio,
    name:
      original?.nom ||
      (type === "metcon"
        ? "METCON elliptique + piscine"
        : type === "swim"
          ? "Piscine · programme source"
          : type === "cardio"
            ? "Cardio elliptique"
            : pos.deload
              ? "Repos · semaine allégée"
              : "Repos"),
  };
}
export function sourceWeek(p, date = today(), opts = {}) {
  const pos = sourcePosition(p, date);
  return Array.from({ length: 7 }, (_, i) =>
    sourceDay(p, addDays(pos.weekStart, i), opts),
  );
}
/** Original recovery formula, only when all seven observations exist: no invented median inputs. */
export function sourceRecoveryScore(entry) {
  if (
    !entry ||
    [
      "sleep",
      "quality",
      "energy",
      "fatigue",
      "stress",
      "soreness",
      "motivation",
    ].some((k) => num(entry[k]) == null)
  )
    return null;
  const h = +entry.sleep,
    sl =
      h >= 8.5
        ? 10
        : h >= 7.5
          ? 8.6
          : h >= 6.5
            ? 7
            : h >= 5.5
              ? 5
              : h >= 4
                ? 3
                : 1;
  return clamp(
    Math.round(
      (sl * 0.25 +
        entry.quality * 2 * 0.15 +
        entry.energy * 2 * 0.2 +
        (6 - entry.fatigue) * 2 * 0.15 +
        (6 - entry.stress) * 2 * 0.1 +
        (6 - entry.soreness) * 2 * 0.1 +
        entry.motivation * 2 * 0.05) *
        10,
    ),
    0,
    100,
  );
}
export function sourceRecentRecovery(p, date = today()) {
  const direct = sourceRecoveryScore(p.checkIns?.[date]);
  if (direct != null) return direct;
  const end = date > today() ? today() : date,
    start = addDays(end, -6),
    values = Object.entries(p.checkIns || {})
      .filter(([d]) => d >= start && d <= end)
      .map(([, v]) => sourceRecoveryScore(v))
      .filter((v) => v != null);
  return values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : null;
}
export function sourceExtraSequence(p, date) {
  let n = 0;
  for (
    let d = p.user.startDate || today();
    d <= date && dayDiff(d, p.user.startDate || today()) < 364;
    d = addDays(d, 1)
  ) {
    const x = sourceDay(p, d);
    if (["metcon", "swim"].includes(x.type)) n++;
  }
  return n;
}
const POOL_NAME = {
  endurance: "Swim Endurance",
  interval: "Swim Interval",
  sprint: "Swim Sprint",
  aquahiit: "Aqua HIIT",
  recovery: "Aqua Recovery",
  aquatabata: "Aqua Tabata",
};
export function sourcePoolProtocol(p, date, { planning = false } = {}) {
  const pos = sourcePosition(p, date),
    score = planning ? null : sourceRecentRecovery(p, date),
    m = pos.phaseKey === "finale" ? 12 : +pos.phaseKey;
  if (pos.deload)
    return {
      id: "recovery",
      level: 1,
      reason: "Récupération aquatique de la semaine allégée.",
    };
  if (score != null && score < 60)
    return {
      id: "recovery",
      level: 0,
      reason: "Récupération déclarée basse : version douce proposée.",
    };
  if (["adaptation", "developpement"].includes(pos.phase.type))
    return {
      id: "endurance",
      level: m <= 3 ? 0 : 1,
      reason: "Fond aquatique prévu pour cette phase.",
    };
  if (pos.phase.type === "composition")
    return {
      id: "interval",
      level: m <= 8 ? 0 : 1,
      reason: "Intervalles aquatiques de la phase de composition.",
    };
  return {
    id: "interval",
    level: m >= 10 ? 1 : 0,
    reason: "Intervalles aquatiques du programme source.",
  };
}
export function sourcePool(p, id, level = 0) {
  const proto = legacy[p.id].POOL_PROTOS.find((x) => x.id === id);
  const data = proto?.niveaux[level] || proto?.niveaux[0];
  return {
    id,
    level,
    name: proto?.nom || POOL_NAME[id] || id,
    levelName: data?.n || "",
    description: proto?.desc || "",
    advice: data?.conseil || "",
    steps: data?.steps || [],
    seconds: (data?.steps || []).reduce((n, s) => n + Number(s[1]), 0),
  };
}
function rotation(list, index) {
  return [
    ...list.slice(index % list.length),
    ...list.slice(0, index % list.length),
  ];
}
export function sourceExtra(p, day, { planning = false, sequence } = {}) {
  const date = day.date,
    score = planning ? null : sourceRecentRecovery(p, date),
    pos = sourcePosition(p, date);
  let pool,
    cardio = null,
    reason = "";
  if (p.id === "emilie") {
    if (day.type === "swim") {
      pool = sourcePoolProtocol(p, date, { planning });
      reason = pool.reason;
    } else {
      const c =
        day.cardio || sourceCardioDay(p, date, parseDate(date).getDay(), pos);
      cardio = {
        id: c.zone === 2 ? "inter" : c.format === "repos" ? "recup" : "endu",
        minutes: c.minutes,
        format: c.format === "repos" ? "walk" : "elliptical",
      };
      reason = c.detail;
    }
  } else {
    const seq = sequence ?? sourceExtraSequence(p, date);
    if (day.type === "rest") {
      if (score != null && score < 50)
        return {
          name: "Repos et mobilité douce",
          components: [],
          reason: "Récupération déclarée basse : aucun effort imposé.",
          score,
          sourcePrescription: pos.phase.metcon,
        };
      pool = { id: "recovery", level: 1 };
      reason =
        "Option de récupération active prévue par le coach du fichier, sans séance intense obligatoire.";
    } else if (pos.deload || (score != null && score < 50)) {
      pool = { id: "recovery", level: 0 };
      reason = pos.deload
        ? "Semaine allégée du HTML : Aqua Recovery douce uniquement."
        : "Récupération déclarée basse : version aquatique douce proposée, à confirmer.";
    } else {
      const recent = (p.activities || []).filter(
          (a) => a.date >= addDays(date, -6) && a.date <= date,
        ),
        hard = recent.filter(
          (a) => ["hiit", "aqua"].includes(a.type) || a.rpe >= 8,
        ).length;
      const moderate = (score != null && score < 65) || hard >= 3;
      const options = rotation(
        moderate
          ? [
              { id: "interval", level: 0 },
              { id: "aquahiit", level: 0 },
              { id: "aquatabata", level: 0 },
              { id: "endurance", level: 0 },
            ]
          : [
              { id: "interval", level: 1 },
              { id: "aquatabata", level: 1 },
              { id: "sprint", level: 0 },
              { id: "aquahiit", level: 1 },
            ],
        seq,
      );
      const lastPool = recent
        .filter((a) => ["swim", "aqua"].includes(a.type))
        .at(-1)?.protocolId;
      pool = options.find((x) => x.id !== lastPool) || options[0];
      const ids = rotation(
          moderate ? ["inter", "endu"] : ["hiit", "inter"],
          seq,
        ),
        lastCardio = recent
          .filter((a) => a.type === "cardio")
          .at(-1)?.protocolId;
      cardio = {
        id: ids.find((x) => x !== lastCardio) || ids[0],
        minutes: score != null && score < 60 ? 15 : 20,
        format: "elliptical",
      };
      reason =
        score == null
          ? "Combinaison et rotation du fichier source. Récupération non renseignée : intensité à valider avant de commencer."
          : `Rotation du fichier source, avec les observations disponibles (récupération ${score}/100). L’adaptation éventuelle reste à confirmer.`;
    }
  }
  const components = [];
  if (cardio)
    components.push({
      key: "cardio",
      type: day.type === "recovery" ? "recovery" : "cardio",
      name:
        cardio.format === "walk"
          ? "Marche active"
          : `METCON elliptique · ${{ endu: "Endurance", inter: "Intervalles", hiit: "HIIT", recup: "Récupération" }[cardio.id]}`,
      protocolId: cardio.id,
      minutes: cardio.minutes,
      seconds: cardio.minutes * 60,
      format: cardio.format,
    });
  if (pool) {
    const pp = sourcePool(p, pool.id, pool.level);
    components.push({
      key: "pool",
      type: ["aquahiit", "aquatabata"].includes(pool.id)
        ? "aqua"
        : pool.id === "recovery"
          ? "recovery"
          : "swim",
      name: pp.name,
      protocolId: pool.id,
      level: pool.level,
      seconds: pp.seconds,
      minutes: Math.round(pp.seconds / 60),
      format: "pool",
      levelName: pp.levelName,
      advice: pp.advice,
    });
  }
  return {
    name:
      components.length > 1
        ? "METCON elliptique + piscine"
        : components[0]?.name || "Récupération",
    components,
    transitionSeconds: components.length > 1 ? 300 : 0,
    reason,
    score,
    sourcePrescription: pos.phase.metcon,
  };
}
export function sourceCardioSteps(id, minutes) {
  const total = Math.round(minutes * 60),
    warm = Math.max(120, Math.round((total * 0.15) / 30) * 30),
    cool = Math.max(60, Math.round((total * 0.1) / 30) * 30),
    main = Math.max(60, total - warm - cool);
  const steps = [
    {
      name: "Échauffement elliptique",
      seconds: warm,
      kind: "warmup",
      pattern: "walk",
      segment: "cardio",
    },
  ];
  if (["endu", "recup"].includes(id))
    steps.push({
      name:
        id === "endu"
          ? "Elliptique · allure facile, conversation possible"
          : "Allure très facile",
      seconds: main,
      kind: "work",
      pattern: "walk",
      segment: "cardio",
    });
  else {
    let left = main,
      n = 1;
    const amount = id === "inter" ? 60 : 30;
    while (left > 0) {
      let duration = Math.min(amount, left);
      steps.push({
        name: `${id === "inter" ? "Fractionné soutenu" : "Sprint"} ${n++}`,
        seconds: duration,
        kind: "work",
        pattern: "walk",
        segment: "cardio",
      });
      left -= duration;
      if (left > 0) {
        duration = Math.min(amount, left);
        steps.push({
          name: "Récupération active",
          seconds: duration,
          kind: "rest",
          pattern: "walk",
          segment: "cardio",
        });
        left -= duration;
      }
    }
  }
  steps.push({
    name: "Retour au calme elliptique",
    seconds: cool,
    kind: "cooldown",
    pattern: "breathe",
    segment: "cardio",
  });
  return steps;
}
export function sourceExtraSteps(p, event) {
  const parts = event.components || [],
    steps = [];
  for (const part of parts) {
    if (part.key === "pool") {
      if (steps.length)
        steps.push({
          name: "Transition · boire et rejoindre la piscine",
          seconds: event.transitionSeconds || 300,
          kind: "rest",
          pattern: "breathe",
          segment: "transition",
        });
      steps.push(
        ...sourcePool(p, part.protocolId, part.level).steps.map(
          ([name, seconds]) => ({
            name,
            seconds: Number(seconds),
            kind: /repos|récup|calme/i.test(name) ? "rest" : "work",
            pattern: "swim",
            segment: "pool",
          }),
        ),
      );
    } else if (part.customSteps)
      steps.push(...part.customSteps.map((s) => ({ ...s, segment: part.key })));
    else
      steps.push(
        ...sourceCardioSteps(part.protocolId || "endu", part.minutes || 20),
      );
  }
  return steps;
}
export function eventCategory(s) {
  return s.type === "metcon"
    ? "metcon"
    : s.type === "swim" ||
        (s.components?.some((c) => c.format === "pool") && s.type !== "metcon")
      ? "swim"
      : s.type || "rest";
}
export function eventTags(s) {
  if (s.type === "strength")
    return [{ type: "strength", label: "Musculation" }];
  if (s.type === "metcon")
    return [
      { type: "metcon", label: "METCON" },
      { type: "swim", label: "Piscine" },
    ];
  return [
    {
      type: eventCategory(s),
      label:
        {
          swim: "Piscine",
          cardio: "Cardio",
          recovery: "Récupération",
          aqua: "Aqua HIIT",
          hiit: "HIIT",
          rest: "Repos",
        }[eventCategory(s)] || "Activité",
    },
  ];
}

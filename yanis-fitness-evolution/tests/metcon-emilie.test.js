import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  legacy,
  SOURCE_POOL_PROTOCOLS,
  METCON_PROTOCOLS,
  POOL_PROTOCOLS,
} from "../src/data/library.js";
import {
  AQUA_MOVEMENTS,
  CYCLE_ROTATIONS,
  METCON_PISCINE,
  METCON_AQUATABATA,
} from "../src/data/metcon-emilie.js";
import { stepGifByPattern, stepGifFromName } from "../src/data/visuals-gifs.js";
import { newProfile } from "../src/store/model.js";
import {
  isMetconFormat,
  metconLevel,
  metconMinutes,
  poolRecoveryGate,
  sourceCardioDay,
  sourceCardioDayEligible,
  sourceCardioSlots,
  sourceDay,
  sourceExtra,
  sourcePool,
} from "../src/engine/source-schedule.js";
import { coachFindings, weeklyMetconSuggestion } from "../src/engine/coach.js";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));
const seconds = (level) =>
  level.steps.reduce((sum, [, duration]) => sum + duration, 0);
const namedGif = (name, profile) => {
  const byName = stepGifFromName(name, profile);
  if (byName) return byName;
  const rest = /repos|récup|recup|retour au calme|tabata/i.test(name);
  return stepGifByPattern(rest ? "breathe" : "swim", profile, true);
};

const TOTALS_PISCINE = [1080, 1320, 1620];
const TOTALS_AQUA = [1185, 1475, 1795];
const LEVELS_PISCINE = [
  "NIVEAU 1 · 4 TOURS",
  "NIVEAU 2 · 5 TOURS",
  "NIVEAU 3 · 6 TOURS",
];
const LEVELS_AQUA = [
  "NIVEAU 1 · 3 CYCLES",
  "NIVEAU 2 · 4 CYCLES",
  "NIVEAU 3 · 5 CYCLES",
];

test("les six protocoles source d'Émilie restent inchangés et dans le même ordre", () => {
  const expected = legacy.emilie.POOL_PROTOS.map((protocol) => ({
    ...protocol,
    desc: protocol.desc
      .replace(/zéro risque articulaire/gi, "faible impact articulaire")
      .replace(/zéro impact/gi, "faible impact"),
  }));
  assert.equal(SOURCE_POOL_PROTOCOLS.length, 6);
  assert.deepEqual(SOURCE_POOL_PROTOCOLS, expected);
  assert.equal(POOL_PROTOCOLS.length, 8);
  assert.deepEqual(POOL_PROTOCOLS.slice(0, 6), SOURCE_POOL_PROTOCOLS);
  assert.deepEqual(METCON_PROTOCOLS, [METCON_PISCINE, METCON_AQUATABATA]);
});

test("METCON Piscine : niveaux nommés et durées totales exactes", () => {
  assert.deepEqual(
    METCON_PISCINE.niveaux.map((level) => level.n),
    LEVELS_PISCINE,
  );
  assert.deepEqual(METCON_PISCINE.niveaux.map(seconds), TOTALS_PISCINE);
  assert.deepEqual(
    TOTALS_PISCINE.map((duration) => duration / 60),
    [18, 22, 27],
  );
});

test("METCON Aqua Tabata : niveaux nommés et durées totales exactes", () => {
  assert.deepEqual(
    METCON_AQUATABATA.niveaux.map((level) => level.n),
    LEVELS_AQUA,
  );
  assert.deepEqual(METCON_AQUATABATA.niveaux.map(seconds), TOTALS_AQUA);
  assert.deepEqual(
    TOTALS_AQUA.map((duration) => duration / 60),
    [19.75, 24.583333333333332, 29.916666666666668],
  );
});

test("METCON Piscine : chaque tour garde les cinq mouvements prescrits dans l'ordre", () => {
  for (const [levelIndex, level] of METCON_PISCINE.niveaux.entries()) {
    const tours = levelIndex + 4;
    const body = level.steps.slice(levelIndex === 2 ? 2 : 2, -2);
    assert.equal(body.length, tours * 5);
    for (let tour = 0; tour < tours; tour++) {
      const i = tour * 5;
      assert.deepEqual(body.slice(i, i + 5), [
        [
          `Nager — fractionné ${tour + 1}/${tours}`,
          levelIndex === 0 ? 55 : levelIndex === 1 ? 60 : 70,
        ],
        [
          "Pompes au bord — EFFORT",
          levelIndex === 0 ? 30 : levelIndex === 1 ? 35 : 45,
        ],
        [
          `Nager sprint ${tour + 1}/${tours}`,
          levelIndex === 0 ? 25 : levelIndex === 1 ? 30 : 35,
        ],
        ["Gainage vertical — EFFORT", levelIndex === 0 ? 30 : 25],
        ["Récup courte — marche", levelIndex === 0 ? 25 : 15],
      ]);
    }
  }
});

test("METCON Aqua Tabata : huit mouvements distincts et rotations 0, 3, 6, 1, 4", () => {
  assert.deepEqual(CYCLE_ROTATIONS, [0, 3, 6, 1, 4]);
  assert.deepEqual(AQUA_MOVEMENTS, [
    "Aqua-jogging",
    "Montées de genoux",
    "Ciseaux au bord",
    "Battements de jambes",
    "Déplacements latéraux (4 m)",
    "Pompes au bord",
    "Gainage vertical",
    "Talons-fesses",
  ]);
  for (const [levelIndex, level] of METCON_AQUATABATA.niveaux.entries()) {
    const cycles = levelIndex + 3;
    let cursor = levelIndex === 2 ? 2 : 1;
    for (let cycle = 0; cycle < cycles; cycle++) {
      assert.deepEqual(level.steps[cursor++], [
        `Tabata ${cycle + 1}/${cycles} — en place`,
        5,
      ]);
      const offset = CYCLE_ROTATIONS[cycle];
      const order = [
        ...AQUA_MOVEMENTS.slice(offset),
        ...AQUA_MOVEMENTS.slice(0, offset),
      ];
      const seen = [];
      for (const movement of order) {
        assert.deepEqual(level.steps[cursor++], [`${movement} — EFFORT`, 20]);
        assert.deepEqual(level.steps[cursor++], ["Repos", 10]);
        seen.push(movement);
      }
      assert.equal(new Set(seen).size, 8);
      if (cycle < cycles - 1)
        assert.deepEqual(level.steps[cursor++], [
          "Récup entre tabatas",
          [60, 45, 30][levelIndex],
        ]);
    }
    assert.deepEqual(
      level.steps.slice(cursor),
      level.cooldown || level.steps.slice(-1),
    );
  }
});

test("chaque étape METCON dispose d'un GIF humain existant pour les profils femme et homme", () => {
  for (const protocol of METCON_PROTOCOLS)
    for (const level of protocol.niveaux)
      for (const [name] of level.steps) {
        const woman = namedGif(name, "emilie");
        const man = namedGif(name, "elite");
        assert.ok(
          woman?.endsWith(".gif"),
          `${protocol.id} · ${name} sans GIF femme`,
        );
        assert.ok(
          man?.endsWith(".gif"),
          `${protocol.id} · ${name} sans GIF homme`,
        );
        assert.ok(
          existsSync(publicDir + woman),
          `fichier femme absent : ${woman}`,
        );
        assert.ok(existsSync(publicDir + man), `fichier homme absent : ${man}`);
        assert.notEqual(
          woman,
          man,
          `${protocol.id} · ${name} sans variantes femme/homme distinctes`,
        );
      }
});

test("sourcePool combine les deux METCON pour Émilie et laisse le catalogue de Yanis intact", () => {
  const emiliePool = sourcePool({ id: "emilie" }, "metcon-piscine", 0);
  const emilieTabata = sourcePool({ id: "emilie" }, "metcon-aquatabata", 2);
  assert.equal(emiliePool.name, "METCON Piscine");
  assert.equal(emiliePool.seconds, 1080);
  assert.equal(emilieTabata.name, "METCON Aqua Tabata");
  assert.equal(emilieTabata.seconds, 1795);
  assert.deepEqual(
    sourcePool({ id: "elite" }, "endurance", 0).steps,
    legacy.elite.POOL_PROTOS.find((protocol) => protocol.id === "endurance")
      .niveaux[0].steps,
  );
  assert.deepEqual(sourcePool({ id: "elite" }, "metcon-piscine", 0).steps, []);
});

test("le choix cardio sur sept jours respecte la règle source, Auto et le niveau mémorisé", () => {
  const p = newProfile("emilie");
  p.user.startDate = "2026-09-28";
  p.user.frequency = 4;
  p.preferences.metconLevel = 1;
  p.preferences.cardioChoices = {};
  const slots = sourceCardioSlots(p, "2026-10-01");
  assert.equal(slots.length, 7);
  assert.deepEqual(
    slots.filter((slot) => slot.eligible).map((slot) => slot.date),
    ["2026-09-30", "2026-10-02"],
  );
  assert.equal(sourceCardioDayEligible(p, "2026-09-28"), false);
  assert.equal(metconLevel(p), 1);
  assert.equal(metconMinutes("metcon-piscine", metconLevel(p)), 22);
  assert.equal(metconMinutes("metcon-aquatabata", metconLevel(p)), 25);
  assert.equal(isMetconFormat("metcon-piscine"), true);
  assert.equal(isMetconFormat("piscine"), false);

  const date = "2026-09-30";
  assert.equal(sourceCardioDay(p, date, 3).format, "elliptique");
  p.preferences.cardioChoices[date] = "metcon-piscine";
  const day = sourceDay(p, date);
  assert.equal(day.type, "swim");
  assert.equal(day.name, "METCON Piscine");
  assert.equal(day.cardio.minutes, 22);
  const extra = sourceExtra(p, day, { planning: true });
  assert.equal(extra.components[0].protocolId, "metcon-piscine");
  assert.equal(extra.components[0].level, 1);
  assert.equal(extra.components[0].seconds, 1320);

  p.preferences.cardioChoices[date] = "metcon-aquatabata";
  const aquaDay = sourceDay(p, date);
  assert.equal(aquaDay.type, "swim");
  assert.equal(aquaDay.cardio.minutes, 25);
  assert.equal(
    sourceExtra(p, aquaDay, { planning: true }).components[0].type,
    "aqua",
  );
  delete p.preferences.cardioChoices[date];
  assert.equal(sourceCardioDay(p, date, 3).format, "elliptique");
});

test("récupération douce avant METCON, alternatives en une action et coach au plus une proposition hebdomadaire", () => {
  const p = newProfile("emilie");
  p.user.startDate = "2026-09-28";
  p.plan.sessions = [];
  p.activities = [];
  p.sessions = [];
  p.workout = null;
  p.checkIns = {};
  p.preferences.cardioChoices = {};

  assert.deepEqual(poolRecoveryGate("metcon-piscine", 44), {
    soft: true,
    blocked: true,
  });
  assert.deepEqual(poolRecoveryGate("metcon-aquatabata", 45), {
    soft: false,
    blocked: false,
  });
  assert.deepEqual(poolRecoveryGate("interval", 44), {
    soft: false,
    blocked: true,
  });
  assert.deepEqual(poolRecoveryGate("recovery", 44), {
    soft: false,
    blocked: false,
  });
  assert.equal(poolRecoveryGate("metcon-piscine", 44, true).blocked, false);

  const first = weeklyMetconSuggestion(p, "2026-09-30");
  assert.equal(first.format, "metcon-piscine");
  assert.equal(weeklyMetconSuggestion(p, "2026-10-01").key, first.key);
  const finding = coachFindings(p, "2026-10-01").filter(
    (item) => item.title === "METCON de la semaine",
  );
  assert.equal(finding.length, 1);
  assert.equal(finding[0].severity, "low");
  assert.deepEqual(finding[0].action, { type: "navigate", page: "cardio" });

  p.preferences.cardioChoices["2026-09-30"] = "metcon-piscine";
  assert.equal(
    weeklyMetconSuggestion(p, "2026-10-05").format,
    "metcon-aquatabata",
  );
  p.preferences.cardioChoices["2026-10-07"] = "metcon-aquatabata";
  assert.equal(weeklyMetconSuggestion(p, "2026-10-05"), null);
  delete p.preferences.cardioChoices["2026-10-07"];
  p.activities.push({
    date: "2026-10-06",
    type: "swim",
    protocolId: "metcon-piscine",
  });
  assert.equal(weeklyMetconSuggestion(p, "2026-10-05"), null);
  p.activities = [];
  p.plan.sessions.push({
    date: "2026-10-06",
    status: "planned",
    name: "METCON Piscine",
  });
  assert.equal(weeklyMetconSuggestion(p, "2026-10-05"), null);
  p.plan.sessions = [];

  p.checkIns["2026-10-06"] = {
    sleep: 3,
    quality: 1,
    energy: 1,
    fatigue: 5,
    stress: 5,
    soreness: 5,
    motivation: 1,
  };
  assert.equal(weeklyMetconSuggestion(p, "2026-10-06"), null);
  assert.equal(
    coachFindings(p, "2026-10-06").some(
      (item) => item.title === "METCON de la semaine",
    ),
    false,
  );
});

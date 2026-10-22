import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  legacy,
  POOL_PROTOCOLS,
  SOURCE_POOL_PROTOCOLS,
  METCON_PROTOCOLS,
  OPTIONAL_POOL_PROTOCOLS,
} from "../src/data/library.js";
import {
  AQUA_MOVEMENTS,
  METCON_PROTOCOLS as VALIDATED_METCONS,
} from "../src/data/metcon-emilie.js";
import { optionalPoolStepGif } from "../src/data/pool-diversity.js";
import { newProfile } from "../src/store/model.js";
import {
  isMetconFormat,
  sourceCardioDay,
  sourceDay,
  sourcePool,
  sourcePoolProtocol,
} from "../src/engine/source-schedule.js";
import { addDays } from "../src/engine/utils.js";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));
const seconds = (level) =>
  level.steps.reduce((total, [, duration]) => total + duration, 0);
const OPTIONAL_IDS = ["pyramide-piscine", "circuit-aqua-variable"];

test("les six protocoles source et les deux METCON validés restent inchangés", () => {
  const expectedSource = legacy.emilie.POOL_PROTOS.map((protocol) => ({
    ...protocol,
    desc: protocol.desc
      .replace(/zéro risque articulaire/gi, "faible impact articulaire")
      .replace(/zéro impact/gi, "faible impact"),
  }));
  assert.deepEqual(SOURCE_POOL_PROTOCOLS, expectedSource);
  assert.equal(SOURCE_POOL_PROTOCOLS.length, 6);
  assert.equal(POOL_PROTOCOLS.length, 8);
  assert.deepEqual(POOL_PROTOCOLS.slice(0, 6), SOURCE_POOL_PROTOCOLS);
  assert.deepEqual(METCON_PROTOCOLS, VALIDATED_METCONS);
  assert.deepEqual(
    METCON_PROTOCOLS.map((protocol) => protocol.id),
    ["metcon-piscine", "metcon-aquatabata"],
  );
  assert.deepEqual(
    OPTIONAL_POOL_PROTOCOLS.map((protocol) => protocol.id),
    OPTIONAL_IDS,
  );
  assert.ok(
    OPTIONAL_POOL_PROTOCOLS.every(
      (protocol) =>
        !POOL_PROTOCOLS.some((existing) => existing.id === protocol.id),
    ),
    "les nouveaux formats restent hors du catalogue source et METCON",
  );
});

test("les deux nouvelles séances ont trois niveaux progressifs aux durées vérifiées", () => {
  const [pyramid, circuit] = OPTIONAL_POOL_PROTOCOLS;
  assert.equal(pyramid.nom, "Pyramide piscine");
  assert.deepEqual(pyramid.niveaux.map(seconds), [1080, 1440, 1800]);
  assert.deepEqual(
    pyramid.niveaux.map((level) => level.n),
    [
      "NIVEAU 1 · 2 PYRAMIDES",
      "NIVEAU 2 · 2 PYRAMIDES",
      "NIVEAU 3 · 2 PYRAMIDES",
    ],
  );
  assert.equal(circuit.nom, "Circuit aqua à intervalles variables");
  assert.deepEqual(circuit.niveaux.map(seconds), [1260, 1620, 1850]);
  assert.deepEqual(
    circuit.niveaux.map((level) => level.n),
    ["NIVEAU 1 · 3 TOURS", "NIVEAU 2 · 4 TOURS", "NIVEAU 3 · 4 TOURS"],
  );
});

test("la pyramide garde sa montée puis sa descente, avec récupérations actives", () => {
  const [pyramid] = OPTIONAL_POOL_PROTOCOLS;
  const expectedWaves = [
    [
      [30, 45, 60, 45, 30],
      [35, 50, 65, 50, 35],
    ],
    [
      [30, 45, 60, 75, 60, 45, 30],
      [35, 50, 65, 80, 65, 50, 35],
    ],
    [
      [30, 45, 60, 75, 90, 75, 60, 45, 30],
      [35, 50, 65, 80, 95, 80, 65, 50, 35],
    ],
  ];
  for (const [levelIndex, level] of pyramid.niveaux.entries()) {
    for (const wave of [1, 2]) {
      const steps = level.steps.filter(([name]) =>
        name.startsWith(`Nage en pyramide ${wave}/2`),
      );
      assert.deepEqual(
        steps.map(([, duration]) => duration),
        expectedWaves[levelIndex][wave - 1],
      );
    }
    assert.equal(
      level.steps.filter(([name]) => name === "Récupération — marche aquatique")
        .length,
      levelIndex === 0 ? 8 : levelIndex === 1 ? 12 : 16,
    );
    assert.ok(
      level.steps.every(
        ([, duration]) => Number.isInteger(duration) && duration > 0,
      ),
    );
  }
});

test("le circuit varie les durées et l'ordre, en ne reprenant que des mouvements aqua existants", () => {
  const circuit = OPTIONAL_POOL_PROTOCOLS[1];
  const existingMovements = new Set(
    AQUA_MOVEMENTS.filter((movement) => movement !== "Pompes au bord"),
  );
  for (const [levelIndex, level] of circuit.niveaux.entries()) {
    const starts = level.steps.filter(([name]) =>
      name.startsWith("Tour aqua "),
    );
    assert.equal(starts.length, [3, 4, 4][levelIndex]);
    const orders = [];
    for (const [tourIndex, [marker]] of starts.entries()) {
      const [, tourNumber, tourCount] = marker.match(/Tour aqua (\d+)\/(\d+)/);
      assert.equal(Number(tourNumber), tourIndex + 1);
      assert.equal(Number(tourCount), starts.length);
      const startIndex = level.steps.findIndex(([name]) => name === marker);
      const endIndex = level.steps.findIndex(
        ([name], index) => index > startIndex && name.startsWith("Tour aqua "),
      );
      const tourSteps = level.steps.slice(
        startIndex + 1,
        endIndex < 0 ? level.steps.length - 1 : endIndex,
      );
      const efforts = tourSteps.filter(([name]) =>
        name.includes(" — effort variable "),
      );
      const movements = efforts.map(([name]) =>
        name.replace(/ — effort variable \d+$/, ""),
      );
      assert.equal(efforts.length, 6);
      assert.equal(new Set(movements).size, 6);
      assert.ok(movements.every((movement) => existingMovements.has(movement)));
      assert.ok(new Set(efforts.map(([, duration]) => duration)).size > 1);
      orders.push(movements);
    }
    for (let index = 1; index < orders.length; index++)
      assert.notDeepEqual(orders[index], orders[index - 1]);
  }
});

test("les deux profils peuvent consulter et lancer les niveaux sans modifier le planning source", () => {
  for (const profileId of ["elite", "emilie"]) {
    const profile = newProfile(profileId);
    profile.user.startDate = "2026-09-28";
    profile.preferences.cardioChoices = {};
    for (const protocol of OPTIONAL_POOL_PROTOCOLS)
      for (const [levelIndex, level] of protocol.niveaux.entries()) {
        const resolved = sourcePool(profile, protocol.id, levelIndex);
        assert.equal(resolved.name, protocol.nom);
        assert.equal(resolved.levelName, level.n);
        assert.deepEqual(resolved.steps, level.steps);
        assert.equal(resolved.seconds, seconds(level));
      }

    const automaticPool = sourcePoolProtocol(profile, "2026-09-30", {
      planning: true,
    });
    assert.ok(!OPTIONAL_IDS.includes(automaticPool.id));
    for (let day = 0; day < 7; day++) {
      const scheduled = sourceDay(profile, addDays("2026-09-28", day));
      assert.ok(
        !OPTIONAL_POOL_PROTOCOLS.some(
          (protocol) => protocol.nom === scheduled.name,
        ),
      );
    }

    for (const protocol of OPTIONAL_POOL_PROTOCOLS) {
      assert.equal(isMetconFormat(protocol.id), false);
      profile.preferences.cardioChoices["2026-09-30"] = protocol.id;
      assert.equal(sourceCardioDay(profile, "2026-09-30", 3).format, "repos");
    }
  }
});

test("chaque étape optionnelle résout un GIF humain existant pour les deux profils", () => {
  for (const protocol of OPTIONAL_POOL_PROTOCOLS)
    for (const level of protocol.niveaux)
      for (const [name] of level.steps)
        for (const profile of ["elite", "emilie"]) {
          const pattern = /repos|respiration|r[ée]cup/i.test(name)
            ? "breathe"
            : "swim";
          const image = optionalPoolStepGif(name, profile, pattern);
          assert.ok(image, `${protocol.id} · ${name} (${profile}) sans GIF`);
          assert.ok(
            existsSync(publicDir + image),
            `fichier manquant : ${image}`,
          );
        }

  const aquaJogging = OPTIONAL_POOL_PROTOCOLS[1].niveaux[0].steps.find(
    ([name]) => name.startsWith("Aqua-jogging"),
  )[0];
  assert.notEqual(
    optionalPoolStepGif(aquaJogging, "elite", "swim"),
    optionalPoolStepGif(aquaJogging, "emilie", "swim"),
    "le même mouvement garde une variante homme/femme selon le profil",
  );
});

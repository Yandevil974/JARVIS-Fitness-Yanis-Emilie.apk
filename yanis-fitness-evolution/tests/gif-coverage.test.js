// Non-régression : aucun exercice, aucun chrono (piscine, aqua, metcon,
// étirements, échauffement, elliptique, HIIT/tabata) ne peut rester sans
// humain animé (GIF), et chaque visuel référencé existe dans public/media.
// Défaut utilisateur du 02/10/2026 : « quand je lance le chrono il n'y a pas
// le gif ». Ce test verrouille la correction livrée dans v1.5.1-chrono-gifs-v3.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  EXERCISES,
  RECOVERY_EXERCISES,
  POOL_PROTOCOLS,
  POOL_GUIDES,
  stretchImage,
} from "../src/data/library.js";
import { demonstrationFor } from "../src/engine/demo-match.js";
import { stepGuide } from "../src/data/visuals.js";
import {
  stepGif,
  stepGifFromName,
  stepGifByPattern,
  STRETCH_KEY_BY_NAME,
  movementGif,
} from "../src/data/visuals-gifs.js";
import { intervalSteps } from "../src/engine/timer.js";
import {
  sourceCardioSteps,
  sourceExtraSteps,
  sourcePool,
} from "../src/engine/source-schedule.js";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));
const fileOk = (src) => !!src && existsSync(publicDir + src);

// Même chaîne de résolution que TimerModal (ProtocolModals.jsx).
function resolutionChrono(step, profil) {
  const guide = stepGuide(step.name, step.segment, POOL_GUIDES);
  return (
    step.img ||
    guide?.img ||
    stepGif(STRETCH_KEY_BY_NAME[step.name], profil) ||
    stepGifFromName(step.name, profil) ||
    EXERCISES.find((e) => e.name === step.name)?.gif ||
    stepGifByPattern(step.pattern, profil)
  );
}

test("musculation : chaque exercice a une démonstration humaine (GIF existant)", () => {
  assert.equal(EXERCISES.length, 209);
  for (const ex of EXERCISES) {
    const d = demonstrationFor(ex);
    assert.ok(d, `aucune démo pour « ${ex.name} »`);
    assert.ok(fileOk(d.path), `fichier manquant pour « ${ex.name} » : ${d.path}`);
  }
});

test("étirements : visuel humain pour chaque position et chaque profil", () => {
  for (const profil of ["elite", "emilie"])
    for (const ex of RECOVERY_EXERCISES) {
      const img = stretchImage(ex, profil);
      assert.ok(img, `étirement sans visuel : ${ex.name} (${profil})`);
      assert.ok(fileOk(img), `fichier manquant : ${img}`);
    }
});

test("chronos piscine/aqua : toutes les étapes de tous les niveaux résolues", () => {
  for (const pr of POOL_PROTOCOLS)
    for (const niveau of pr.niveaux)
      for (const [name, seconds] of niveau.steps) {
        const step = {
          name,
          seconds,
          pattern: /repos|respiration|recup/i.test(name) ? "breathe" : "swim",
          segment: "pool",
        };
        for (const profil of ["elite", "emilie"]) {
          const img = resolutionChrono(step, profil);
          assert.ok(img, `${pr.id} · ${name} (${profil}) sans GIF`);
          assert.ok(fileOk(img), `fichier manquant : ${img}`);
        }
      }
});

test("mouvements HIIT / aqua tabata : GIF homme et femme", () => {
  const noms = [
    "Burpees", "Burpees simplifiés", "Squats", "Squats doux", "Squats sautés",
    "Squats sumo", "Jumping jacks", "High knees", "Montées de genoux",
    "Montées sur mollets", "Chaise au mur", "Chaise douce", "Corde invisible",
    "Dips au bord", "Fentes alternées", "Mountain climbers lents",
    "Oiseau-chien", "Patineurs", "Planche latérale G", "Planche latérale D",
    "Pompes au mur", "Ponts fessiers", "Repos actif", "Russian twist",
    "Superman",
  ];
  for (const nom of noms)
    for (const profil of ["elite", "emilie"]) {
      const g = movementGif(nom, profil);
      assert.ok(g, `mouvement sans GIF : ${nom} (${profil})`);
      assert.ok(fileOk(g), `fichier manquant : ${g}`);
    }
});

test("chronos metcon : elliptique seul et combo elliptique + piscine", () => {
  for (const id of ["endu", "inter", "sprint", "recup"])
    for (const step of sourceCardioSteps(id, 20))
      for (const profil of ["elite", "emilie"]) {
        const img = resolutionChrono(step, profil);
        assert.ok(img, `metcon ${id} · ${step.name} (${profil}) sans GIF`);
        assert.ok(fileOk(img), `fichier manquant : ${img}`);
      }
  for (const pr of POOL_PROTOCOLS) {
    const event = {
      components: [
        { key: "cardio", protocolId: "inter", minutes: 15 },
        { key: "pool", protocolId: pr.id, level: 0 },
      ],
      transitionSeconds: 300,
    };
    for (const step of sourceExtraSteps({ id: "elite" }, event))
      for (const profil of ["elite", "emilie"]) {
        const img = resolutionChrono(step, profil);
        assert.ok(img, `combo ${pr.id} · ${step.name} (${profil}) sans GIF`);
        assert.ok(fileOk(img), `fichier manquant : ${img}`);
      }
  }
});

test("intervalSteps (tabata libre) : chaque étape a un GIF", () => {
  for (const cfg of [
    { aqua: true, movements: ["Squats"] },
    { aqua: false, movements: ["Marche rapide"] },
  ])
    for (const step of intervalSteps(cfg))
      for (const profil of ["elite", "emilie"]) {
        const img = resolutionChrono(step, profil);
        assert.ok(img, `${step.name} (${profil}) sans GIF`);
        assert.ok(fileOk(img), `fichier manquant : ${img}`);
      }
});

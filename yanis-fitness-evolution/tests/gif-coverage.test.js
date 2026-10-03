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
import { GIF_OVERRIDES } from "../src/data/gif-overrides.js";
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
  const pool =
    step.segment === "pool" ||
    step.metaType === "swim" ||
    step.metaType === "aqua";
  return (
    step.img ||
    guide?.img ||
    stepGif(STRETCH_KEY_BY_NAME[step.name], profil) ||
    stepGifFromName(step.name, profil) ||
    EXERCISES.find((e) => e.name === step.name)?.gif ||
    stepGifByPattern(step.pattern, profil, pool)
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

test("03/10 : la bibliothèque n'affiche plus aucune illustration anatomique", () => {
  // Chaque GIF de la bibliothèque doit venir du corpus humain livré
  // (GIF_OVERRIDES) ; les 74 visuels legacy dessinés ont été remplacés.
  const humains = new Set(Object.values(GIF_OVERRIDES));
  for (const ex of EXERCISES) {
    assert.ok(ex.gif, `exercice sans GIF : ${ex.name}`);
    assert.ok(
      humains.has(ex.gif),
      `« ${ex.name} » affiche encore un visuel hors corpus humain : ${ex.gif}`,
    );
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

test("03/10 : une pause en piscine montre un humain DANS l'eau (jamais le sol de salle)", () => {
  const ABS_SALLE = "/media/54a3ca1547a3a613.gif"; // stretch-respiration (salle)
  for (const profil of ["elite", "emilie"]) {
    const img = resolutionChrono(
      { name: "Repos", seconds: 30, pattern: "breathe", metaType: "aqua" },
      profil,
    );
    assert.ok(img, "Repos piscine sans GIF");
    assert.notEqual(img, ABS_SALLE, "Repos piscine : visuel de salle interdit");
    assert.ok(
      /60207d563d74fd85|333e9e6ac33e22bb/.test(img),
      `Repos piscine : attendu une récupération dans l'eau, obtenu ${img}`,
    );
  }
  // Hors bassin, le repli « respirations » reste celui validé en v1.6.0.
  assert.equal(
    resolutionChrono({ name: "Repos", seconds: 30, pattern: "breathe" }, "elite"),
    ABS_SALLE,
  );
});

test("03/10 : le crawl « Nage douce » n'utilise plus les GIF à personne retournée", () => {
  // Les anciens visuels alternaient une image horizontale et une image où la
  // personne se redresse à la verticale : effet « à l'envers » signalé.
  const ANCIENS = [
    "/media/e7699039b93fdb20.gif",
    "/media/3d44d275ca25d146.gif",
    "/media/3d2c2e5b9e90f3b7.gif",
  ];
  for (const g of POOL_GUIDES)
    assert.ok(!ANCIENS.includes(g.img), `guide ${g.t} encore sur un GIF retourné`);
  for (const profil of ["elite", "emilie"]) {
    const img = resolutionChrono(
      { name: "Échauffement — nage douce", seconds: 120, pattern: "swim", segment: "pool" },
      profil,
    );
    assert.ok(!ANCIENS.includes(img), `nage douce encore sur un GIF retourné (${img})`);
    assert.ok(fileOk(img), `fichier manquant : ${img}`);
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

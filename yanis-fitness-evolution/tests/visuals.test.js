import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXERCISE_MAP, RECOVERY_EXERCISES } from "../src/data/library.js";
import {
  POSES,
  STRETCH_TARGETS,
  STRETCH_BY_NAME,
  EXERCISE_MOTIONS,
  motionFor,
  stretchKey,
} from "../src/engine/human-motion.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsx = readFileSync(join(ROOT, "src/components/HumanAnim.jsx"), "utf8");
const fig = readFileSync(join(ROOT, "scripts/visuels/figure.mjs"), "utf8");

// Tous les rigs utilisés par la refonte visuels (2026-09-25). Chaque rig doit
// être géré par HumanAnim.jsx (runtime) ET figure.mjs (previews).
const RIGS = [
  "stand", "stand-side", "wide", "sit-machine", "machine-seat", "hang",
  "floor-back", "bench", "figure4", "prone-machine", "plank",
  "kneel-rollout", "quadruped", "child", "pool",
  "doorway", "wall", "cobra", "sit-floor", "front",
];

// Tous les paramètres de pose (clés de a/b) utilisés. Chacun doit être lu
// par les deux moteurs de rendu (sinon : spec silencieusement ignorée).
const PARAMS = [
  "torso", "hip", "knee", "shoulder", "elbow", "neck", "chest", "pelvisY",
  "side", "toeLift", "stance", "grab", "support", "backLeg", "anti",
  "bar", "cable", "band", "db", "wheel",
  "step", "heelDrop", "lift2", "kneel", "bent2", "cross2", "lungeBack",
  "legUp", "legStraight2",
  "crouch", "lean", "legL", "legR", "legTibL", "legTibR",
  "armL", "armR", "armBendL", "armBendR", "legGhost",
];

function allMotions() {
  const out = [];
  for (const [name, spec] of Object.entries(POSES)) out.push([`POSES.${name}`, spec]);
  for (const [name, spec] of Object.values(STRETCH_BY_NAME).entries())
    out.push([`STRETCH_BY_NAME[${name}]`, spec]);
  for (const [id, spec] of Object.entries(EXERCISE_MOTIONS)) out.push([`EXERCISE_MOTIONS.${id}`, spec]);
  return out;
}

test("visuels : chaque étirement nommé résout vers sa pose dédiée", () => {
  assert.ok(RECOVERY_EXERCISES.length >= 29);
  for (const e of RECOVERY_EXERCISES) {
    const key = stretchKey(e.name);
    assert.ok(
      STRETCH_BY_NAME[key],
      `étirement sans pose nommée : "${e.name}" (clé: ${key})`,
    );
    const spec = motionFor(e);
    assert.equal(spec.source, "creée-étirement-nommé", e.name);
  }
});

test("visuels : repli par muscle pour tout étirement futur", () => {
  for (const m of Object.keys(STRETCH_TARGETS)) {
    const spec = motionFor({ id: "x", name: "étirement inconnu", pattern: "stretch", muscle: m });
    assert.equal(spec.source, "creée-étirement");
    assert.ok(spec.rig && spec.a && spec.b, m);
  }
});

test("visuels : toute motion a rig/a/b valides et un rig connu", () => {
  for (const [label, spec] of allMotions()) {
    const rig = spec.rig || "stand";
    assert.ok(RIGS.includes(rig), `${label} : rig inconnu "${rig}"`);
    assert.ok(spec.a && spec.b, `${label} : a/b manquants`);
    assert.deepEqual(
      Object.keys(spec.a).sort(), Object.keys(spec.b).sort(),
      `${label} : clés a/b différentes`,
    );
  }
});

test("visuels : chaque paramètre de pose est géré par les 2 rendus", () => {
  const used = new Set();
  for (const [, spec] of allMotions())
    for (const k of Object.keys(spec.a)) used.add(k);
  for (const k of used) {
    assert.ok(PARAMS.includes(k), `paramètre "${k}" non référencé dans le test`);
    assert.ok(jsx.includes(`p.${k}`), `HumanAnim.jsx ignore "${k}"`);
    assert.ok(fig.includes(`p.${k}`), `figure.mjs ignore "${k}"`);
  }
  for (const r of RIGS) {
    assert.ok(jsx.includes(`"${r}"`), `HumanAnim.jsx ignore le rig "${r}"`);
    assert.ok(fig.includes(`"${r}"`), `figure.mjs ignore le rig "${r}"`);
  }
});

test("visuels : phase E (motions explicites prioritaires)", () => {
  const expected = {
    "wood-chop-poulie-haute": "stand",
    "ab-wheel-roulette": "kneel-rollout",
    "extensions-triceps-pullover-barre-ez": "bench",
    "extensions-triceps-barre-ez-pullover": "bench",
  };
  for (const [id, rig] of Object.entries(expected)) {
    const e = EXERCISE_MAP[id];
    assert.ok(e, `exercice manquant : ${id}`);
    const spec = motionFor(e);
    assert.equal(spec.source, "creée-exercice", id);
    assert.equal(spec.rig, rig, id);
  }
});

test("visuels : aucun exercice ne tombe sur le repli générique inconnu", () => {
  // Le repli mobility n'est acceptable que pour les patterns génériques.
  const allowed = new Set(["static", "mobility", undefined]);
  const bad = [];
  for (const e of Object.values(EXERCISE_MAP)) {
    if (e.pattern === "stretch") continue;
    const spec = motionFor(e);
    if (spec.source === "creée-pattern" && !POSES[e.pattern] && !allowed.has(e.pattern))
      bad.push(`${e.id} (pattern=${e.pattern})`);
  }
  assert.deepEqual(bad, []);
});

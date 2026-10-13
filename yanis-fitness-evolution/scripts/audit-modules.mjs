// ============================================================================
//  audit-modules.mjs — ÉTAT RÉEL des 9 modules, MESURÉ (pas estimé)
//  Ordre demandé par l'utilisateur :
//    échauffement · étirement · musculation · fractionné · chronométrée ·
//    elliptique · piscine · tabata · aqua
//
//  Pour CHAQUE module, la question posée est toujours la même :
//    « chaque étape a-t-elle SON visuel ET son texte ? »
//  Un module est VERT si 100 % de ses étapes résolvent un visuel + un texte.
// ============================================================================
import legacy from "../src/data/legacy.json" with { type: "json" };
import { EXERCISES } from "../src/data/library.js";
import { warmup } from "../src/engine/fitness.js";
import {
  STRETCH_IMAGES,
  POOL_STEP_IMAGES,
  WARMUP_IMAGES,
  CARDIO_STEPS,
  stepGuide,
} from "../src/data/visuals.js";

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const elite = legacy.elite;
const emilie = legacy.emilie;
const poolGuides = elite.POOL_GUIDES || [];
// L'application lit les guides piscine d'ÉMILIE et résout l'image ainsi :
//   img = g.img || POOL_STEP_IMAGES[g.t]        (src/data/library.js)
const POOL_G = (emilie.POOL_GUIDES || []).map((g) => ({
  ...g,
  img: g.img || POOL_STEP_IMAGES[g.t] || null,
}));

const L = [];
const say = (s = "") => L.push(s);
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 100);
const bar = (a, b) => (b === 0 ? "n/a" : `${pct(a, b)}%`);

// ------------------------------------------------------------------ moteur
function etapes(nomModule, listes) {
  // listes : [{ nom, texte, visuel, duree? }]
  const total = listes.length;
  const sansVisuel = listes.filter((e) => !e.visuel);
  const sansTexte = listes.filter((e) => !e.texte);
  const vert = total > 0 && sansVisuel.length === 0 && sansTexte.length === 0;
  say(`  ${vert ? "✅" : "🔴"} ${nomModule.padEnd(26)} ${String(total).padStart(3)} étapes` +
      ` · visuel ${bar(total - sansVisuel.length, total).padStart(4)}` +
      ` · texte ${bar(total - sansTexte.length, total).padStart(4)}`);
  if (sansVisuel.length)
    say(`      SANS VISUEL (${sansVisuel.length}) : ` +
        sansVisuel.slice(0, 4).map((e) => `« ${e.nom} »`).join(", ") +
        (sansVisuel.length > 4 ? ` … +${sansVisuel.length - 4}` : ""));
  return { total, sansVisuel: sansVisuel.length, sansTexte: sansTexte.length };
}

say("=== AUDIT DES 9 MODULES — " + new Date().toISOString().slice(0, 10) + " ===");
say("");

// --------------------------------------------------------- 1. ÉCHAUFFEMENT
{
  say("1. ÉCHAUFFEMENT");
  // la liste d'étapes est GENÉRÉE par warmup() dans src/engine/fitness.js :
  // 5 étapes (mise en route, mobilité, activation, approche 1/2/3), images posées
  // en dur depuis WARMUP_IMAGES. On rejoue la fonction avec un profil minimal.
  const session = { exercises: [{ exerciseId: EXERCISES[0]?.id, targetLoad: 60 }] };
  const p = { user: { increment: 2.5 }, profile: { level: "INTERMEDIATE" } };
  let steps = [];
  try { steps = warmup(p, session) || []; } catch { steps = []; }
  if (!steps.length) {
    steps = [
      { name: "Mise en route", seconds: 180, img: WARMUP_IMAGES.route, instruction: "Marche ou vélo très facile." },
      { name: "Mobilité", seconds: 60, img: WARMUP_IMAGES.mobilite, instruction: "Mobilisez sans forcer." },
      { name: "Activation", seconds: 60, img: WARMUP_IMAGES.mobilite, instruction: "Activation ciblée." },
      { name: "Approche 1", seconds: 60, img: WARMUP_IMAGES.approche, instruction: "10 reps faciles." },
      { name: "Approche 2", seconds: 60, img: WARMUP_IMAGES.approche, instruction: "6 reps faciles." },
      { name: "Approche 3", seconds: 60, img: WARMUP_IMAGES.approche, instruction: "3 reps faciles." },
    ];
    say("      (warmup() non exécutable ici : repli sur la lecture du code)");
  }
  etapes("ECHAUFFEMENT (warmup())", steps.map((s) => ({
    nom: s.name, texte: s.instruction || "", visuel: !!s.img,
  })));
  const guide = elite.ECHAUFFEMENT || {};
  say(`      guide texte statique : ${(guide.etapes || []).length} étapes · ` +
      `activations : ${["ACTIVATION_JAMBES", "ACTIVATION_HAUT", "ACTIVATION_BRAS"]
        .filter((k) => elite[k]).length} blocs (texte seul, pas d'image attendue)`);
  say(`      WARMUP_IMAGES : ${Object.keys(WARMUP_IMAGES).length} visuels ` +
      `(${Object.keys(WARMUP_IMAGES).join(", ")})`);
  say("");
}

// ------------------------------------------------------------ 2. ÉTIREMENT
{
  const parMuscle = elite.ETIREMENTS_PAR_MUSCLE || emilie.ETIREMENTS_PAR_MUSCLE || {};
  const list = [];
  for (const [m, bloc] of Object.entries(parMuscle)) {
    for (const ex of bloc.exos || []) {
      const nom = ex[1];
      list.push({
        nom: `${m} : ${nom}`,
        texte: ex[3] || "",
        visuel: Object.prototype.hasOwnProperty.call(STRETCH_IMAGES, nom),
      });
    }
  }
  say("2. ÉTIREMENT");
  etapes("ETIREMENTS_PAR_MUSCLE", list);
  say(`      STRETCH_IMAGES : ${Object.keys(STRETCH_IMAGES).length} visuels disponibles`);
  say("");
}

// ---------------------------------------------------------- 3. MUSCULATION
{
  // résolution reproduite de src/data/library.js : guides[norm(nom)] puis ref
  const guides = {};
  for (const source of [elite.MUSCU_GUIDES || {}, emilie.MUSCU_GUIDES || {}])
    for (const [k, v] of Object.entries(source)) guides[norm(k)] ??= v;
  const rows = new Map();
  for (const [source, data] of Object.entries(legacy))
    for (const phase of Object.values(data.PROGRAM || {}))
      for (const s of Object.values(phase.sessions || {}))
        for (const row of s.exos || []) {
          const n = norm(row[0]);
          if (!rows.has(n)) rows.set(n, row);
        }
  const list = [...rows.values()].map((row) => {
    const n = norm(row[0]);
    let g = guides[n];
    if (g?.ref) g = guides[norm(g.ref)] || guides[g.ref] || g;
    return { nom: row[0], texte: g ? (g.etapes || g.conseil || "oui") : "", visuel: !!g?.img };
  });
  say("3. MUSCULATION");
  const r = etapes("EXERCICES (tous profils)", list);
  say(`      → ${r.sansVisuel} exercices s'affichent SANS animation (sur ${r.total})`);
  say("");
}

// ---------------------------------------------- 4/6. FRACTIONNÉ + ELLIPTIQUE
{
  say("4+6. FRACTIONNÉ / ELLIPTIQUE (étapes cardio)");
  const list = CARDIO_STEPS.map((s) => ({
    nom: s.t,
    texte: (s.h || []).join(" "),
    visuel: !!s.img,
  }));
  etapes("CARDIO_STEPS", list);
  const types = [...(elite.CARDIO_TYPES || []).map((t) => t.nom),
                 ...Object.values(emilie.CARDIO_TYPES || {}).map((t) => t.n)];
  say(`      types cardio proposés : ${types.join(" · ")}`);
  say("");
}

// ------------------------------------------------- 5. CHRONOMÉTRÉE (durées)
{
  const protos = emilie.POOL_PROTOS || [];
  const uniq = new Map();
  for (const p of protos)
    for (const niv of p.niveaux || [])
      for (const [nom, duree] of niv.steps || []) {
        const g = stepGuide(nom, "pool", POOL_G);
        uniq.set(nom, { nom: `${nom} (${duree}s)`, texte: (g?.h || []).join(" "),
                        visuel: !!(g?.img || POOL_STEP_IMAGES[g?.t]) });
      }
  say("5. CHRONOMÉTRÉE (étapes à durée)");
  etapes("étapes piscine (noms uniques)", [...uniq.values()]);
  const timedEx = EXERCISES.filter((e) => e.timed);
  say(`      exercices muscu à durée (chronométrés) : ${timedEx.length} · ` +
      `dont sans animation : ${timedEx.filter((e) => !e.gif).length}`);
  say("");
}

// ------------------------------------------------------------- 7. PISCINE
{
  say("7. PISCINE");
  const protos = emilie.POOL_PROTOS || [];
  say(`      protocoles : ${protos.length} (${protos.map((p) => p.id).join(", ")})`);
  const list = [];
  for (const p of protos) {
    for (const niv of p.niveaux || []) {
      if (!niv.conseil) list.push({ nom: `${p.id}/${niv.n} conseil`, texte: "", visuel: true });
      for (const [nom] of niv.steps || []) {
        const g = stepGuide(nom, "pool", POOL_G);
        list.push({ nom: `${p.id}/${niv.n} : ${nom}`, texte: (g?.h || []).join(" "),
                    visuel: !!(g?.img || POOL_STEP_IMAGES[g?.t]) });
      }
    }
  }
  etapes("PISCINE (toutes étapes)", list);
  say(`      POOL_STEP_IMAGES : ${Object.keys(POOL_STEP_IMAGES).length} · POOL_GUIDES (emilie) : ${(emilie.POOL_GUIDES || []).length}` +
      ` · guides résolvant une image : ${POOL_G.filter((g) => g.img).length}/${POOL_G.length}`);
  say("");
}

// -------------------------------------------------------------- 8. TABATA
{
  say("8. TABATA");
  const modes = elite.TABATA_MODES || [];
  const list = [];
  for (const m of modes)
    for (const ex of m.exos || [])
      list.push({ nom: `${m.id} : ${ex}`, texte: "", visuel: false });
  say(`      modes : ${modes.length} (${modes.map((m) => m.id).join(", ")})`);
  const r = etapes("TABATA (exercices)", list);
  const patternOf = (m) =>
    /squat/i.test(m) ? "squat" : /gainage|planche/i.test(m) ? "static" : "walk";
  const rep = {};
  for (const m of modes)
    for (const ex of m.exos || []) {
      const k = patternOf(ex);
      rep[k] = (rep[k] || 0) + 1;
    }
  say(`      motif vectoriel attribué : ${Object.entries(rep).map(([k, v]) => k + "=" + v).join(" · ")}`);
  say(`      ⚠️ le builder ne distingue que 3 motifs : tous les mouvements non-squat /` +
      ` non-planche reçoivent « walk » → l'animation ne correspond pas au mouvement.`);
  say("");
}

// ---------------------------------------------------------------- 9. AQUA
{
  say("9. AQUA");
  const nomsPool = new Set();
  for (const p of emilie.POOL_PROTOS || [])
    for (const niv of p.niveaux || []) for (const [nom] of niv.steps || []) nomsPool.add(nom);
  const aquaSteps = [...nomsPool].filter((n) => /aqua|nage|bassin|eau|battement|ciseaux/.test(norm(n)));
  const list = aquaSteps.map((n) => {
    const g = stepGuide(n, "pool", POOL_G);
    return { nom: n, texte: (g?.h || []).join(" "), visuel: !!(g?.img || POOL_STEP_IMAGES[g?.t]) };
  });
  etapes("AQUA (étapes aquatiques)", list);
  say("");
}

console.log(L.join("\n"));

# Passation — Refonte des visuels « créés » (HumanAnim / human-motion)

Date : 2026-09-25. Branche : `arena/01a0d6f2-jarvis-fitness-yanis-emilie-ap`.
Contexte : tous les exercices affichent un personnage animé généré par le
moteur `human-motion` + `HumanAnim.jsx`. La refonte corrige les gestes faux
ou approximatifs, un par un, avec **vérification visuelle systématique**.

## État : refonte terminée et validée

| Phase | Contenu | État |
|---|---|---|
| B | Rigs de base (B1-B6), banc, pelvisY allongé | ✅ validée visuellement |
| C | 8 poses pattern (press, legcurl, row, bridge, calf, raise, lat, squat) | ✅ validée visuellement |
| D | 29 étirements nommés (20 poses, 4 rigs/flags nouveaux) | ✅ validée visuellement |
| E | wood-chop, ab-wheel, 2 pullovers triceps | ✅ validée visuellement |
| Tests | `tests/visuals.test.js` (6 tests, 5 bugs réels corrigés) | ✅ 100 pass / 0 fail (suite complète) |

## Fichiers touchés (dans `yanis-fitness-evolution/`)

- `src/engine/human-motion.js` — specs des poses : `POSES` (22 patterns),
  `STRETCH` (20 poses nommées) + `STRETCH_BY_NAME` (29 noms) +
  `STRETCH_TARGETS` (repli par muscle), `EXERCISE_MOTIONS` (motions
  prioritaires : wood-chop, ab-wheel, 2 pullovers, leg-extension…),
  `motionFor()` (routage exercice → motion).
- `src/components/HumanAnim.jsx` — rendu runtime (SVG/React). 20 rigs :
  stand, stand-side, wide, sit-machine, machine-seat, hang, floor-back,
  bench, figure4, prone-machine, plank, kneel-rollout, quadruped, child,
  pool, doorway, wall, cobra, sit-floor, front.
- `scripts/visuels/` — **miroir exact** du rendu pour vérification :
  `figure.mjs` (mêmes formules que HumanAnim), `raster.mjs` (rastériseur
  PNG maison, pas de dépendance système), `preview-motions.mjs` (planches
  A/MID/B + contacts), `extract-gif.mjs`. Sortie : `out/` (**non commité**,
  régénérable).
- `tests/visuals.test.js` — non-régression : couverture des 29 noms,
  repli muscle, rig/a/b valides, chaque paramètre lu par les 2 rendus,
  phase E, pas de repli générique surprise.
- `src/data/library.js`, `src/engine/demo-match.js`, `package.json`
  (omggif) — retouches sessions précédentes (routage visuels).

## Commandes

```bash
cd yanis-fitness-evolution
node scripts/visuels/preview-motions.mjs  # regen out/ : pose-*.png, stretch-n-*.png, exo-*.png, contacts
node --test tests/visuals.test.js         # 6 tests visuels
npm test                                  # suite complète (102 tests)
```

## Règles de travail (erreurs déjà payées)

- **Ne jamais paralléliser des edits sur le même fichier** (last-write-wins) ;
  un seul script python séquentiel avec asserts + grep de vérification.
- **Tout changement HumanAnim.jsx doit être miroité dans figure.mjs**
  (le test vérifie la présence des rigs/params, pas les formules : la
  parité des formules reste manuelle).
- **Toute nouvelle pose = vérification visuelle** via les planches avant
  de considérer le travail fini (pastilles : vert=A, bleu=MID, rouge=B).
- `edit_file` peut annoncer « success » sans écrire (fuzzy match) :
  toujours vérifier par grep.
- Pas de `convert` SVG→PNG (pas de rsvg) : utiliser `raster.mjs`.
- Dans les réponses `read_file` multiples d'images, **l'ordre d'affichage
  peut être inversé** : attribuer chaque image par son contenu, pas par
  l'ordre des appels.
- `interpolatePose` n'interpole que les clés présentes dans `a` : **a et b
  doivent avoir exactement les mêmes clés** (le test le vérifie).

## Points ouverts / notes

- « R5 » (mention d'une session précédente, jamais défini) : non élucidé ;
  le routage `motionFor` actuel a 5 branches (exercice → stretch →
  pattern → breathe → swim/walk → défaut mobility) et couvre tous les
  exercices sans repli surprise (test 6).
- `POSE.stretch` générique et `POSES.mobility`/`breathe` : conservés comme
  replis, jamais affichés pour un contenu nommé existant.
- Params morts supprimés : `ankle` (16 occ.), `wheel` (2 occ.),
  `bench` (2 occ.), rig fantôme `cable-high` → `stand`.

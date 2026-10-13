# ÉTAT DES 9 MODULES — 13 octobre 2026 (mesuré, pas estimé)

Ordre de travail demandé par l'utilisateur :
**échauffement · étirement · musculation · fractionné · chronométrée · elliptique · piscine · tabata · aqua**

Tous les chiffres sortent de `node scripts/audit-modules.mjs` (rejouable) et de
`animations/_locked/build/verifier-pose.py`. Rien n'a été modifié dans l'app pendant ce check.

## Santé générale (mesurée)

| Contrôle | Résultat |
|---|---|
| `npm test` (après `npm install`) | **96 tests · 94 passés · 0 échec · 2 ignorés** |
| Fichiers `/media/` référencés par le code | **154** |
| Manquants dans `public/media` / `release/media` | **0 / 0** |
| `npm run audit:assets` et `audit:animations` | 🔴 **scripts absents** → les 2 commandes cassent |

---

## 1. ÉCHAUFFEMENT — 🟢 visuels prêts (en attente du feu vert d'intégration)

- **6 étapes** générées par `warmup()` (`src/engine/fitness.js`) : mise en route · mobilité ·
  activation · approche 1/2/3 → **100 % avec visuel et 100 % avec texte**. Le module marche.
- Visuels utilisés aujourd'hui : 3 JPG **hors cible E1 de très loin**
  (saturation **4,1 / 6,3 / 8,5**, mer 0,1-0,8 %, aucune végétation, sol blanc 254).
- ✅ **3 GIF conformes existent** (`warmup-route`, `warmup-mobilite`, `warmup-approche`),
  remontés au format app et mesurés :

| GIF | Poids | Saturation | Mer | Lime | Sol (dominant) |
|---|---|---|---|---|---|
| `warmup-route-3poses-APP.gif` | 324 Ko | 46,4 | 6,67 % | 0,0 % | 251 243 219 |
| `warmup-mobilite-3poses-APP.gif` | 336 Ko | 29,4 | 21,11 % | 0,0 % | 242 237 227 |
| `warmup-approche-3poses-APP.gif` | 296 Ko | 40,8 | 7,50 % | 0,0 % | 251 243 218 |

- ⚠️ Correction de mesure (détail : `_locked/RAPPORT-R8.md`) : j'avais d'abord annoncé
  « mobilite à refaire (sol 166) ». **Faux** : le coin bas-gauche tombait sur un objet de
  premier plan. Le sol réel, mesuré par la couleur dominante, est à 242.
  Nouvelle métrique `sol_dom` ajoutée à `verifier-pose.py`, étalonnée sur les 19 images
  déjà validées (**219 → 253**). Les 3 GIF sont **dans cette plage** → aucun à refaire.
- **NON INTÉGRÉS** : en attente de l'accord explicite. 5 endroits à toucher :
  `public/media/`, `release/media/`, les deux `media-index.json`, `src/data/visuals.js`,
  et le bundle `release/assets/index-*.js` (patch **binaire** obligatoire).

## 2. ÉTIREMENT — ✅ complet

**24 étirements** (tous muscles), **100 % avec image et 100 % avec texte**
(`STRETCH_IMAGES` : 29 visuels disponibles). Aucun trou.

## 3. MUSCULATION — 🔴 le gros chantier

- **203 exercices** au total, **86 sans animation** (+ 6 exercices d'échauffement JARVIS
  = **92** au total).
- Stock déjà produit pouvant en couvrir 6 (1 seul reste à produire) :

| Exercice | GIF disponible | État |
|---|---|---|
| Pompes | `pompes-3poses.gif` | en attente d'accord |
| Squat au poids du corps | `squat-poids-du-corps-3poses.gif` | en attente (pâle 15,2) |
| Fentes arrière au poids du corps | `fentes-arriere-pdc-3poses.gif` | ✅ conforme |
| Mobilité des épaules | `mobilite-des-epaules-3poses.gif` | ✅ conforme |
| Respiration diaphragmatique | `respiration-diaphragmatique-3poses.gif` | ✅ conforme |
| Rowing à l'élastique | **aucun** | à produire |

## 4. FRACTIONNÉ — ✅

`CARDIO_STEPS` : 5 étapes (elliptique mise en route, fractionné, récup active, retour au calme,
transition) → **100 % visuel + 100 % texte**.
Types cardio proposés : Endurance · Intervalles · HIIT · Récup active (+ Émilie : Vélo elliptique,
Piscine, Repos actif).

## 5. CHRONOMÉTRÉE — 🟠

- **111 étapes à durée** (noms uniques) : **83 % avec visuel**, 19 sans
  (toutes du type « Repos (10s) » ou « Tour x/y — en place »).
- 8 exercices de musculation chronométrés, dont **2 sans animation**.

## 6. ELLIPTIQUE — ✅

Couvert par `CARDIO_STEPS` (3 étapes elliptique + transition). Module Émilie : « Vélo elliptique ».

## 7. PISCINE — 🟠

- **6 protocoles** (endurance, interval, sprint, aquahiit, recovery, aquatabata), données lues
  côté **Émilie** (`legacy.emilie.POOL_PROTOS` / `POOL_GUIDES`).
- **19 guides piscine résolvent tous une image** (9 en direct + 10 via `POOL_STEP_IMAGES`). ✅
- 420 étapes comptées, **68 % avec visuel** — les 32 % manquants sont les étapes
  « Repos » et « Tour x/y — en place » des protocoles aqua.

## 8. TABATA — 🔴 animation générique

- **6 modes × 8 mouvements = 48 mouvements**, **0 image propre** : animés par le composant
  vectoriel `<Movement>`.
- ⚠️ Le builder n'attribue que **3 motifs** : `walk = 37`, `squat = 5`, `static = 6`.
  → **37 mouvements sur 48 sont animés avec le motif « marche »**, qui ne correspond pas
  au mouvement réel (jumping jacks, burpees, mountain climbers, dips, crunch…).

## 9. AQUA — ✅

**77 étapes aquatiques**, **100 % avec visuel et 100 % avec texte**.

---

## OÙ ON EST

Modules **1, 2, 4, 6, 9** : fonctionnels. Modules **7** (reste les étapes « repos ») et **5** :
corrects. Deux chantiers réels :

1. **Module 1 — échauffement** : 3 visuels prêts et mesurés, **reste l'intégration** (feu vert).
2. **Module 3 — musculation** : 86 exercices sans animation (le chantier principal).
3. **Module 8 — tabata** : 37 mouvements animés avec un motif qui ne correspond pas.

À traiter dans l'ordre demandé : intégrer le module 1 (feu vert), puis attaquer le module 3.

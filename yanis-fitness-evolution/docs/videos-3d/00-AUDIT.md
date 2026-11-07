# ÉTAPE 1 — Audit avant modification (19/10/2026)

## 1. Framework et architecture

- **App** : `yanis-fitness-evolution` v1.5.1 — React 19 + Vite 6, packagée
  Android via **Capacitor 6** (`appId app.yanis.fitness.evolution`).
- **Données** : catalogue source `src/data/legacy.json` (programmes Yanis +
  Émilie), normalisé par `src/data/library.js` → `EXERCISES` / `EXERCISE_MAP`.
- **Affichage démos** : `src/components/Movement.jsx` (composant unique utilisé
  par les fiches exercices, les séances, les minuteurs et les modales).
- **État** : `src/store/AppContext.jsx` ; minuteurs : `src/engine/timer.js` ;
  voix coach : `src/components/VoiceCoach.jsx`.

## 2. Catalogue des exercices

- **203 exercices** au total (clé = `slug` du nom, ex.
  `extension-triceps-a-la-poulie`).
- Répartition : pec 22 · dos 24 · épaules 23 (epA 10 / epL 8 / epP 5) ·
  bic 20 · **tri 17** · qua 26 · isc 19 · fes 14 · moy 9 · abs 15 · tra 8 ·
  mol 5 · lom 1.
- Chaque exercice porte : `id, name, muscle, secondary[], stabilizers[],
  equipment[], pattern, defaultSets, repScheme, tempo, rest, note, tip, gif,
  level, timed, unit, amplitude`.

## 3. Groupes musculaires et matériel

- `MUSCLES` (17 codes), `GROUPS` + `GROUP_MEMBERS` (regroupements),
  `EQUIPMENT` (12 codes : barbell, dumbbell, cable, machine, band,
  bodyweight, bench, pullup, pool, elliptical, bike, rower).
- `SECONDARY[muscle]` = muscles secondaires automatiques.

## 4. Composants GIF / images / animations

- `Movement.jsx` + `demonstration()` : ordre GIF exact → variante explicite →
  famille (`src/engine/demo-match.js`, 3 niveaux, cache pré-calculé).
- `HumanAnim.jsx` + `src/engine/human-motion.js` : figure SVG animée créée
  quand aucun visuel humain (cartes d’exercice uniquement).
- `Anatomy.jsx` : planches avant/dos avec zones musculaires.
- Visionneuse plein écran : `ImageViewer` (`ProtocolModals.jsx`) via
  `ModalRoot.jsx` (`setModal({ type: "image", ... })`).
- ~150 médias dans `public/media/` (GIF + JPG), indexés par
  `public/media-index.json` (régénéré au build par
  `scripts/build-portable.mjs` — tout ajout sous `public/` est embarqué).

## 5. Modules d’entraînement et chronomètres

- Séances : `src/pages/Training.jsx` ; minuteur flottant + jalons vocaux
  [60-30-15-10-5-3-2-1] : `RestTimer.jsx` + `timer.js` + `voice-coach.js`.
- Séquence préservée : ÉTAPE → EXERCICE → DÉMO → CHRONOMÈTRE → TRANSITION →
  EXERCICE SUIVANT (le lecteur vidéo s’insère uniquement au niveau DÉMO,
  sans toucher au minuteur).

## 6. Emplacement des nouvelles ressources

- Vidéos : `public/videos/<id>.mp4` + posters `public/videos/posters/<id>.jpg`
  (convention : `public/videos/README.md`).
- Association : **nouveau** `src/data/exercise-videos.js`
  (`EXERCISE_VIDEOS`, statuts `pending | validated | disabled`).
- Lecteur : `Movement.jsx` (branche `<video>` prioritaire, repli GIF intact)
  + `ImageViewer` (lecture plein écran) + styles appendus à `styles.css`.
- Docs projet : `docs/videos-3d/` (ce dossier, hors build).

## 7. Compilation et tests

- `npm ci && npm test` (tests unitaires : moteur, stockage, minuteur, voix).
- `npm run build` → `release/` (dossier Capacitor `webDir`).
- APK : `npm run android:build` (voir `android/BUILD.md` + workflow
  `.github/workflows/android-release.yml`).
- **État initial** : aucune ressource supprimée ou remplacée ; ajouts seuls.
  Tests à relancer après génération des vidéos (`npm test` + lecture des
  3 vidéos pilotes sur navigateur puis APK).

## 8. Modules à ne pas dénaturer

Échauffements, étirements, circuits, Metcon piscine, Aqua Tabata, nage
fractionnée, récupération active : pas de vidéo 3D imposée — le repli
actuel (guides piscine/cardio, respiration, anatomie) reste la règle pour
tout exercice sans entrée `validated`.

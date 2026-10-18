# Démonstrations vidéo 3D — état du projet

Dernière mise à jour : 2026-10-18 · branche `arena/d5e16737-jarvis-fitness-yanis-emilie-ap`

## 1. Audit de l'application (avant toute modification)

| Point audité | Constat |
| --- | --- |
| Framework | React 19 + Vite 6, emballé en Android par **Capacitor 6** (WebView Chromium) |
| Entrée / build | `src/main.jsx` → `npm run build` → `release/` ; `npx cap sync android` copie `release/` dans l'APK |
| Catalogue | `src/data/legacy.json` (profils Yanis / Émilie) normalisé par `src/data/library.js` → `EXERCISES`, `EXERCISE_MAP` |
| Identifiants | `slug(norm(nom))`, ex. `extension-triceps-a-la-poulie` ; 260+ exercices, 17 muscles (`tri` = Triceps) |
| Affichage actuel | `src/components/Movement.jsx` : GIF source exact → association explicite (`demo-match.js`) → visuel piscine → animation SVG créée (`human-motion.js`) → respiration → atlas anatomique (`Anatomy.jsx`) |
| Atlas | `public/human/front.webp` / `back.webp` + zones tracées dans `src/components/anatomical-regions.js` |
| Séances / minuteurs | `src/pages/Training.jsx` (séance), `src/components/RestTimer.jsx`, `src/engine/timer.js`, `src/engine/workout-flow.js` |
| Médias | `public/media/*.gif` (264 fichiers), indexés par `public/media-index.json` |
| Export portable | `scripts/build-portable.mjs` : encode tous les médias de `public/` dans un HTML autonome |
| Tests | `npm test` (96 tests unitaires, sans navigateur) ; `npx playwright test` (E2E, navigateur non installable dans ce bac à sable) |

Aucune ressource existante n'a été supprimée ni remplacée : la vidéo s'ajoute **au-dessus**
de la chaîne de repli existante.

## 2. Ce qui a été livré

| Livrable | Emplacement |
| --- | --- |
| Vidéo MP4 de démonstration | `public/media/video/extension-triceps-poulie.mp4` (718 Ko, 900×1124, 24 i/s, H.264, 11,5 s) |
| Affiche (première image) | `public/media/video/extension-triceps-poulie-poster.jpg` (113 Ko) |
| Manifeste exercice → vidéo | `public/media/video/manifest.json` |
| Résolveur applicatif | `src/engine/demo-video.js` |
| Lecteur intégré | `src/components/Movement.jsx`, `src/components/modals/ProtocolModals.jsx`, `src/styles.css` |
| Tests dédiés | `tests/video-demos.test.js` |
| Générateur 3D | `tools/anatomy-video/` (Python + numpy + Pillow + ffmpeg) |
| Dossier + prompt Arena.ai | `docs/prompts/extension-triceps-a-la-poulie.md` |
| Prévisualisation | `node tools/anatomy-video/preview-server.mjs` → http://localhost:8099 |

## 3. Fonctionnement dans l'application

Ordre de résolution de `Movement` (le comportement d'origine est conservé en dessous) :

1. **Vidéo 3D validée** (uniquement si `manifest.json` contient `validated: true` et si la
   carte n'est pas une vignette compacte `small`) ;
2. GIF source exact de l'exercice ;
3. association explicite / famille (`demo-match.js`) ;
4. visuel de guide piscine ;
5. animation humaine créée (`human-motion.js`) ;
6. respiration guidée ;
7. atlas anatomique.

Garanties :

- **Repli immédiat** : si la vidéo ne se charge pas (`onError`), `Movement` bascule sur la
  chaîne d'origine dans la même seconde, sans écran vide.
- **Vignettes de séance** (`small`) : jamais de vidéo → aucune consommation de données en
  liste ; le GIF/l'animation d'origine reste affiché.
- **Animations réduites** : la vidéo démarre en pause sur son affiche ; l'utilisateur lance
  la lecture avec le bouton dédié.
- **Un seul état lecture/pause** pilote la vidéo et les animations : pause, reprise,
  changement d'exercice et retour en arrière restent cohérents avec le minuteur (le
  minuteur ne dépend pas du média).
- **Export HTML autonome** : les vidéos ne sont pas encodées en base64
  (`scripts/build-portable.mjs`), l'export retombe sur les animations d'origine.

## 4. Tests

| Test | Résultat |
| --- | --- |
| `npm test` (101 tests, dont 5 nouveaux) | ✅ 99 verts, 2 ignorés (préexistants), 0 échec |
| Association exercice ↔ vidéo, noms exacts, fichiers présents | ✅ |
| Poids des fichiers (limite 8 Mo / vidéo) | ✅ 718 Ko |
| Validation du repli `null` pour tous les autres exercices | ✅ |
| `npm run build` (Vite) | ✅ |
| Lecture H.264 / format / continuité (analyse des 276 trames) | ✅ 3 coupes de caméra, aucune anomalie |
| `npx playwright test` | ⚠️ non exécutable ici (téléchargement Chromium bloqué) — à lancer en local |
| Test sur appareil Android | ⚠️ APK non compilable dans ce bac à sable (SDK absent) — commande fournie ci-dessous |

## 5. Ce qui reste à faire (actions nécessitant ton intervention)

1. Lancer les tests navigateur en local :
   `npx playwright install chromium && npx playwright test`
2. Construire et installer l'APK :
   `npm run android:build` puis `adb install -r android/app/build/outputs/apk/release/app-release.apk`
3. Vérifier sur téléphone : ouvrir une séance contenant « Extension triceps à la poulie »,
   tester lecture/pause, puis la même séance avec le mode avion (repli sur le GIF).
4. Valider (ou refuser) le rendu visuel : c'est le seul jugement que je ne peux pas porter à
   ta place. Tant que la vidéo n'est pas validée, passer `validated` à `false` dans
   `public/media/video/manifest.json` suffit à revenir au comportement d'origine.

## 6. Coûts et limites

- **Coût : 0 €.** Aucune API payante, aucune clé, aucun envoi de données vers un service
  externe. Le rendu tourne avec Python + numpy + Pillow + ffmpeg déjà présents.
- **Poids** : ~720 Ko par vidéo ; à 260 exercices, ~190 Mo. Au-delà d'une vingtaine de
  vidéos, il faudra un stockage externe (CDN / bucket) plutôt que le dépôt Git — l'URL du
  manifeste est déjà relative, il suffira de changer `VIDEO_BASE` dans
  `src/engine/demo-video.js`.
- **Fidélité anatomique** : le personnage a été repris dans le style de la vidéo de
  référence — modèle anatomique gris argenté strié, débardeur rouge translucide, triceps
  saturés — mais ce n'est pas un scan humain réel ni une simulation de déformation
  musculaire. C'est documenté dans le manifeste et dans la fiche de l'exercice.
- **Comparatif** : `docs/video-preview/comparatif-reference-vs-rendu.jpg` (référence à
  gauche, rendu à droite).
- **Pas d'audio** : la vidéo est muette, les annonces vocales existantes restent seules
  responsables du son pendant l'effort.

## 7. Ajouter la vidéo d'un autre exercice

1. Ajouter l'exercice dans `tools/anatomy-video/` (pose + durée) ou fournir un MP4 vertical.
2. Déposer le fichier dans `public/media/video/`.
3. Ajouter une entrée dans `public/media/video/manifest.json` avec **l'identifiant exact**
   (`slug` du nom du catalogue) et `validated: true` après contrôle visuel.
4. `npm test` : les garde-fous vérifient que l'exercice existe, que le fichier est présent
   et léger, et que le nom affiché est le nom exact du catalogue.
5. `npm run build` puis `npm run android:sync`.

## 8. Régénérer la vidéo livrée

```bash
cd tools/anatomy-video
python3 video.py            # → public/media/video/extension-triceps-poulie.mp4 + affiche
python3 -c "import anatomy_badge; anatomy_badge.build_badges()"  # planches anatomiques
node preview-server.mjs     # prévisualisation http://localhost:8099
```

Dépendances : `python3`, `numpy`, `Pillow`, `imageio-ffmpeg` (fournit le binaire ffmpeg).
Le rendu est déterministe : relancer la commande redonne le même fichier.

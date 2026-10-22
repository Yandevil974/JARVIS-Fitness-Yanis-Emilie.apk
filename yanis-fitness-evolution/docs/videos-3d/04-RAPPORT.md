# ÉTAPE 9 — Rapport (mis à jour le 19/10/2026)

## Terminé ✅

- **Audit complet** : framework React 19 + Vite + Capacitor, catalogue de
  **203 exercices** (dont 17 triceps), composants GIF (`Movement.jsx`,
  `demo-match.js`), minuteurs, emplacements, build/tests (`00-AUDIT.md`).
- **Personnage avec casquette** : `personnage-casquette-squat.jpg`
  (même personnage que ta photo + casquette noire mate).
- **3 images de référence pilotes** (même personnage, muscles en rouge) :
  `ref-curl-halteres.jpg`, `ref-triceps-pushdown.jpg`, `ref-back-squat.jpg`.
- **3 dossiers pilotes** avec noms exacts + consignes réelles du catalogue
  (`01-LOT-PILOTE.md`).
- **3 prompts Arena Video prêts à copier** + gabarit générique
  (`02-PROMPTS-ARENA.md`). Le prompt triceps est la priorité (n° 2).
- **Intégration code non destructive** :
  - nouveau `src/data/exercise-videos.js` (3 pilotes en `pending`, repli GIF) ;
  - `Movement.jsx` : branche `<video>` prioritaire + Lecture/Pause + zoom ;
  - `ImageViewer` + `ModalRoot` : lecture plein écran des MP4 ;
  - styles `.movement-video` appendus à `styles.css` (aucune règle touchée) ;
  - `public/videos/` + `README.md` (conventions, compression, anti-gonflement) ;
  - posters pilotes déjà copiés dans `public/videos/posters/`.
- **Aucune ressource supprimée ou remplacée.** Séquence séance inchangée.

## En attente ⏳ (nécessite ton action : génération vidéo par toi)

- **20/10/2026 — 5 vidéos intégrées** : E1 Mise en route + E2 Épaules +
  E3 Hanches + E4 Pont fessier (kit échauffement COMPLET ✅) et le pilote
  muscu **triceps** ⭐ (`extension-triceps-a-la-poulie.mp4`, 8,6 s).
  Sources : PixVerse (E1-E4, via branche `arena/d5e16737-…`) + rendu local
  session précédente (triceps, même branche).
- **21/10/2026 — E5 intégrée, échauffement 100 % terminé** : 5 vidéos
  + aperçu complet v2 (30 s, E1→E2→E5→E3→E4). Guide des descriptions
  précises créé (`06-DESCRIPTIONS-PRECISES.md`) : prompts T1 (triceps
  chromé), M1 (curl), M2 (squat) prêts pour PixVerse/MiniMax.
- **21/10/2026 — Vague 0 CLOSE (2/2)** : squat validé+intégré
  (PixVerse 4 s, barre sur les trapèzes, filigrane bref comme E1).
  Prochaine étape : vague 1 = biceps complet (20), par lots de 4.
- **22/10/2026 — Vague 1 lot 1 intégré (biceps 5/20 avec #01)** : #02 Scott
  EZ pronation + #03 marteau assis (alterné) + #04 incliné (PixVerse 4 s,
  filigranes brefs) + #08 barre debout (FLUX 10 s, sans filigrane —
  montre une barre EZ, exactitude à confirmer).
- **22/10/2026 — #02 rejetée post-validation** : la v1 montrait une
  supination au lieu de la pronation (retour Yanis, validé trop vite sur
  petites imagettes) → vidéo désactivée (repli GIF), photo refaite
  (paumes vers le bas, vue face), prompt B2 renforcé. Leçon : contrôler
  la PRISE en gros plan avant de valider.
- **22/10/2026 — Vague 1 lot 2 intégré (biceps 7/20)** : #05 Scott EZ
  supination + #06 Scott haltère neutre + #07 poulie basse (PixVerse 4 s,
  filigranes brefs, prises vérifiées en zoom). #02/#09 parquées : prise
  pronation impossible à générer (9 rejets) → Yanis fournit une photo de
  référence du web.
- **22/10/2026 — #02/#09 débloquées par les photos Yanis** : 2 captures
  web reçues (barre + haltères au pupitre, en haut), archivées dans
  docs/videos-3d (ref-yanis-*.jpg). Constat zoom : doigts par-dessus la
  charge, bouts vers le haut, paumes vers le visage sur les 2 photos.
  Recopies chromées refaites à l'identique (comparatifs côte à côte OK),
  prompts vidéo adaptés à la nouvelle position de départ.
- **22/10/2026 — #02 vraie inversée** (ordre Yanis « curl pupitre
  inversé position haute ») : recopie chromée d'une photo de démo réelle
  (criticalbody, barre EZ en haut : dos des mains vers l'avant, doigts
  dessous, paumes vers le bas), vérifiée en comparatif. Sa photo à lui
  montrait une prise standard — la vraie inversée est l'inverse.
- **22/10/2026 — #02 parquée, lot 3 lancé** (ordre Yanis) : reprise de
  #02 plus tard sur le personnage d'origine (l'ancre photo réelle avait
  fait dériver le personnage). Lot 3 = #10 Scott haltère neutre UN BRAS
  (distinct de #06 bilatéral) + #11 Zottman assis + #12 poulie basse à
  la CORDE neutre (distinct de #07 barre supination) + #13 Zottman UN
  BRAS au Scott (distinct de #09 bilatéral). Règle perso : plus d'ancre
  photo réelle, retour au personnage d'origine en texte.
- **22/10/2026 — Lot 3 photos prêtes** : Yanis a imposé le personnage
  de #05 comme référence (« le personnage c'est ça ») → les 4 photos
  sont ancrées sur #05/#07 (style + personnage identiques, fond studio
  gris). #10 refaite (2 mains → 1 seul bras, ancre #06 pour la neutre),
  #11 refaite (mains ouvertes → poings fermés, ancre #09). Prises
  vérifiées en zoom, prompts vidéo envoyés.
- **22/10/2026 — Personnage tranché + #02/#09 relancées** : Yanis a
  re-déposé #05 (identique) + #09 d'origine fdd8154 + capture
  photo/vidéo + 1 MP4 câble. Leçon : l'ancre image-à-image ne garantit
  PAS le style (dérive miroir/contrastée) — #02 refaite en texte seul
  style « lot d'origine » (satiné, visage lisse, pad gris clair) :
  inversée correcte vérifiée en zoom. #09 restaurée à l'original.
  MP4 = curl poulie barre supination (rép complète, prise tenue) =
  doublon #07 → affectation demandée à Yanis.
- **22/10/2026 — #02 v2 VALIDÉE + #09 reçue + audio geste** : 2 MP4
  Yanis reçus. #02 (1792688200714) : inversé EZ bas→haut→bas, overhand
  vérifiée par comparatif avec la ref (doigts par-dessus), barre au
  menton → `validated` (GIF de repli conservé). #09 (1792688446226) :
  haltères haut→bas→mi-haut, supination en haut MAIS la photo validée
  impose une pronation → `pending`, Yanis arbitre. NOUVEAU (demande
  Yanis) : la description audio explique COMMENT faire le geste —
  `GESTURE_GUIDES` (#02 + #09 : position, prise, trajectoire, respi),
  lu par le guidage vocal (intro + « Consigne technique ») et affiché
  sur la fiche exercice. Fichiers : `library.js`, `voice-coach.js`,
  `VoiceCoach.jsx`, `ExerciseModal.jsx`, `Training.jsx`.
- **Manquent encore** : triceps chromé, puis vague 1 (biceps 15 restants),
  piscine, elliptique, étirements. Dépose les MP4 sur n’importe quelle
  branche, dis « c’est fait », je contrôle (grille B), j’intègre et je teste.

## Fichiers modifiés / créés

- Modifiés : `src/components/Movement.jsx`,
  `src/components/modals/ProtocolModals.jsx`, `src/components/ModalRoot.jsx`,
  `src/styles.css` (ajout seul en fin de fichier).
- Créés : `src/data/exercise-videos.js`, `public/videos/README.md`,
  `public/videos/posters/*.jpg` (3), `docs/videos-3d/*.md` (5) + visuels (5).

## Tests

- [x] **État initial 19/10/2026** : `npm test` → 94 passés, 0 échoué,
  2 ignorés (avec le nouveau code ; repli GIF garanti, pilotes en `pending`).
- [x] `npm run build` → OK (1662 modules, `release/` régénéré, posters
  embarqués dans `release/videos/`).
- [x] Syntaxe JSX vérifiée (esbuild) : `Movement.jsx`, `ModalRoot.jsx`,
  `ProtocolModals.jsx`, `exercise-videos.js`.
- [ ] Lecture des 3 vidéos + transitions + chronomètres (procédure E,
  après génération des MP4).
- [ ] APK sur téléphone (poids, lecture MP4).

## Coûts / limites

- Génération vidéo : selon ta formule Arena.ai (aucun coût engagé par moi).
- Si les muscles colorés sont infidèles sur un essai : régénérer (variante
  de correction) ou garder la vidéo pour le geste + planche anatomique de
  la fiche pour l’info musculaire exacte.

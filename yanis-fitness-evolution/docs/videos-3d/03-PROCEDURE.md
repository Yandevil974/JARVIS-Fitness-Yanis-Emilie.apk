# ÉTAPES 4 à 8 — Contrôle, montage, intégration, tests

## A. Générer (action Yanis, dans Arena.ai — fonction Video)

1. Ouvrir la fonction Video d’Arena.ai.
2. Joindre l’image de référence du pilote (`docs/videos-3d/ref-*.jpg`).
3. Coller le prompt EN correspondant (`02-PROMPTS-ARENA.md`).
4. Générer une séquence de 6 à 12 s (1 répétition complète).
5. Télécharger le MP4 (nom provisoire, ex. `triceps-essai1.mp4`).
6. Recommencer jusqu’à conformité (grille B). Noter le n° d’essai retenu.

> L’atelier de code n’a pas d’accès direct à la génération vidéo d’Arena.ai :
> aucun coût n’est engagé sans ton action, et je n’invente aucune clé API.

## B. Grille de contrôle obligatoire (chaque vidéo, avant intégration)

- [ ] Bon exercice, bon matériel, trajectoire complète et amplitude juste.
- [ ] 2 bras / 2 jambes, mains et pieds corrects, articulations cohérentes.
- [ ] Pas de déformation majeure (barre, câble, haltères stables).
- [ ] Muscles principaux bien visibles en rouge/orange, corps chromé ailleurs.
- [ ] Continuité : la fin se raccorde au début (boucle propre).
- [ ] Casquette noire présente, personnage identique aux autres pilotes.
- [ ] Fond sobre, pas de texte, pas de filigrane, pas de 2ᵉ personne.
- [ ] Durée 6-12 s, poids ≤ 8 Mo après compression (idéal 2-5 Mo).

**Si défaut** : ne PAS intégrer comme `validated`. Soit régénérer avec la
variante de correction du prompt, soit passer en `disabled` (repli GIF).

## C. Assembler si besoin (séquences courtes → démo complète)

- Si une seule séquence suffit (1 rep en boucle) : l’utiliser telle quelle.
- Sinon, assembler 2 séquences compatibles avec ffmpeg (même personnage,
  même angle, fondu de 4 images max) ; rejeter tout raccord incohérent.
- Si les muscles colorés sont infidèles : garder la vidéo pour le geste et
  laisser la planche `Anatomy.jsx` (déjà affichée dans la fiche) porter
  l’info musculaire exacte — ne jamais affirmer une coloration inexacte.

## D. Intégrer (atelier de code / Yanis)

1. Compresser : voir commandes dans `public/videos/README.md`.
2. Déposer : `public/videos/<id-exercice>.mp4`
   (+ poster `public/videos/posters/<id-exercice>.jpg`).
3. Dans `src/data/exercise-videos.js` : renseigner `src` et passer le statut
   à `"validated"`.
4. Rebuild (`npm run build`) : `media-index.json` embarque le MP4.
5. Conserver le GIF d’origine (repli automatique si `disabled`).

## E. Tester le lot pilote (avant généralisation)

1. `npm test` (régression moteur/stockage/minuteur).
2. `npm run dev` : ouvrir les 3 fiches exercices → vidéo lue, bouton
   Lecture/Pause OK, « Agrandir » OK, libellé « Vidéo anatomique 3D ».
3. Lancer une séance contenant un pilote : ÉTAPE → EXERCICE → VIDÉO →
   CHRONOMÈTRE → TRANSITION → suivant ; tester pause/reprise/retour arrière.
4. Vérifier un exercice SANS vidéo (repli GIF inchangé) et un module piscine
   (guides piscine inchangés).
5. Build APK + test sur téléphone (lecture MP4, poids total de l’APK).
6. Noter résultats et défauts dans `04-RAPPORT.md`.

## F. Généralisation (après validation des 3 pilotes par Yanis)

Par vague de 5-10 exercices : dossier (modèle `01-LOT-PILOTE.md`) → image de
référence (même personnage + casquette) → prompt (gabarit `02-PROMPTS-ARENA`)
→ génération → grille B → intégration D → tests E. Au-delà de ~20 vidéos :
stockage externe (URL https dans `src`, voir `public/videos/README.md`).

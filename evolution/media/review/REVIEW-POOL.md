# Revue — récupération piscine d'après-musculation (récupération aquatique réelle)

**23 septembre 2026.** Candidat web uniquement, `candidate-only-not-release`. SHA : `b74853bca4761ccb0f36a4f4612ed4e69b82f42b392dbf1cb7dfd7f6d047e373`.

## Défaut reprouvé sur la 1.4.0 publiée, en trois couches

Rejouer le bloc **piscine après musculation** sur le web extrait de l'**APK 1.4.0 signé** (`.cache/audit-reference-140`, servi localement) donne **3 échecs / 4**. Deux formes du défaut :

- « 30 min de piscine à allure libre… » et « 25 min de piscine : nage souple ou aquagym… » → image sèche `cardio-*` (**vélo/elliptique**) dans le bloc piscine ;
- « 25 min de piscine à allure soutenue… » → **aucune** vignette d'étape, aucune consigne.

Le test dans `tests/pool-recovery.test.mjs` évalue la fonction `bg` **exacte du bundle signé** et montre que, dans la version publiée, le texte « nage souple » tombe sur l'elliptique **même quand l'appelant déclare le format piscine** : la carte de mots-clés ne connaît que « nage douce ». Les deux échecs sont donc reproduits, pas approximés.

Captures : `pool-defect-published-1.4.0-{30min,25min}.png`, puis `pool-{candidate,reference-1.4.0}-{marche-aquatique,nage-douce,fractionne-nager}[-timer].png` (12 captures, script reproductible `candidate/capture-pool-review.mjs`).

## Correction candidate (trois verrous, un par couche fautive)

1. **Aperçu** (`G4`) : la durée passée au résolveur n'est plus le segment hérité de l'import HTML mais **le format du bloc** (`w.format==="pool"?"pool":k.segment`), via `JarvisStepGuide`.
2. **Liste affichée** : le filtre des étapes suit le même segment (`w.format==="pool"?"pool":…)` — sinon les étapes étiquetées `pool` n'étaient **jamais affichées**.
3. **Chrono** (`Mg`) : les étapes d'un composant déclaré `format:"pool"` reçoivent le segment `pool` au lieu de `post`, donc le résolveur aquatique est appelé, pas le résolveur cardio.
4. **Contexte** (`createPoolMedia`) : un segment dont la **clé de composant est déclarée pool** est aquatique, même si l'étape a gardé `post`.

## Résolution des prescriptions

`candidate/pool-texts.json` : **12 textes piscine réellement livrés** revus, précision `exact` (8) ou `representative` (4) et note de revue — 4 « Marche aquatique », 3 + 4 « Nage douce », 1 « Fractionné — nager ». Ordre de résolution : **texte revu** → mot-clé aquatique historique (conservé mais **non validé**) → **lacune explicite**. Jamais de repli cardio, jamais de photo générique, jamais l'image persistée d'une étape. `verifyPoolTexts` refuse tout texte non revu ou guide sans image.

## Limites conservées

- Aucune image persistée migrée ; aucune prescription, durée, charge ou donnée modifiée.
- Les guides aquatiques eux-mêmes n'ont pas été recertifiés médicalement.
- Constat consigné, hors périmètre : les lignes d'étape de la modale combinée affichent la durée brute en **secondes** (« 1500 s ») — comportement hérité, identique en 1.4.0 (`findings.json` → `combo-step-seconds-display`).

## Tests de ce passage

- Node : **37/37**, dont 15 dans `tests/pool-candidate.test.mjs` et 4 défauts de la version livrée dans `tests/pool-recovery.test.mjs`.
- Navigateur ciblé : **26/26 (3,5 min)**, dont 3 blocs piscine après musculation et 1 bloc cardio terrestre.
- Accueil : **8/8**, 11 rubriques, comparaison stricte avec le web 1.4.0 (57,9 s).
